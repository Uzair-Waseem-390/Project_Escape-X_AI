import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import DamageMarker from "./DamageMarker";

/**
 * Premium sci-fi spaceship built with LatheGeometry + detailed parts.
 * Features: PBR materials, engine glow, particle exhaust, bloom-ready emissive.
 */

// ── Hull profile for LatheGeometry ──────────────────────────────────
const hullProfile = [
    new THREE.Vector2(0.00, 0.00),   // nose tip
    new THREE.Vector2(0.08, 0.15),
    new THREE.Vector2(0.22, 0.50),
    new THREE.Vector2(0.38, 1.00),
    new THREE.Vector2(0.48, 1.50),
    new THREE.Vector2(0.50, 2.00),   // max width
    new THREE.Vector2(0.48, 2.60),
    new THREE.Vector2(0.38, 3.10),
    new THREE.Vector2(0.22, 3.40),
    new THREE.Vector2(0.10, 3.50),   // tail
];

// ── Engine exhaust particles ────────────────────────────────────────
const EngineParticles = () => {
    const count = 80;
    const meshRef = useRef();

    const particles = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 0.25;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
            arr[i * 3 + 2] = -Math.random() * 1.5 - 0.3;
        }
        return arr;
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const pos = meshRef.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            pos.array[i * 3 + 2] -= delta * 2.5;
            if (pos.array[i * 3 + 2] < -2.0) {
                pos.array[i * 3 + 2] = -0.3;
                pos.array[i * 3] = (Math.random() - 0.5) * 0.25;
                pos.array[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
            }
            // spread outward
            pos.array[i * 3] *= 1.002;
            pos.array[i * 3 + 1] *= 1.002;
        }
        pos.needsUpdate = true;
    });

    return (
        <points ref={meshRef} position={[0, 0, -3.55]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#ff6622"
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                transparent
                opacity={0.8}
            />
        </points>
    );
};

// ── Main ship model ──────────────────────────────────────────────────
const ShipModel = ({ markers, onMarkerClick }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current && !state.pointer.isDown) {
            groupRef.current.rotation.y += delta * 0.06;
        }
    });

    return (
        <group ref={groupRef}>
            {/* === MAIN HULL (LatheGeometry) === */}
            <mesh position={[0, 0, -0.25]} castShadow>
                <latheGeometry args={[hullProfile, 32]} />
                <meshStandardMaterial
                    color="#1c1f26"
                    metalness={0.92}
                    roughness={0.18}
                />
            </mesh>

            {/* Hull armor ring 1 */}
            <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.52, 0.025, 8, 48]} />
                <meshStandardMaterial color="#2a2f38" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Hull armor ring 2 */}
            <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.50, 0.02, 8, 48]} />
                <meshStandardMaterial color="#2a2f38" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Hull armor ring 3 */}
            <mesh position={[0, 0, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.48, 0.018, 8, 48]} />
                <meshStandardMaterial color="#2a2f38" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* === COCKPIT === */}
            {/* Cockpit base */}
            <mesh position={[0, 0.15, 2.2]}>
                <sphereGeometry args={[0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
                <meshPhysicalMaterial
                    color="#4dc9f6"
                    metalness={0.05}
                    roughness={0.08}
                    transparent
                    opacity={0.6}
                    emissive="#4dc9f6"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Cockpit frame */}
            <mesh position={[0, 0.13, 2.1]}>
                <torusGeometry args={[0.3, 0.015, 8, 32]} />
                <meshStandardMaterial color="#3a4149" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* === WINGS === */}
            {/* Left wing */}
            <group position={[-0.52, -0.05, 0.2]} rotation={[0, 0, 0.18]}>
                <mesh>
                    <boxGeometry args={[1.2, 0.04, 0.8]} />
                    <meshStandardMaterial color="#1e2229" metalness={0.88} roughness={0.22} />
                </mesh>
                {/* Left wing tip accent */}
                <mesh position={[-0.6, 0, 0]}>
                    <boxGeometry args={[0.08, 0.06, 0.35]} />
                    <meshStandardMaterial
                        color="#ff3333"
                        metalness={0.6}
                        roughness={0.35}
                        emissive="#ff3333"
                        emissiveIntensity={0.4}
                    />
                </mesh>
                {/* Left wing panel line */}
                <mesh position={[0, 0.03, 0]}>
                    <boxGeometry args={[0.8, 0.005, 0.02]} />
                    <meshStandardMaterial color="#3a4149" metalness={0.9} roughness={0.15} />
                </mesh>
            </group>

            {/* Right wing */}
            <group position={[0.52, -0.05, 0.2]} rotation={[0, 0, -0.18]}>
                <mesh>
                    <boxGeometry args={[1.2, 0.04, 0.8]} />
                    <meshStandardMaterial color="#1e2229" metalness={0.88} roughness={0.22} />
                </mesh>
                {/* Right wing tip accent */}
                <mesh position={[0.6, 0, 0]}>
                    <boxGeometry args={[0.08, 0.06, 0.35]} />
                    <meshStandardMaterial
                        color="#ff3333"
                        metalness={0.6}
                        roughness={0.35}
                        emissive="#ff3333"
                        emissiveIntensity={0.4}
                    />
                </mesh>
                <mesh position={[0, 0.03, 0]}>
                    <boxGeometry args={[0.8, 0.005, 0.02]} />
                    <meshStandardMaterial color="#3a4149" metalness={0.9} roughness={0.15} />
                </mesh>
            </group>

            {/* Top fin */}
            <group position={[0, 0.5, -0.8]} rotation={[0.12, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.06, 0.35, 0.55]} />
                    <meshStandardMaterial color="#1c1f26" metalness={0.85} roughness={0.25} />
                </mesh>
            </group>

            {/* Bottom fin */}
            <group position={[0, -0.45, -0.8]} rotation={[-0.12, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.06, 0.28, 0.45]} />
                    <meshStandardMaterial color="#1c1f26" metalness={0.85} roughness={0.25} />
                </mesh>
            </group>

            {/* === COMMUNICATION ARRAY (Level 3 area) === */}
            <group position={[0, 0.68, 0.3]}>
                {/* Antenna base */}
                <mesh>
                    <cylinderGeometry args={[0.06, 0.08, 0.2, 12]} />
                    <meshStandardMaterial color="#5a636e" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Antenna mast */}
                <mesh position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
                    <meshStandardMaterial color="#8a95a0" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Dish */}
                <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 4.5, 0, 0]}>
                    <cylinderGeometry args={[0.14, 0.16, 0.03, 24]} />
                    <meshStandardMaterial color="#b0bbc5" metalness={0.85} roughness={0.25} />
                </mesh>
                {/* Dish center spike */}
                <mesh position={[0, 0.54, 0.03]}>
                    <cylinderGeometry args={[0.008, 0.015, 0.08, 8]} />
                    <meshStandardMaterial color="#d0d8e0" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>

            {/* === ENGINE SECTION === */}
            {/* Engine housing */}
            <mesh position={[0, 0, -2.4]}>
                <cylinderGeometry args={[0.38, 0.44, 0.7, 24]} />
                <meshStandardMaterial color="#1a1d24" metalness={0.92} roughness={0.18} />
            </mesh>

            {/* Main engine nozzle */}
            <mesh position={[0, 0, -2.78]}>
                <cylinderGeometry args={[0.18, 0.24, 0.4, 20]} />
                <meshStandardMaterial
                    color="#ff5522"
                    metalness={0.4}
                    roughness={0.45}
                    emissive="#ff4400"
                    emissiveIntensity={1.2}
                />
            </mesh>
            {/* Inner nozzle glow */}
            <mesh position={[0, 0, -2.95]}>
                <cylinderGeometry args={[0.08, 0.13, 0.15, 16]} />
                <meshBasicMaterial color="#ffcc66" />
            </mesh>

            {/* Side engine nozzles */}
            {[-0.2, 0.2].map((x, i) => (
                <group key={`side-${i}`}>
                    <mesh position={[x, 0, -2.65]}>
                        <cylinderGeometry args={[0.07, 0.1, 0.25, 12]} />
                        <meshStandardMaterial
                            color="#ff5522"
                            metalness={0.4}
                            roughness={0.45}
                            emissive="#ff4400"
                            emissiveIntensity={0.9}
                        />
                    </mesh>
                    <mesh position={[x, 0, -2.76]}>
                        <cylinderGeometry args={[0.03, 0.05, 0.08, 8]} />
                        <meshBasicMaterial color="#ffcc66" />
                    </mesh>
                </group>
            ))}

            {/* === SURFACE DETAILS === */}
            {/* Panel lines along hull */}
            {[-0.25, 0.25].map((x, i) => (
                <mesh key={`panel-${i}`} position={[x, 0.05, 0.4]} rotation={[0, 0.08 * (i === 0 ? 1 : -1), 0]}>
                    <boxGeometry args={[0.015, 0.005, 2.0]} />
                    <meshStandardMaterial color="#3a4149" metalness={0.9} roughness={0.2} />
                </mesh>
            ))}

            {/* Dorsal ridge */}
            <mesh position={[0, 0.2, 0.3]} rotation={[0.08, 0, 0]}>
                <boxGeometry args={[0.04, 0.03, 2.2]} />
                <meshStandardMaterial color="#2a2f38" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* === DAMAGE MARKERS === */}
            {markers.map((m) => (
                <DamageMarker
                    key={m.level}
                    position={m.position}
                    level={m.level}
                    system={m.system}
                    unlocked={m.unlocked}
                    completed={m.completed}
                    onClick={() => onMarkerClick(m)}
                />
            ))}

            {/* === LIGHTS === */}
            <pointLight position={[0, 0, -3.0]} intensity={2.5} color="#ff5500" distance={3} decay={2} />
            <pointLight position={[0, 0.2, 2.5]} intensity={1.8} color="#4dc9f6" distance={2} decay={2} />
            <pointLight position={[-0.6, -0.05, 0.2]} intensity={0.6} color="#ff3333" distance={1.5} decay={2} />
            <pointLight position={[0.6, -0.05, 0.2]} intensity={0.6} color="#ff3333" distance={1.5} decay={2} />

            {/* Engine exhaust particles */}
            <EngineParticles />
        </group>
    );
};

// ── Main exported component ──────────────────────────────────────────
const Spaceship3D = ({ markers, onMarkerClick }) => {
    return (
        <div style={{ width: "100%", height: "100vh", background: "radial-gradient(ellipse at center, #080c14 0%, #010308 70%)" }}>
            <Canvas
                camera={{ position: [1.2, 0.8, 6.5], fov: 48 }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.3,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                style={{ cursor: "grab" }}
                onPointerDown={(e) => (e.target.style.cursor = "grabbing")}
                onPointerUp={(e) => (e.target.style.cursor = "grab")}
            >
                {/* Ambient + key lights */}
                <ambientLight intensity={0.3} color="#334466" />
                <directionalLight position={[8, 6, 8]} intensity={0.9} color="#ffffff" castShadow />
                <directionalLight position={[-5, -3, -5]} intensity={0.35} color="#4466aa" />

                {/* Fill light from below */}
                <directionalLight position={[0, -3, 2]} intensity={0.25} color="#ff8844" />

                {/* Rim light for edge highlights */}
                <directionalLight position={[0, 0, -5]} intensity={0.4} color="#ff6633" />

                {/* Stars */}
                <Stars radius={120} depth={60} count={3000} factor={5} saturation={0.1} fade speed={0.4} />

                {/* Subtle environment for reflections */}
                <Environment preset="night" />

                {/* Ship */}
                <Float speed={0.35} rotationIntensity={0.04} floatIntensity={0.25}>
                    <ShipModel markers={markers} onMarkerClick={onMarkerClick} />
                </Float>

                {/* Orbit controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={3.5}
                    maxDistance={12}
                    maxPolarAngle={Math.PI * 0.72}
                    minPolarAngle={Math.PI * 0.28}
                    rotateSpeed={0.45}
                    zoomSpeed={1.1}
                    target={[0, 0, 0]}
                />
            </Canvas>
        </div>
    );
};

export default Spaceship3D;