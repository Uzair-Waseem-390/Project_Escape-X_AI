/**
 * Level Success — Shared across all levels.
 * Dynamically shows which system was repaired.
 */
const getSuccessScenes = (levelId, systemName, nextLevelId) => {
    const isLastLevel = levelId === 5;

    return [
        {
            type: "text",
            icon: "✅",
            text: `The ${systemName} repair is complete. Diagnostic lights flicker from red to green. One more system is back online. The ship hums with renewed power.`,
            duration: 5000,
        },
        {
            type: "text",
            icon: "📊",
            text: `Mission Control's voice crackles through the newly stabilised systems: "Good work, Cadet. ${systemName} restored. ${isLastLevel
                    ? "All systems are now operational. You're coming home."
                    : `${5 - levelId} system${5 - levelId > 1 ? "s" : ""} remaining. Keep going."`
                }`,
            duration: 5000,
        },
        {
            type: "action",
            text: isLastLevel ? "BEGIN RE-ENTRY SEQUENCE" : `CONTINUE TO LEVEL ${nextLevelId}`,
            buttonText: isLastLevel ? "🚀 GO HOME" : `▶ LEVEL ${nextLevelId}`,
            duration: Infinity,
        },
    ];
};

export default getSuccessScenes;