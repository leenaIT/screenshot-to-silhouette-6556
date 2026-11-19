import { Edges, Line } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { illustrativeCoveragePolygon, parcelFrame } from '@/lib/geometry';
import type { EnvelopeProps } from '@/components/Envelope3D';

export type Comparison = 'first' | 'second' | 'both';
export type Illustration = { coverage: [number, number]; floors: number; comparison: Comparison; footprint: boolean; floorsVisible: boolean; references: boolean };

function surface(points: [number, number][]) {
  return new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
}

function Annotation({ position, text }: { position: [number, number, number]; text: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = text.length < 8 ? 200 : 1024; canvas.height = 96;
    const context = canvas.getContext('2d');
    if (context) {
      const styles = getComputedStyle(document.documentElement);
      context.fillStyle = styles.getPropertyValue('--scene-parcel').trim(); context.fillRect(0, 0, canvas.width, 96);
      context.fillStyle = styles.getPropertyValue('--scene-line').trim(); context.font = 'bold 40px "IBM Plex Sans Arabic", sans-serif'; context.direction = 'rtl'; context.textAlign = 'center'; context.fillText(text, canvas.width / 2, 62);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  const width = text.length < 8 ? 2 : 6;
  return <sprite position={position} scale={[width, text.length < 8 ? .7 : width * .094, 1]}><spriteMaterial map={texture} depthTest={false} toneMapped={false} /></sprite>;
}

export default function ParcelIllustration({ parcelPolygon = [], illustration, layers = {} }: EnvelopeProps) {
  const frame = parcelFrame(parcelPolygon);
  if (!illustration || parcelPolygon.length < 3) return null;
  const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--scene-${name}`).trim();
  const colors = { ground: token('ground'), parcel: token('parcel'), line: token('line'), ok: token('ok'), warn: token('warn'), wall: token('wall'), slab: token('slab'), glass: token('glass'), door: token('door') };
  const first = illustrativeCoveragePolygon(parcelPolygon, illustration.coverage[0]);
  const second = illustrativeCoveragePolygon(parcelPolygon, illustration.coverage[1]);
  const difference = surface(second);
  difference.holes.push(new THREE.Path(first.map(([x, z]) => new THREE.Vector2(x, -z))));
  const footprint = illustration.comparison === 'second' ? second : first;
  const modelFrame = parcelFrame(footprint);
  const width = modelFrame.width, depth = modelFrame.depth;
  const floorHeight = 3.2; // Illustrative material/model proportions, never a regulatory height.
  const box = (w: number, h: number, d: number, position: [number, number, number], color: string) => <mesh position={position} castShadow receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial color={color} roughness={.8} /><Edges color={colors.line} /></mesh>;
  return <group>
    <mesh rotation-x={-Math.PI / 2} position={[frame.center[0], -.09, frame.center[1]]} receiveShadow><planeGeometry args={[frame.width * 5, frame.width * 5]} /><meshStandardMaterial color={colors.ground} /></mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, .02, 0]} receiveShadow><shapeGeometry args={[surface(parcelPolygon)]} /><meshStandardMaterial color={colors.parcel} /></mesh>
    <lineLoop position={[0, .07, 0]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(parcelPolygon.flatMap(([x, z]) => [x, 0, z])), 3]} /></bufferGeometry><lineBasicMaterial color={colors.line} /></lineLoop>
    {illustration.footprint && <mesh rotation-x={-Math.PI / 2} position={[0, .1, 0]}><shapeGeometry args={[surface(footprint)]} /><meshStandardMaterial color={colors.ok} transparent opacity={.42} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
    {layers.unresolved && <>
      {!illustration.footprint && <mesh rotation-x={-Math.PI / 2} position={[0, .1, 0]}><shapeGeometry args={[surface(footprint)]} /><meshStandardMaterial color={colors.ok} transparent opacity={.35} side={THREE.DoubleSide} /></mesh>}
      {illustration.comparison === 'both' && <mesh rotation-x={-Math.PI / 2} position={[0, .12, 0]}><shapeGeometry args={[difference]} /><meshStandardMaterial color={colors.warn} transparent opacity={.7} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
    </>}
    {layers.building && <group position={[frame.center[0], .02, frame.center[1]]} rotation-y={-frame.angle}>
      {Array.from({ length: illustration.floors }, (_, floor) => <group key={floor} position={[0, floor * floorHeight, 0]}>
        {box(width, floorHeight - .2, depth, [0, (floorHeight - .2) / 2, 0], colors.wall)}
        {box(width, .2, depth, [0, floorHeight - .1, 0], colors.slab)}
        {[-.3, 0, .3].map(x => <group key={x}>{[-1, 1].map(side => <group key={side}>{box(width * .14, 1.3, .12, [width * x, 1.65, side * (depth / 2 + .08)], colors.glass)}{box(.12, 1.3, depth * .15, [side * (width / 2 + .08), 1.65, depth * x], colors.glass)}</group>)}</group>)}
      </group>)}
      {box(width * .13, 2.2, .18, [-width * .3, 1.1, depth / 2 + .1], colors.door)}
      {box(width * .22, .15, .75, [-width * .3, 2.4, depth / 2 + .3], colors.slab)}
      {[-.18, -.08, .02].map(x => <group key={x}>{box(.12, illustration.floors * floorHeight - .5, .12, [width * x, illustration.floors * floorHeight / 2, depth / 2 + .08], colors.slab)}</group>)}
      {box(width, .35, depth, [0, illustration.floors * floorHeight + .15, 0], colors.wall)}
      {illustration.floorsVisible && layers.dims && Array.from({ length: illustration.floors }, (_, i) => <Annotation key={i} position={[width / 2, i * floorHeight + 1.5, depth / 2]} text={i === 0 ? 'أرضي' : 'أول'} />)}
    </group>}
    {layers.dims && <group>
      {parcelPolygon.map((p, i) => { const next = parcelPolygon[(i + 1) % parcelPolygon.length]; if (!next || i > 1) return null; const distance = Math.hypot(next[0] - p[0], next[1] - p[1]); return <group key={i}><Line points={[[p[0], .3, p[1]], [next[0], .3, next[1]]]} color={colors.line} lineWidth={1} /><Annotation position={[(p[0] + next[0]) / 2, .5, (p[1] + next[1]) / 2]} text={`${distance.toFixed(2)} م · محسوب من الإحداثيات`} /></group>; })}
    </group>}
  </group>;
}