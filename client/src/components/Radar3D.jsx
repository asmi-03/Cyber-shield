import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Circle, Cone, Plane } from '@react-three/drei';

const Radar3D = () => {
    const scannerRef = useRef();

    useFrame((state, delta) => {
        if (scannerRef.current) {
            scannerRef.current.rotation.z -= delta * 1.5;
        }
    });

    return (
        <group rotation={[Math.PI / 3, 0, 0]}>
            {/* Base Grid */}
            <gridHelper args={[10, 10, 0x00f3ff, 0x111111]} />

            {/* Radar Circles */}
            <Circle args={[4.5, 64]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#00f3ff" wireframe opacity={0.3} transparent />
            </Circle>
            <Circle args={[3, 64]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#bc13fe" wireframe opacity={0.3} transparent />
            </Circle>
            <Circle args={[1.5, 64]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#ff0055" wireframe opacity={0.3} transparent />
            </Circle>

            {/* Scanning Beam */}
            <group ref={scannerRef}>
                <Cone args={[4.5, 0.1, 32, 1, true, 0, Math.PI / 4]} rotation={[0, 0, -Math.PI / 2]} position={[0, 0.05, 0]}>
                    <meshBasicMaterial color="#00f3ff" opacity={0.2} transparent side={2} />
                </Cone>
            </group>

            {/* Blips (Threats) */}
            <mesh position={[2, 0.1, 1]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ff0055" />
            </mesh>
            <mesh position={[-3, 0.1, -2]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ff0055" />
            </mesh>
            <mesh position={[1, 0.1, -1.5]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ff0055" />
            </mesh>

        </group>
    );
};

export default Radar3D;
