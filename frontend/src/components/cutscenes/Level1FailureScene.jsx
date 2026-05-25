/**
 * Level 1 Failure — Navigation System still broken.
 */
const LEVEL_1_FAILURE_SCENES = [
    {
        type: "alert",
        icon: "⚠",
        text: "NAVIGATION SYSTEM REPAIR FAILED — SHIP STILL DRIFTING OFF COURSE.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🌌",
        text: "The navigation AI remains corrupted. Without it, the ship cannot stabilise its direction toward Earth. You're drifting further into the void with every passing moment.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🧭",
        text: "Mission Control's last transmission before signal loss: 'Cadet, the navigation system must be repaired. Review motion concepts, speed calculations, and basic physics. Then try again.'",
        duration: 5500,
    },
    {
        type: "action",
        text: "RETRY NAVIGATION REPAIR",
        buttonText: "RETRY LEVEL 1",
        duration: Infinity,
    },
];

export default LEVEL_1_FAILURE_SCENES;