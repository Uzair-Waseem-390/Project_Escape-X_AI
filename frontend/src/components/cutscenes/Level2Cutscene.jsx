/**
 * Level 2 — Power Distribution Failure
 */
const LEVEL_2_SCENES = [
    {
        type: "text",
        icon: "⚡",
        text: "The navigation reboot was successful — but it destabilised the power grid. Energy is leaking from the primary distribution system. Lights flicker. Systems shut down at random.",
        duration: 5000,
    },
    {
        type: "alert",
        icon: "🔴",
        text: "POWER DISTRIBUTION FAILING — ENERGY LEAK DETECTED. BACKUP BATTERY CRITICALLY MIS-OPTIMISED.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🔋",
        text: "The backup battery is your only lifeline if the main grid collapses completely. But it's misconfigured — drawing too much power to non-essential systems and starving the critical ones.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🧪",
        text: "You need to understand circuits, energy flow, and basic electrochemistry to redistribute power correctly. One wrong calculation and you'll lose life support entirely.",
        duration: 4500,
    },
    {
        type: "action",
        text: "STABILISE THE POWER GRID",
        buttonText: "BEGIN LEVEL 2",
        duration: Infinity,
    },
];

export default LEVEL_2_SCENES;