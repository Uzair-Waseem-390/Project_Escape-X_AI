"""
LangGraph AI Agent for Project Escape-X AI.

Pipeline (nodes):
  1. intent_node       — classify what the user needs
  2. hint_node         — generate a concise hint (first-level help)
  3. explanation_node  — generate full step-by-step explanation
  4. youtube_node      — search YouTube for a relevant video
  5. format_node       — assemble final structured response

State transitions:
  HINT request    → hint_node → format_node
  EXPLANATION req → explanation_node → youtube_node → format_node
  WRONG ANSWER    → explanation_node → youtube_node → format_node
"""

from __future__ import annotations

import json
from typing import TypedDict, Literal, Optional

import google.generativeai as genai
from langgraph.graph import StateGraph, END

from apps.core.constants import AIRequestType
from .youtube_tool import search_youtube


# ── Agent State ───────────────────────────────────────────────────────────────

class AgentState(TypedDict):
    # Inputs
    api_key: str
    request_type: str          # AIRequestType value
    question_text: str
    subject: str
    options: dict              # {"A": ..., "B": ..., "C": ..., "D": ...}
    correct_option: str
    user_answer: str           # empty string if hint request
    user_message: str          # optional user chat message
    chat_history: list[dict]   # [{"role": "user"|"model", "parts": [...]}]

    # Intermediate
    intent: str                # "hint" | "explanation" | "wrong_answer"
    youtube_query: str

    # Outputs
    hint_text: str
    explanation_text: str
    youtube_title: str
    youtube_url: str


# ── Prompt templates ──────────────────────────────────────────────────────────

_HINT_SYSTEM = """You are an expert STEM tutor inside an educational game called Escape-X AI.
Your role right now: give ONE concise, Socratic hint that nudges the student toward the answer
WITHOUT giving it away. The hint must be:
- Maximum 2 sentences.
- Subject-specific and conceptually accurate.
- Encouraging in tone.
Do NOT reveal the correct answer or option letter."""

_EXPLANATION_SYSTEM = """You are an expert STEM tutor inside an educational game called Escape-X AI.
Your role: provide a thorough step-by-step explanation of the correct answer.
Structure your response EXACTLY as:
1. **What was asked** — restate the concept being tested (1 sentence).
2. **Why the correct answer is right** — clear logical/mathematical/scientific reasoning.
3. **Why the wrong answer is wrong** (if user answered incorrectly) — address the misconception.
4. **Key concept to remember** — a memorable takeaway (1-2 sentences).
Be warm, educational, and precise."""

_YOUTUBE_QUERY_SYSTEM = """You are a search query generator.
Given a STEM question, extract the single most important concept and return ONLY a short
YouTube search query (3-6 words) that would find the best educational video on that concept.
Return just the query string, nothing else."""


# ── Gemini helper ─────────────────────────────────────────────────────────────

def _get_model(api_key: str, system_instruction: str):
    """Returns a configured Gemini model. Tries flash-lite first, falls back to flash."""
    genai.configure(api_key=api_key)
    for model_name in ("gemini-2.5-flash-lite", "gemini-2.5-flash"):
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction,
            )
            return model
        except Exception:
            continue
    raise RuntimeError("No supported Gemini model available with this API key.")


def _chat_with_history(api_key: str, system_instruction: str, history: list[dict], user_turn: str) -> str:
    """Send a message in a Gemini chat session with existing history."""
    model = _get_model(api_key, system_instruction)
    chat = model.start_chat(history=history)
    response = chat.send_message(user_turn)
    return response.text


def _single_call(api_key: str, system_instruction: str, prompt: str) -> str:
    """Single-turn call (no history)."""
    model = _get_model(api_key, system_instruction)
    response = model.generate_content(prompt)
    return response.text


# ── Nodes ─────────────────────────────────────────────────────────────────────

def intent_node(state: AgentState) -> AgentState:
    """Normalise request type into intent string."""
    mapping = {
        AIRequestType.HINT: "hint",
        AIRequestType.EXPLANATION: "explanation",
        AIRequestType.WRONG_ANSWER: "wrong_answer",
    }
    state["intent"] = mapping.get(state["request_type"], "hint")
    return state


def hint_node(state: AgentState) -> AgentState:
    """Generate a concise hint using conversation history for statefulness."""
    question_prompt = (
        f"Subject: {state['subject'].upper()}\n"
        f"Question: {state['question_text']}\n"
        f"Options:\n"
        + "\n".join(f"  {k}: {v}" for k, v in state["options"].items())
        + f"\n\nStudent says: {state['user_message'] or 'Please give me a hint.'}"
    )

    hint = _chat_with_history(
        api_key=state["api_key"],
        system_instruction=_HINT_SYSTEM,
        history=state["chat_history"],
        user_turn=question_prompt,
    )
    state["hint_text"] = hint.strip()
    return state


def explanation_node(state: AgentState) -> AgentState:
    """Generate full step-by-step explanation with wrong-answer analysis."""
    wrong_part = ""
    if state["user_answer"] and state["user_answer"] != state["correct_option"]:
        wrong_part = f"\nThe student selected: {state['user_answer']} (INCORRECT)"

    question_prompt = (
        f"Subject: {state['subject'].upper()}\n"
        f"Question: {state['question_text']}\n"
        f"Options:\n"
        + "\n".join(f"  {k}: {v}" for k, v in state["options"].items())
        + f"\nCorrect answer: {state['correct_option']}"
        + wrong_part
        + f"\n\nStudent says: {state['user_message'] or 'Please explain this thoroughly.'}"
    )

    explanation = _chat_with_history(
        api_key=state["api_key"],
        system_instruction=_EXPLANATION_SYSTEM,
        history=state["chat_history"],
        user_turn=question_prompt,
    )
    state["explanation_text"] = explanation.strip()
    return state


def youtube_node(state: AgentState) -> AgentState:
    """Generate a YouTube search query via LLM, then fetch the top video."""
    try:
        query_prompt = (
            f"Subject: {state['subject']}\n"
            f"Question: {state['question_text']}"
        )
        raw_query = _single_call(
            api_key=state["api_key"],
            system_instruction=_YOUTUBE_QUERY_SYSTEM,
            prompt=query_prompt,
        )
        query = raw_query.strip().strip('"').strip("'")
        state["youtube_query"] = query

        videos = search_youtube(query, max_results=1)
        if videos:
            state["youtube_title"] = videos[0]["title"]
            state["youtube_url"] = videos[0]["url"]
        else:
            state["youtube_title"] = ""
            state["youtube_url"] = ""
    except Exception:
        state["youtube_title"] = ""
        state["youtube_url"] = ""

    return state


def format_node(state: AgentState) -> AgentState:
    """Final pass — nothing to mutate; state is already the output."""
    return state


# ── Routing ───────────────────────────────────────────────────────────────────

def route_after_intent(state: AgentState) -> Literal["hint_node", "explanation_node"]:
    if state["intent"] == "hint":
        return "hint_node"
    return "explanation_node"


# ── Graph assembly ────────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("intent_node", intent_node)
    graph.add_node("hint_node", hint_node)
    graph.add_node("explanation_node", explanation_node)
    graph.add_node("youtube_node", youtube_node)
    graph.add_node("format_node", format_node)

    graph.set_entry_point("intent_node")

    graph.add_conditional_edges(
        "intent_node",
        route_after_intent,
        {"hint_node": "hint_node", "explanation_node": "explanation_node"},
    )

    graph.add_edge("hint_node", "format_node")
    graph.add_edge("explanation_node", "youtube_node")
    graph.add_edge("youtube_node", "format_node")
    graph.add_edge("format_node", END)

    return graph.compile()


# Singleton compiled graph — built once, reused across tasks
_compiled_graph = build_graph()


def run_agent(state: AgentState) -> AgentState:
    """Entry point called by Celery task. Returns the final state."""
    return _compiled_graph.invoke(state)
