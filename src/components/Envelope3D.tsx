import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Lightformer, Edges, ContactShadows } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type View = "perspective" | "top" | "front" | "side";
export type Layer = "envelope" | "restricted" | "unresolved" | "building" | "dims" | "context";
export type Spatial = "front" | "rear" | "side" | "height" | "coverage" | "envelope" | null;

export interface Building { width: number; depth: number; floors: number; floorHeight: number; frontGap: number; sideGap: number; annex?: boolean; tone?: "neutral" | "bad" | "ok" }

export interface EnvelopeProps {
  parcelPolygon?: [number, number][];
  parcel: { width: number; depth: number };
  setbacks: { front: number; rear: number; side: number };
  maxHeight: number;
  altHeight?: number | undefined;
  layers?: Partial<Record<Layer, boolean>>;
  selected?: Spatial;
  building?: Building | null;
  view?: View;
  autoRotate?: boolean;
  interactive?: boolean;
}

const C = {
  ground: "#ebe5d8", parcel: "#f5f2eb", line: "#243d32", ok: "#4f8f63", bad: "#c2513c", warn: "#d79a32",
  build: "#e8dfcf", slab: "#c7b69c", street: "#cfc8ba", context: "#d9cfbd", olive: "#899675",
};

function Label({ position, children, tone = "line" }: { position: [number, number, number]; children: React.ReactNode; tone?: keyof typeof C }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <div style={{ background: "rgba(245,242,235,.94)", color: C[tone], border: `1px solid ${C[tone]}55`, borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", fontFamily: "IBM Plex Sans Arabic, sans-serif", direction: "rtl" }}>
        {children}
      </div>
    </Html>
  );
}

function CameraRig({ view, size }: { view: View; size: number }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null };
  useEffect(() => {
    const d = size * 1.75;
    const pos: Record<View, [number, number, number]> = {
      perspective: [d * 0.85, d * 0.7, d * 0.95], top: [0, d * 1.6, 0.01], front: [0, size * 0.25, d * 1.4], side: [d * 1.4, size * 0.25, 0],
    };
    camera.position.set(...pos[view]);
    camera.lookAt(0, 4, 0);
    if (controls) { controls.target.set(0, 4, 0); controls.update(); }
  }, [view, size, camera, controls]);
  return null;
}

function Box({ w, h, d, pos, color, opacity = 1, edge, highlight }: { w: number; h: number; d: number; pos: [number, number, number]; color: string; opacity?: number; edge?: string; highlight?: boolean }) {
  return (
    <mesh position={pos} castShadow={opacity === 1} receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={highlight ? Math.min(1, opacity + 0.3) : opacity} depthWrite={opacity === 1} roughness={0.85} emissive={highlight ? color : "#000"} emissiveIntensity={highlight ? 0.35 : 0} />
      {edge && <Edges color={edge} threshold={15} />}
    </mesh>
  );
}

function Scene({ parcel, setbacks, maxHeight, altHeight, layers = {}, selected, building, parcelPolygon }: EnvelopeProps) {
  const L = { envelope: true, restricted: true, unresolved: true, building: true, dims: true, context: true, ...layers };
  const W = parcel.width, D = parcel.depth;
  const bw = W - 2 * setbacks.side, bd = D - setbacks.front - setbacks.rear;
  const cz = (setbacks.rear - setbacks.front) / 2; // envelope center z (front at +z)
  const sel = (k: Spatial) => selected === k;

  return (
    <group>
      {/* ground + street */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[W * 5, D * 5]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, D / 2 + 10]} receiveShadow>
        <planeGeometry args={[W * 5, 20]} />
        <meshStandardMaterial color={C.street} roughness={0.95} />
      </mesh>
      {[-30, -15, 0, 15, 30].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.01, D / 2 + 10]}>
          <planeGeometry args={[4, 0.25]} />
          <meshBasicMaterial color="#f5f2eb" />
        </mesh>
      ))}
      {/* parcel */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow>
        {parcelPolygon ? <shapeGeometry args={[new THREE.Shape(parcelPolygon.map(([x, z]) => new THREE.Vector2(x, -z)))]} /> : <planeGeometry args={[W, D]} />}
        <meshStandardMaterial color={C.parcel} roughness={0.9} />
      </mesh>
      {parcelPolygon ? <lineLoop position={[0, 0.05, 0]}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(parcelPolygon.flatMap(([x, z]) => [x, 0, z])), 3]} /></bufferGeometry>
        <lineBasicMaterial color={C.olive} linewidth={2} />
      </lineLoop> : <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, 0.01, D)]} />
        <lineBasicMaterial color={C.line} />
      </lineSegments>}

      {/* neighbouring context */}
      {L.context && (
        <>
          <Box w={W - 4} h={7} d={D - 10} pos={[-W - 1, 3.5, -1]} color={C.context} />
          <Box w={W - 4} h={10} d={D - 8} pos={[W + 1, 5, -2]} color={C.context} />
          <Box w={W * 2.6} h={6} d={D * 0.7} pos={[0, 3, -D - 2]} color={C.context} />
        </>
      )}

      {/* restricted setback zones */}
      {L.restricted && (
        <>
          <Box w={W} h={0.4} d={setbacks.front} pos={[0, 0.2, D / 2 - setbacks.front / 2]} color={C.bad} opacity={0.35} edge={C.bad} highlight={sel("front")} />
          <Box w={W} h={0.4} d={setbacks.rear} pos={[0, 0.2, -D / 2 + setbacks.rear / 2]} color={C.bad} opacity={0.3} edge={C.bad} highlight={sel("rear")} />
          <Box w={setbacks.side} h={0.4} d={bd} pos={[-W / 2 + setbacks.side / 2, 0.2, cz]} color={C.bad} opacity={0.3} edge={C.bad} highlight={sel("side")} />
          <Box w={setbacks.side} h={0.4} d={bd} pos={[W / 2 - setbacks.side / 2, 0.2, cz]} color={C.bad} opacity={0.3} edge={C.bad} highlight={sel("side")} />
          {sel("front") && <Box w={W} h={maxHeight} d={setbacks.front} pos={[0, maxHeight / 2, D / 2 - setbacks.front / 2]} color={C.bad} opacity={0.12} edge={C.bad} />}
          {sel("side") && [-1, 1].map((s) => <Box key={s} w={setbacks.side} h={maxHeight} d={bd} pos={[s * (W / 2 - setbacks.side / 2), maxHeight / 2, cz]} color={C.bad} opacity={0.12} edge={C.bad} />)}
          {sel("rear") && <Box w={W} h={maxHeight} d={setbacks.rear} pos={[0, maxHeight / 2, -D / 2 + setbacks.rear / 2]} color={C.bad} opacity={0.12} edge={C.bad} />}
        </>
      )}

      {/* permitted envelope */}
      {L.envelope && (
        <Box w={bw} h={maxHeight} d={bd} pos={[0, maxHeight / 2, cz]} color={C.ok} opacity={sel("envelope") || sel("coverage") ? 0.28 : 0.14} edge={C.ok} highlight={sel("envelope")} />
      )}
      {L.envelope && sel("coverage") && <Box w={bw} h={0.15} d={bd} pos={[0, 0.1, cz]} color={C.ok} opacity={0.6} edge={C.ok} />}
      {/* floor indicators */}
      {L.envelope && Array.from({ length: Math.floor(maxHeight / 3.5) }, (_, i) => (
        <lineSegments key={i} position={[0, (i + 1) * 3.5, cz]}>
          <edgesGeometry args={[new THREE.BoxGeometry(bw, 0.001, bd)]} />
          <lineBasicMaterial color={C.ok} transparent opacity={0.55} />
        </lineSegments>
      ))}

      {/* unresolved height band */}
      {L.unresolved && altHeight && altHeight > maxHeight && (
        <Box w={bw} h={altHeight - maxHeight} d={bd} pos={[0, maxHeight + (altHeight - maxHeight) / 2, cz]} color={C.warn} opacity={sel("height") ? 0.42 : 0.22} edge={C.warn} highlight={sel("height")} />
      )}
      {sel("height") && !altHeight && <Box w={bw + 0.2} h={0.1} d={bd + 0.2} pos={[0, maxHeight, cz]} color={C.warn} opacity={0.8} />}

      {/* proposed building */}
      {L.building && building && <BuildingModel b={building} D={D} />}

      {/* dimensions */}
      {L.dims && (
        <>
          <Label position={[0, 0.6, D / 2 + 1.5]}>عرض القطعة {W} م</Label>
          <Label position={[W / 2 + 1.5, 0.6, 0]}>عمق {D} م</Label>
          <Label position={[0, 0.8, D / 2 - setbacks.front / 2]} tone="bad">ارتداد أمامي {setbacks.front} م</Label>
          <Label position={[-W / 2 + setbacks.side / 2, 0.8, cz]} tone="bad">{setbacks.side} م</Label>
          <Label position={[0, 0.8, -D / 2 + setbacks.rear / 2]} tone="bad">خلفي {setbacks.rear} م</Label>
          <Label position={[bw / 2, maxHeight + 0.6, cz + bd / 2]} tone="ok">أقصى ارتفاع {maxHeight} م</Label>
          {altHeight && altHeight > maxHeight && L.unresolved && <Label position={[-bw / 2, altHeight + 0.6, cz + bd / 2]} tone="warn">{altHeight} م — غير محسوم</Label>}
          <Label position={[0, 0.6, D / 2 + 6]} tone="olive">شارع بعرض 20 م</Label>
        </>
      )}
    </group>
  );
}

function BuildingModel({ b, D }: { b: Building; D: number }) {
  const z = D / 2 - b.frontGap - b.depth / 2;
  const tone = b.tone === "bad" ? C.bad : b.tone === "ok" ? C.ok : C.line;
  return (
    <group position={[0, 0, z]}>
      {Array.from({ length: b.floors }, (_, i) => (
        <group key={i} position={[0, i * b.floorHeight, 0]}>
          <Box w={b.width} h={b.floorHeight - 0.25} d={b.depth} pos={[0, (b.floorHeight - 0.25) / 2, 0]} color={C.build} edge={tone} />
          <Box w={b.width + 0.3} h={0.25} d={b.depth + 0.3} pos={[0, b.floorHeight - 0.125, 0]} color={C.slab} />
          {/* window bands */}
          {[-0.3, 0, 0.3].map((f) => (
            <Box key={f} w={b.width * 0.18} h={b.floorHeight * 0.45} d={0.1} pos={[f * b.width, b.floorHeight * 0.45, b.depth / 2 + 0.03]} color="#3c4a42" />
          ))}
        </group>
      ))}
      {b.annex && (
        <Box w={b.width * 0.5} h={2.9} d={b.depth * 0.5} pos={[-b.width * 0.2, b.floors * b.floorHeight + 1.45, -b.depth * 0.2]} color={C.build} edge={tone} />
      )}
    </group>
  );
}

export default function Envelope3D(props: EnvelopeProps) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const size = Math.max(props.parcel.width, props.parcel.depth);
  return (
    <div ref={ref} className="h-full w-full" data-scene-ready={ready ? "" : undefined}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 38, near: 0.5, far: 800, position: [40, 35, 45] }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; requestAnimationFrame(() => setReady(true)); }}>
        <color attach="background" args={["#efeae0"]} />
        <fog attach="fog" args={["#efeae0", size * 3, size * 7]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[30, 50, 25]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} />
        <Environment resolution={64}>
          <Lightformer intensity={1.6} position={[0, 6, 0]} scale={[12, 12, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.8} color="#e9dcc2" position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        </Environment>
        <Scene {...props} />
        <ContactShadows position={[0, 0.03, 0]} opacity={0.25} scale={size * 3} blur={2.5} far={20} />
        <OrbitControls makeDefault enabled={props.interactive !== false} autoRotate={!!props.autoRotate} autoRotateSpeed={0.6} maxPolarAngle={Math.PI / 2.05} minDistance={15} maxDistance={180} />
        <CameraRig view={props.view ?? "perspective"} size={size} />
      </Canvas>
    </div>
  );
}
