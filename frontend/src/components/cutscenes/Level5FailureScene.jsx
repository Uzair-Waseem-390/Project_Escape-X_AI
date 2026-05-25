const LEVEL_5_FAILURE_SCENES = [
    {
        type: "alert",
        icon: "⚠",
        text: "ENGINE REPAIR FAILED — SHIP CANNOT INITIATE RE-ENTRY.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🔥",
        text: "The engine core is still unstable. Thrusters won't fire. The heat shield is compromised. Without these repairs, you'll never break atmosphere — you'll drift forever.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🌍",
        text: "Earth is right there. You can see it. Blue. Alive. Home. But you can't reach it yet. Review advanced mathematics, physics integration, and multi-step reasoning. This is the final push.",
        duration: 5500,
    },
    {
        type: "action",
        text: "FIX THE ENGINE. GO HOME.",
        buttonText: "RETRY LEVEL 5",
        duration: Infinity,
    },
];

export default LEVEL_5_FAILURE_SCENES;