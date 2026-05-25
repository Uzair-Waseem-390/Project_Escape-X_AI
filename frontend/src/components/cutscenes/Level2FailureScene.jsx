const LEVEL_2_FAILURE_SCENES = [
    {
        type: "alert",
        icon: "🔴",
        text: "POWER GRID STILL UNSTABLE — ENERGY LEAK CONTINUES.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "⚡",
        text: "The power distribution system remains critical. Non-essential systems are draining what little energy remains. The backup battery is still misconfigured.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🔋",
        text: "Review circuits, energy flow, and basic electrochemistry. Redistribute power correctly this time. Every wrong connection pushes you closer to total blackout.",
        duration: 5000,
    },
    {
        type: "action",
        text: "STABILISE THE POWER GRID",
        buttonText: "RETRY LEVEL 2",
        duration: Infinity,
    },
];

export default LEVEL_2_FAILURE_SCENES;