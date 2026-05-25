const LEVEL_3_FAILURE_SCENES = [
    {
        type: "alert",
        icon: "⚠",
        text: "COMMUNICATION ARRAY STILL DOWN — NO SIGNAL TO EARTH.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "📡",
        text: "The antenna remains misaligned. Data transmission is still corrupted. You're completely isolated — no guidance from Mission Control, no stable AI copilot.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🌊",
        text: "Study wave physics, signal transmission, and computer logic. Realign the antenna. Clear the interference. Restore your connection to Earth.",
        duration: 5000,
    },
    {
        type: "action",
        text: "RESTORE COMMUNICATION",
        buttonText: "RETRY LEVEL 3",
        duration: Infinity,
    },
];

export default LEVEL_3_FAILURE_SCENES;