import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useKeyboard } from './hooks/useKeyboard';

const JUMP_FORCE = 4;
const SPEED = 4;

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
  }));

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

  const { moveBackward, moveForward, moveLeft, moveRight, jump } = useKeyboard();

  useFrame(() => {
    // Sync camera
    camera.position.set(pos.current[0], pos.current[1], pos.current[2]);

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

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }
  });

  return <mesh ref={ref as any} />;
};
