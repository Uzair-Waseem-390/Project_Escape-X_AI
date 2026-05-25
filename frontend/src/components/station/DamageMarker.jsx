import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

/**
 * DamageMarker — Glowing sphere + label at a damage point.
 * Props:
 *   position: [x, y, z]
 *   level: number
 *   system: string
 *   unlocked: boolean
 *   completed: boolean
 *   onClick: () => void
 */
const DamageMarker = ({ position, level, system, unlocked, completed, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Pulse animation
    useFrame((state) => {
        if (meshRef.current && !completed) {
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
            meshRef.current.scale.setScalar(hovered ? 1.3 : pulse);
            meshRef.current.material.opacity = hovered ? 1 : 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
    });

    const color = completed ? "#26c6da" : unlocked ? "#e53935" : "#5a636e";
    const glowColor = completed ? "#26c6da" : unlocked ? "#ff5252" : "#3a4149";

    return (
        <group position={position}>
            {/* Glow sphere */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = "grab";
                }}
            >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={glowColor}
                    emissiveIntensity={completed ? 0.8 : unlocked ? 1.2 : 0.3}
                    metalness={0.1}
                    roughness={0.2}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Outer glow ring */}
            <mesh>
                <ringGeometry args={[0.15, 0.18, 32]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={0.5}
                    side={2}
                />
            </mesh>

            {/* Label */}
            <Html position={[0, 0.3, 0]} center style={{ pointerEvents: "none" }}>
                <div
                    style={{
                        background: "rgba(10,11,13,0.9)",
                        border: `1px solid ${color}44`,
                        borderRadius: 4,
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.55rem",
                            color: color,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                        }}
                    >
                        L{level}: {system}
                    </span>
                </div>
            </Html>

            {/* Point light for glow */}
            <pointLight intensity={hovered ? 1.5 : 0.8} color={glowColor} distance={1.5} />
        </group>
    );
};

export default DamageMarker;