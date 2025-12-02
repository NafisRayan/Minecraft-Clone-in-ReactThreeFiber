import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useKeyboard } from './hooks/useKeyboard';
import { useStore } from './hooks/useStore';
import { PlayerModel } from './PlayerModel';
import * as THREE from 'three';

const JUMP_FORCE = 4;
const SPEED = 4;
const THIRD_PERSON_DISTANCE = 5;

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
  }));

  const viewMode = useStore((state) => state.viewMode);
  const toggleViewMode = useStore((state) => state.toggleViewMode);

  // Player rotation state for model facing direction
  const [playerRotation, setPlayerRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isMoving, setIsMoving] = useState(false);

  // State subscriptions
  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    const unsub = api.position.subscribe((p) => (pos.current = p));
    return unsub;
  }, [api.position]);

  const vel = useRef([0, 0, 0]);
  useEffect(() => {
    const unsub = api.velocity.subscribe((v) => (vel.current = v));
    return unsub;
  }, [api.velocity]);

  const { moveBackward, moveForward, moveLeft, moveRight, jump, toggleView } = useKeyboard();

  // Handle view toggle
  useEffect(() => {
    if (toggleView) {
      toggleViewMode();
    }
  }, [toggleView, toggleViewMode]);

  useFrame(() => {
    // Sync camera based on view mode
    if (viewMode === 'firstPerson') {
      camera.position.set(pos.current[0], pos.current[1], pos.current[2]);
    } else {
      // Third person: position camera behind player
      const playerPos = pos.current;
      // Calculate camera position based on camera's current rotation
      const direction = camera.getWorldDirection(new THREE.Vector3()).negate();
      const cameraPos = new THREE.Vector3(
        playerPos[0] + direction.x * THIRD_PERSON_DISTANCE,
        playerPos[1] + 2, // Slightly above player
        playerPos[2] + direction.z * THIRD_PERSON_DISTANCE
      );
      // Place camera based on current rotation/forward vector and do NOT override
      // rotation with lookAt — PointerLockControls should control camera pitch/yaw.
      camera.position.copy(cameraPos);
    }

    const frontVector = camera.position.clone().set(
      0,
      0,
      (Number(moveBackward) - Number(moveForward))
    );
    
    const sideVector = camera.position.clone().set(
      (Number(moveLeft) - Number(moveRight)),
      0,
      0
    );

    const direction = camera.position.clone().set(0, 0, 0)
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    // Calculate player facing direction based on movement
    if (direction.length() > 0.1) {
      const angle = Math.atan2(direction.x, direction.z);
      setPlayerRotation([0, angle, 0]);
      setIsMoving(true);
    } else {
      setIsMoving(false);
    }

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }
  });

  return (
    <>
      <mesh ref={ref as any} />
      {viewMode === 'thirdPerson' && (
        <PlayerModel
          position={[pos.current[0], pos.current[1] - 0.5, pos.current[2]]}
          rotation={playerRotation}
          isMoving={isMoving}
          velocity={[vel.current[0], vel.current[1], vel.current[2]]}
        />
      )}
    </>
  );
};
