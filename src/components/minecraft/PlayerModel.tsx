import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { textureUrls } from './textures';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, NearestFilter } from 'three';

interface PlayerModelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isMoving?: boolean;
  velocity?: [number, number, number];
}

// Minecraft Steve exact proportions (in pixels converted to units)
// Steve is 32 pixels tall, we scale to 1.8 units (typical player height)
const SCALE = 1.8 / 32;

export const PlayerModel = ({ 
  position, 
  rotation = [0, 0, 0], 
  isMoving = false,
  velocity = [0, 0, 0]
}: PlayerModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  
  const animationTime = useRef(0);

  // Load a simple texture for Steve's skin
  const skinTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Steve's classic skin colors
    // Head - tan/peachy skin
    ctx.fillStyle = '#F0B478';
    ctx.fillRect(0, 0, 32, 16);
    ctx.fillRect(32, 0, 32, 16);
    
    // Hair/facial features - brown
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(8, 0, 16, 8);
    ctx.fillRect(8, 8, 8, 4);
    ctx.fillRect(16, 8, 8, 4);
    
    // Eyes - white with blue pupils
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 10, 3, 3);
    ctx.fillRect(13, 10, 3, 3);
    ctx.fillStyle = '#4287F5';
    ctx.fillRect(9, 11, 1, 1);
    ctx.fillRect(14, 11, 1, 1);

    // Body - cyan shirt
    ctx.fillStyle = '#66CCCC';
    ctx.fillRect(0, 16, 32, 16);
    ctx.fillRect(32, 16, 32, 16);
    
    // Arms - cyan sleeves transitioning to skin
    ctx.fillStyle = '#66CCCC';
    ctx.fillRect(0, 32, 16, 16);
    ctx.fillRect(16, 32, 16, 16);
    ctx.fillStyle = '#F0B478';
    ctx.fillRect(0, 44, 16, 4);
    ctx.fillRect(16, 44, 16, 4);
    
    // Legs - dark blue pants
    ctx.fillStyle = '#2B3E8C';
    ctx.fillRect(0, 48, 32, 16);
    ctx.fillRect(32, 48, 32, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Animation loop for walking
  useFrame((state, delta) => {
    if (!isMoving) {
      animationTime.current = 0;
      return;
    }

    animationTime.current += delta * 8;
    
    const swing = Math.sin(animationTime.current);
    const swingAmount = 0.5;

    // Animate arms (opposite swing)
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = swing * swingAmount;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -swing * swingAmount;
    }

    // Animate legs (opposite swing)
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = -swing * swingAmount;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = swing * swingAmount;
    }
  });

  // Create materials with pixelated textures
  const skinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xF0B478,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const shirtMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x66CCCC,
    roughness: 0.9,
    metalness: 0
  });
  
  const pantsMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2B3E8C,
    roughness: 0.9,
    metalness: 0
  });
  
  const hairMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x6B4423,
    roughness: 0.9,
    metalness: 0
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1A1A1A,
    roughness: 0.8,
    metalness: 0.1
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head - 8x8x8 pixels = 0.45 units */}
      <group position={[0, 1.35, 0]}>
        {/* Main head */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color={0xF0B478} roughness={0.8} />
        </mesh>
        
        {/* Hair/top overlay */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.48, 0.15, 0.48]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.12, 0.05, 0.226]}>
          <boxGeometry args={[0.09, 0.09, 0.01]} />
          <meshStandardMaterial color={0x4287F5} />
        </mesh>
        <mesh position={[-0.12, 0.05, 0.226]}>
          <boxGeometry args={[0.09, 0.09, 0.01]} />
          <meshStandardMaterial color={0x4287F5} />
        </mesh>
        
        {/* Beard/mouth area */}
        <mesh position={[0, -0.12, 0.226]}>
          <boxGeometry args={[0.18, 0.09, 0.01]} />
          <primitive object={hairMaterial} attach="material" />
        </mesh>
      </group>

      {/* Body - 8x12x4 pixels */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.45, 0.68, 0.225]} />
        <primitive object={shirtMaterial} attach="material" />
      </mesh>

      {/* Left Arm */}
      <group 
        ref={leftArmRef}
        position={[-0.315, 1.05, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={shirtMaterial} attach="material" />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.225, 0.15, 0.225]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group 
        ref={rightArmRef}
        position={[0.315, 1.05, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={shirtMaterial} attach="material" />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.225, 0.15, 0.225]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group 
        ref={leftLegRef}
        position={[-0.1125, 0.44, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.38, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.09, 0.28]} />
            <primitive object={shoeMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group 
        ref={rightLegRef}
        position={[0.1125, 0.44, 0]}
      >
        <group position={[0, -0.34, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.225, 0.68, 0.225]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.38, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.09, 0.28]} />
            <primitive object={shoeMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};