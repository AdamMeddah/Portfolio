export default function Arrow({ position, rotation, conePos, handler }) {
  return (
    <group
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={() => {
        handler();
      }}
    >
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 1, 12]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh position={conePos} castShadow receiveShadow>
        <coneGeometry args={[0.1, 0.3, 12]} />

        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
}
