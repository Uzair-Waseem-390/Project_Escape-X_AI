from celery import shared_task


@shared_task(bind=True, max_retries=2, default_retry_delay=5)
def run_ai_interaction_task(self, interaction_id: str):
    """
    Runs the LangGraph agent for an AIInteraction asynchronously.
    Writes results back to the AIInteraction row when complete.
    """
    try:
        from apps.ai.models import AIInteraction
        from apps.ai.agent import run_agent, AgentState
        from apps.core.encryption import decrypt
        from apps.game.models import SessionQuestion

        interaction = AIInteraction.objects.select_related(
            "session__user", "session"
        ).get(id=interaction_id)

        user = interaction.session.user
        api_key = decrypt(user.gemini_api_key_encrypted)

        # Fetch the question this interaction is about
        sq = SessionQuestion.objects.select_related("question").get(
            session=interaction.session,
            order=interaction.question_order,
        )
        q = sq.question

        # Build chat history from previous interactions in this session
        history = _build_chat_history(interaction)

        state: AgentState = {
            "api_key": api_key,
            "request_type": interaction.request_type,
            "question_text": q.text,
            "subject": q.subject,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d,
            },
            "correct_option": q.correct_option,
            "user_answer": sq.user_answer or "",
            "user_message": interaction.user_message,
            "chat_history": history,
            # Outputs (will be filled by agent)
            "intent": "",
            "youtube_query": "",
            "hint_text": "",
            "explanation_text": "",
            "youtube_title": "",
            "youtube_url": "",
        }

        result = run_agent(state)

        # Persist results
        interaction.hint_text = result.get("hint_text", "")
        interaction.explanation_text = result.get("explanation_text", "")
        interaction.youtube_title = result.get("youtube_title", "")
        interaction.youtube_url = result.get("youtube_url", "")
        interaction.raw_response = _summarise_raw(result)
        interaction.save(update_fields=[
            "hint_text", "explanation_text",
            "youtube_title", "youtube_url", "raw_response",
        ])

    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=2, default_retry_delay=5)
def generate_level_report_task(self, session_id: str):
    """
    Generates a post-level AI performance report after a session completes.
    """
    try:
        from apps.ai.models import AIReport
        from apps.ai.agent import _single_call, _get_model
        from apps.core.encryption import decrypt
        from apps.game.models import GameSession, SubjectAnalytics
        from apps.core.constants import Subject

        session = GameSession.objects.select_related("user").get(id=session_id)
        user = session.user
        api_key = decrypt(user.gemini_api_key_encrypted)

        # Gather analytics for this session's level
        analytics = SubjectAnalytics.objects.filter(user=user)
        stats_text = "\n".join(
            f"- {a.subject}: {a.accuracy_percent}% accuracy, {a.total_time_seconds}s total time"
            for a in analytics
        )

        prompt = (
            f"A student just completed Level {session.level} of an escape-room STEM game.\n"
            f"Score: {session.score}/30\n"
            f"Subject performance:\n{stats_text}\n\n"
            "Generate a short, encouraging performance report with:\n"
            "1. Strongest subject (single word, lowercase, one of: math/computer/physics/chemistry/gk)\n"
            "2. Weakest subject (same format)\n"
            "3. 2-3 sentence summary of performance\n"
            "4. 2-3 concrete improvement suggestions\n\n"
            "Respond ONLY in this JSON format:\n"
            '{"strongest": "...", "weakest": "...", "summary": "...", "suggestions": "..."}'
        )

        system = "You are a helpful STEM learning coach. Always respond only in valid JSON."
        raw = _single_call(api_key, system, prompt)

        # Strip markdown code fences if present
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        import json
        data = json.loads(raw)

        AIReport.objects.update_or_create(
            session=session,
            defaults={
                "strongest_subject": data.get("strongest", ""),
                "weakest_subject": data.get("weakest", ""),
                "summary": data.get("summary", ""),
                "improvement_suggestions": data.get("suggestions", ""),
            },
        )

    except Exception as exc:
        raise self.retry(exc=exc)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _build_chat_history(current_interaction) -> list[dict]:
    """
    Returns Gemini-format chat history from previous interactions in this session.
    Format: [{"role": "user", "parts": ["..."]}, {"role": "model", "parts": ["..."]}]
    """
    from apps.ai.models import AIInteraction

    previous = AIInteraction.objects.filter(
        session=current_interaction.session,
        created_at__lt=current_interaction.created_at,
    ).order_by("created_at")

    history = []
    for interaction in previous:
        if interaction.user_message:
            history.append({"role": "user", "parts": [interaction.user_message]})
        ai_text = interaction.hint_text or interaction.explanation_text
        if ai_text:
            history.append({"role": "model", "parts": [ai_text]})

    return history


def _summarise_raw(state: dict) -> str:
    import json
    safe = {k: v for k, v in state.items() if k != "api_key"}
    return json.dumps(safe, ensure_ascii=False)[:4000]
