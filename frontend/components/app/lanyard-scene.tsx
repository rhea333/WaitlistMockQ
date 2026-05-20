"use client";

import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { Environment, Html, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useRouter, useSearchParams } from "next/navigation";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/onboarding-types";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const tagModelUrl =
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb";
const qmarkLogoUrl = "/MockQmarkLogo.png";
const qwordLogoUrl = "/MockQwordLogo.png";

if (typeof window !== "undefined") {
  useGLTF.preload(tagModelUrl);
  useTexture.preload(qmarkLogoUrl);
  useTexture.preload(qwordLogoUrl);
}

export default function LanyardScene() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAuthMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  return (
    <div className="absolute inset-0 -z-0">
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band initialAuthMode={initialAuthMode} onLogin={() => router.push("/practice")} />
        </Physics>
        <Environment background={false} blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  initialAuthMode,
  onLogin,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  initialAuthMode: "login" | "signup";
  onLogin: () => void;
}) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  const fixedAnchor = useRef<any>(null);
  const j1Anchor = useRef<any>(null);
  const j2Anchor = useRef<any>(null);
  const j3Anchor = useRef<any>(null);
  const ropeSegmentLength = 1.25;
  const cardScale = 3.2;
  const baseCardScale = 2.25;
  const cardScaleFactor = cardScale / baseCardScale;
  const cardJointAnchorY = 1.45 * cardScaleFactor;
  const cardVisualOffsetY = -1.2 * cardScaleFactor;
  const cardVisualOffsetZ = -0.05 * cardScaleFactor;
  const cardColliderArgs: [number, number, number] = [
    0.8 * cardScaleFactor,
    1.125 * cardScaleFactor,
    0.015,
  ];

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const worldP0 = new THREE.Vector3();
  const worldP1 = new THREE.Vector3();
  const worldP2 = new THREE.Vector3();
  const worldP3 = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true as const,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  };

  const { nodes, materials } = useGLTF(tagModelUrl) as any;
  const qmarkLogo = useTexture(qmarkLogoUrl);
  const qwordLogo = useTexture(qwordLogoUrl);
  const { width, height } = useThree((state) => state.size);

  const lanyardTexture = useMemo(() => {
    const logoImage = qmarkLogo.image as HTMLImageElement;
    if (!logoImage) return qmarkLogo;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return qmarkLogo;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#525258";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const logoH = canvas.height * 0.52;
    const logoW = logoH * (logoImage.width / logoImage.height);
    const logoY = (canvas.height - logoH) * 0.5;
    const count = 4;
    const sidePadding = canvas.width * 0.16;
    const step = (canvas.width - sidePadding * 2) / (count - 1);

    for (let i = 0; i < count; i += 1) {
      const centerX = sidePadding + i * step;
      const logoX = centerX - logoW * 0.5;
      ctx.drawImage(logoImage, logoX, logoY, logoW, logoH);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, [qmarkLogo]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialAuthMode);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeError, setResumeError] = useState("");

  const handleResumeFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    setResumeError("");

    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      setResumeError("PDF, DOCX, or TXT");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError("Max 5 MB");
      return;
    }

    setResumeFileName(file.name);
  }, []);

  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, cardJointAnchorY, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });

      if (band.current?.parent && fixedAnchor.current && j1Anchor.current && j2Anchor.current && j3Anchor.current) {
        const parent = band.current.parent;
        j3Anchor.current.getWorldPosition(worldP0);
        j2Anchor.current.getWorldPosition(worldP1);
        j1Anchor.current.getWorldPosition(worldP2);
        fixedAnchor.current.getWorldPosition(worldP3);

        curve.points[0].copy(parent.worldToLocal(worldP0));
        curve.points[1].copy(parent.worldToLocal(worldP1));
        curve.points[2].copy(parent.worldToLocal(worldP2));
        curve.points[3].copy(parent.worldToLocal(worldP3));
      } else {
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
      }
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  return (
    <>
      <group position={[0, 5.3, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed">
          <group ref={fixedAnchor} />
        </RigidBody>
        <RigidBody position={[0.62, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
          <group ref={j1Anchor} />
        </RigidBody>
        <RigidBody position={[1.24, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
          <group ref={j2Anchor} />
        </RigidBody>
        <RigidBody position={[1.86, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
          <group ref={j3Anchor} />
        </RigidBody>
        <RigidBody
          position={[2.48, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={cardColliderArgs} />
          <group
            scale={cardScale}
            position={[0, cardVisualOffsetY, cardVisualOffsetZ]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                color="#161616"
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh position={[0, 0.88, 0.012]} renderOrder={10}>
              <planeGeometry args={[0.2, 0.055]} />
              <meshBasicMaterial
                map={qwordLogo}
                transparent
                alphaTest={0.1}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            <Html center transform position={[0, 0.8, 0.04]} distanceFactor={1.45}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  gap: "2px",
                  padding: "2px",
                  width: "116px",
                  borderRadius: "999px",
                  border: "1px solid rgba(194,214,255,0.38)",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: authMode === "login" ? "2px" : "calc(50% + 1px)",
                    width: "calc(50% - 3px)",
                    height: "calc(100% - 4px)",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.45)",
                    transition: "left 180ms ease",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAuthMode("login");
                  }}
                  style={{
                    border: "none",
                    flex: 1,
                    position: "relative",
                    zIndex: 2,
                    background: "transparent",
                    color: authMode === "login" ? "#000000" : "#d8deee",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "8px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAuthMode("signup");
                  }}
                  style={{
                    border: "none",
                    flex: 1,
                    position: "relative",
                    zIndex: 2,
                    background: "transparent",
                    color: authMode === "signup" ? "#000000" : "#d8deee",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "8px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sign-up
                </button>
              </div>
            </Html>
            <Html center transform position={[0, 0.4, 0.04]} distanceFactor={1.45}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "130px",
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {authMode === "signup" ? (
                  <input
                    type="text"
                    placeholder="Username"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(194,214,255,0.38)",
                      boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                      borderRadius: "6px",
                      color: "#f4f4f6",
                      fontSize: "9px",
                      padding: "1px 8px",
                    }}
                  />
                ) : null}
                <input
                  type="text"
                  placeholder={authMode === "signup" ? "Email" : "Username or email"}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(194,214,255,0.38)",
                    boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                    borderRadius: "6px",
                    color: "#f4f4f6",
                    fontSize: "9px",
                    padding: "1px 8px",
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(194,214,255,0.38)",
                    boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                    borderRadius: "6px",
                    color: "#f4f4f6",
                    fontSize: "9px",
                    padding: "1px 8px",
                  }}
                />
                {authMode === "signup" ? (
                  <input
                    type="password"
                    placeholder="Re-type password"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(194,214,255,0.38)",
                      boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                      borderRadius: "6px",
                      color: "#f4f4f6",
                      fontSize: "9px",
                      padding: "1px 8px",
                    }}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogin();
                  }}
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    border: "1px solid rgba(210,224,255,0.5)",
                    boxShadow: "0 0 5px rgba(168,192,255,0.18), inset 0 0 4px rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    color: "#f4f4f6",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "5px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {authMode === "signup" ? "Sign up" : "Log in"}
                </button>
                <div
                  style={{
                    height: "1px",
                    width: "100%",
                    margin: "2px 0 1px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(190,210,255,0.85) 50%, rgba(255,255,255,0.06) 100%)",
                    boxShadow: "0 0 8px rgba(174,196,255,0.55)",
                  }}
                />
                <div
                  style={{
                    color: "rgba(240,244,255,0.8)",
                    fontSize: "9px",
                    textAlign: "center",
                    marginTop: "1px",
                  }}
                >
                  Or continue with:
                </div>
                <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogin();
                    }}
                    style={{
                      flex: 1,
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(194,214,255,0.4)",
                      boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      padding: "0",
                    }}
                  >
                    <img src="/googleLogo.png" alt="Google" style={{ height: "14px", width: "14px", objectFit: "contain" }} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogin();
                    }}
                    style={{
                      flex: 1,
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(194,214,255,0.4)",
                      boxShadow: "0 0 4px rgba(168,192,255,0.16), inset 0 0 3px rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      padding: "0",
                    }}
                  >
                    <img src="/githubLogo.png" alt="GitHub" style={{ height: "14px", width: "14px", objectFit: "contain" }} />
                  </button>
                </div>
              </div>
            </Html>
            {authMode === "signup" ? (
              <Html center transform position={[0.78, 0.55, 0.04]} distanceFactor={1.45}>
                <div
                  style={{
                    width: "118px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    padding: "7px",
                    borderRadius: "10px",
                    border: "1px solid rgba(194,214,255,0.34)",
                    background: "rgba(10,12,18,0.72)",
                    boxShadow: "0 0 7px rgba(168,192,255,0.18), inset 0 0 5px rgba(255,255,255,0.04)",
                    color: "#f4f4f6",
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "rgba(244,244,246,0.86)",
                      lineHeight: 1.1,
                    }}
                  >
                    Resume
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resumeInputRef.current?.click();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleResumeFile(file);
                    }}
                    style={{
                      minHeight: "44px",
                      border: "1px dashed rgba(210,224,255,0.44)",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(244,244,246,0.72)",
                      cursor: "pointer",
                      fontSize: "7px",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      padding: "6px",
                      textAlign: "center",
                    }}
                  >
                    {resumeFileName || "Upload PDF, DOCX, or TXT"}
                  </button>
                  {resumeError ? (
                    <div style={{ color: "#fb7185", fontSize: "7px", lineHeight: 1 }}>
                      {resumeError}
                    </div>
                  ) : null}
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleResumeFile(file);
                    }}
                  />
                </div>
              </Html>
            ) : null}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{} as any]}
          color="#8a8a90"
          depthTest
          resolution={[width, height]}
          useMap={1}
          map={lanyardTexture}
          repeat={[-3, 1]}
          lineWidth={1.6}
        />
      </mesh>
    </>
  );
}
