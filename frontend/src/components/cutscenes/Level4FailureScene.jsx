const LEVEL_4_FAILURE_SCENES = [
    {
        type: "alert",
        icon: "🔴",
        text: "LIFE SUPPORT STILL CRITICAL — OXYGEN LEVELS CONTINUE TO DROP.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🫁",
        text: "The oxygen regulator is still malfunctioning. Cabin pressure is unstable. Temperature control is offline. Every wrong answer cost precious air.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "⏱",
        text: "You don't have much time left. Review gas laws, pressure systems, and chemical reactions. This repair is about survival — yours. Get it right this time.",
        duration: 5000,
    },
    {
        type: "action",
        text: "SAVE LIFE SUPPORT",
        buttonText: "RETRY LEVEL 4",
        duration: Infinity,
    },
];

export default LEVEL_4_FAILURE_SCENES;