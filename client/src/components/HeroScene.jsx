import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Points, PointMaterial, useGLTF, useAnimations } from '@react-three/drei';
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

function WalkingRobot() {
    // Load the model from a reliable CDN
    const group = useRef();
    const { scene, animations } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the 'Walking' animation or 'Dance'
        // Available actions: Dance, Death, Idle, Jump, No, Punch, Running, Sitting, Standing, ThumbsUp, Walking, WalkJump, Wave, Yes
        const action = actions['Dance'] || actions['Walking'];
        if (action) {
            action.reset().fadeIn(0.5).play();
        }
        return () => action?.fadeOut(0.5);
    }, [actions]);

    useFrame((state, delta) => {
        if (group.current) {
            // Move from left to right
            group.current.position.x += delta * 1.5; // Speed

            // Reset position when it goes off screen
            if (group.current.position.x > 8) {
                group.current.position.x = -8;
            }
        }
    });

    return (
        <group ref={group} position={[-8, -2, 2]} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={scene} />
        </group>
    );
}

// Preload the model
useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');

const HeroScene = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: '#000' }}>
            <Canvas camera={{ position: [0, 0, 4] }}>
                <fog attach="fog" args={['#000000', 5, 15]} />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} color="#ea2027" intensity={2} />
                <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#00d2ff" />

                <ShieldOrb />
                <StarField />
                <WalkingRobot />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default HeroScene;
