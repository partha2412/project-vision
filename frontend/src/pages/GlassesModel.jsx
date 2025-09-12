import React from "react";
import { useGLTF } from "@react-three/drei";

export function GlassesModel(props) {
  const { scene } = useGLTF("/models/glasses.glb"); // Must be in public/models
  return <primitive object={scene} {...props} />;
}
