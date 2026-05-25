/**
 * Level 3 — Communication System Breakdown
 */
const LEVEL_3_SCENES = [
    {
        type: "text",
        icon: "📡",
        text: "Power is stable. But the surge from the reboot fried the communication array. The antenna is misaligned. Data transmission is corrupted. You are completely cut off from Earth.",
        duration: 5000,
    },
    {
        type: "alert",
        icon: "⚠",
        text: "COMMUNICATION ARRAY DOWN — NO SIGNAL TO EARTH. THE AI COPILOT IS DESTABILISING.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🤖",
        text: "Even your AI copilot — your only companion out here — is glitching. Without comms, Mission Control cannot guide you. Without the AI, you lose your best problem-solving tool.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🌊",
        text: "Restoring communication means understanding waves, signals, and data transmission. Physics and computer science are your tools now. Realign the antenna. Restore the signal.",
        duration: 4500,
    },
    {
        type: "action",
        text: "RESTORE COMMUNICATION",
        buttonText: "BEGIN LEVEL 3",
        duration: Infinity,
    },
];

export default LEVEL_3_SCENES;