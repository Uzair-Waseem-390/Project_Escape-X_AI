/**
 * Level 5 — Engine Core & Landing System Failure (Final Level)
 */
const LEVEL_5_SCENES = [
    {
        type: "text",
        icon: "🔥",
        text: "Life support is stable. You can breathe again. But there's one final, catastrophic problem — the main engine core and landing systems are critically damaged.",
        duration: 5000,
    },
    {
        type: "alert",
        icon: "⚠",
        text: "ENGINE CORE UNSTABLE — THRUSTERS OFFLINE. RE-ENTRY HEAT SHIELD COMPROMISED. LANDING TRAJECTORY MISALIGNED.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🚀",
        text: "This is it. The final repair. Without the engine, you'll drift forever in the void. Without the heat shield, re-entry will burn you to nothing. Without trajectory control, you'll miss Earth entirely.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🧮",
        text: "This repair requires everything you've learned. Advanced mathematics. Complex physics integration. Multi-step logical reasoning. All five STEM subjects. All your courage. All your knowledge.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🌍",
        text: "Earth is visible through the cockpit window. Blue and beautiful. So close you could almost touch it. One final push. One final repair. Then you can finally go home.",
        duration: 5000,
    },
    {
        type: "action",
        text: "FIX THE ENGINE. GO HOME.",
        buttonText: "BEGIN LEVEL 5",
        duration: Infinity,
    },
];

export default LEVEL_5_SCENES;