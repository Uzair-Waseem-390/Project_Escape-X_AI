/**
 * Level 4 — Life Support System Critical Failure
 */
const LEVEL_4_SCENES = [
    {
        type: "text",
        icon: "🫁",
        text: "Comms are back online — but the life support system is failing. Oxygen levels are destabilising. Cabin temperature is dropping. Pressure is fluctuating wildly.",
        duration: 5000,
    },
    {
        type: "alert",
        icon: "🔴",
        text: "LIFE SUPPORT CRITICAL — OXYGEN LEVELS DROPPING. CREW SURVIVAL NOT GUARANTEED BEYOND 15 MINUTES.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🌡️",
        text: "This is the most dangerous repair yet. You need to understand gas laws, pressure systems, and chemical reactions. The oxygen regulator must be recalibrated. The temperature control must be restored.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "⏱",
        text: "You have 15 minutes. Every question you answer correctly brings the life support systems back online. Every mistake costs precious oxygen. Think fast. Think smart. Your life depends on it.",
        duration: 5000,
    },
    {
        type: "action",
        text: "SAVE LIFE SUPPORT",
        buttonText: "BEGIN LEVEL 4",
        duration: Infinity,
    },
];

export default LEVEL_4_SCENES;