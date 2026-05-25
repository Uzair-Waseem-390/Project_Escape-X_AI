/**
 * Level 1 — Navigation System Failure
 * Scene data array consumed by SceneStateSystem.
 */
const LEVEL_1_SCENES = [
    {
        type: "text",
        icon: "🌌",
        text: "You are 384,000 kilometers from Earth, returning from a historic Mars research mission. The soil samples you collected could rewrite the story of life in the universe.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🛸",
        text: "Suddenly — the spacecraft shudders. Red emergency lights flood the cockpit. Alarms blare through every speaker. Something has gone terribly wrong.",
        duration: 4500,
    },
    {
        type: "alert",
        icon: "⚠",
        text: "NAVIGATION SYSTEM OFFLINE — GPS MODULE CORRUPTED. THE SHIP CANNOT STABILISE ITS DIRECTION TOWARD EARTH.",
        duration: 4000,
    },
    {
        type: "text",
        icon: "🧭",
        text: "Without the navigation system, you're drifting blindly through deep space. Every second you wait, the ship veers further off course. You must recalibrate the navigation AI — and you must do it NOW.",
        duration: 5000,
    },
    {
        type: "text",
        icon: "🧠",
        text: "The ship's emergency repair protocol is online. It requires STEM knowledge to diagnose and fix each broken system. Mathematics. Physics. Computer logic. Your education is the only tool left.",
        duration: 5000,
    },
    {
        type: "action",
        text: "REPAIR THE NAVIGATION SYSTEM",
        buttonText: "BEGIN LEVEL 1",
        duration: Infinity,
    },
];

export default LEVEL_1_SCENES;