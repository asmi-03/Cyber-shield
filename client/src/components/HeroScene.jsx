import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function ShieldOrb() {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.2;
            mesh.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group>
            {/* Inner Globe/Core */}
            <Sphere args={[0.8, 64, 64]}>
                <meshStandardMaterial color="#000000" emissive="#ea2027" emissiveIntensity={0.5} wireframe />
            </Sphere>

            {/* Outer Shield */}
            <Sphere args={[1.2, 64, 64]} ref={mesh}>
                <MeshDistortMaterial
                    color="#ea2027"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0}
                    metalness={1}
                    opacity={0.2}
                    transparent
                />
            </Sphere>
        </group>
    );
}

function StarField() {
    const ref = useRef();
    const sphere = random.inSphere(new Float32Array(5000), { radius: 10 });

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} >
                <PointMaterial
                    transparent
                    color="#f79f1f"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

const HeroScene = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: '#000' }}>
            <Canvas camera={{ position: [0, 0, 4] }}>
                <fog attach="fog" args={['#000000', 5, 15]} />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} color="#ea2027" intensity={2} />

                <ShieldOrb />
                <StarField />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default HeroScene;
