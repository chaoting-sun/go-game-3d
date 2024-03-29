const BoardFoot = ({ position, texture }) => {
  return (
    <mesh position={position}>
      <cylinderGeometry attach="geometry" args={[1, 1, 2]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default BoardFoot;
