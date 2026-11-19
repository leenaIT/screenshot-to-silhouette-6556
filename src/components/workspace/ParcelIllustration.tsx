import { Edges, Line } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { illustrativeCoveragePolygon, parcelFrame, coverageAreas } from '@/lib/geometry';
import { parcel, regulations } from '@/lib/workspace-data';
import type { EnvelopeProps } from '@/components/Envelope3D';

export type Comparison = 'first' | 'second' | 'both';
export type Illustration = { coverage: [number, number]; floors: number; comparison: Comparison; footprint: boolean; floorsVisible: boolean; references: boolean };

function surface(points: [number, number][]) {
  return new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
}

function Annotation({ position, text, tone = 'line', width: requestedWidth }: { position: [number, number, number]; text: string; tone?: string; width?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const lines = text.split('\n');
    canvas.width = text.length < 8 ? 200 : 1024; canvas.height = lines.length * 64 + 24;
    const context = canvas.getContext('2d');
    if (context) {
      context.font = 'bold 40px "IBM Plex Sans Arabic", sans-serif';
      canvas.width = Math.ceil(Math.max(...lines.map(line => context.measureText(line).width)) + 40);
      const styles = getComputedStyle(document.documentElement);
      context.fillStyle = styles.getPropertyValue('--scene-parcel').trim(); context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = styles.getPropertyValue(`--scene-${tone}`).trim(); context.font = 'bold 40px "IBM Plex Sans Arabic", sans-serif'; context.direction = 'rtl'; context.textAlign = 'center'; lines.forEach((line, i) => context.fillText(line, canvas.width / 2, 56 + i * 64));
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text, tone]);
  useEffect(() => () => texture.dispose(), [texture]);
  const width = requestedWidth ?? (text.length < 8 ? 2 : 6);
  return <sprite position={position} scale={[width, width * texture.image.height / texture.image.width, 1]}><spriteMaterial map={texture} depthTest={false} toneMapped={false} /></sprite>;
}

export default function ParcelIllustration({ parcelPolygon = [], illustration, layers = {}, view }: EnvelopeProps) {
  const frame = parcelFrame(parcelPolygon);
  if (!illustration || parcelPolygon.length < 3) return null;
  const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--scene-${name}`).trim();
  const colors = { ground: token('ground'), parcel: token('parcel'), line: token('line'), ok: token('common'), bad: token('discrepancy'), warn: token('review'), wall: token('wall'), slab: token('slab'), glass: token('glass'), door: token('door') };
  const first = illustrativeCoveragePolygon(parcelPolygon, Math.min(...illustration.coverage));
  const second = illustrativeCoveragePolygon(parcelPolygon, Math.max(...illustration.coverage));
  const difference = surface(second);
  difference.holes.push(new THREE.Path(first.map(([x, z]) => new THREE.Vector2(x, -z))));
  const footprint = first;
  const modelFrame = parcelFrame(footprint);
  // A smaller architectural mass leaves both illustrative comparison surfaces visible.
  const width = modelFrame.width * .86, depth = modelFrame.depth * .78;
  const areas = coverageAreas(parcel.area, ...illustration.coverage);
  const floorHeight = 3.2; // Illustrative material/model proportions, never a regulatory height.
  const box = (w: number, h: number, d: number, position: [number, number, number], color: string) => <mesh position={position} castShadow receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial color={color} roughness={color === colors.glass ? .2 : .8} metalness={color === colors.glass ? .25 : 0} /><Edges color={colors.line} threshold={25} /></mesh>;
  return <group>
    <mesh rotation-x={-Math.PI / 2} position={[frame.center[0], -.09, frame.center[1]]} receiveShadow><planeGeometry args={[frame.width * 5, frame.width * 5]} /><meshStandardMaterial color={colors.ground} /></mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, .02, 0]} receiveShadow><shapeGeometry args={[surface(parcelPolygon)]} /><meshStandardMaterial color={colors.parcel} /></mesh>
    <lineLoop position={[0, .07, 0]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(parcelPolygon.flatMap(([x, z]) => [x, 0, z])), 3]} /></bufferGeometry><lineBasicMaterial color={colors.line} /></lineLoop>
    {illustration.footprint && <>
      <mesh rotation-x={-Math.PI / 2} position={[0, .13, 0]}><shapeGeometry args={[surface(first)]} /><meshBasicMaterial color={colors.ok} side={THREE.DoubleSide} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, .14, 0]}><shapeGeometry args={[difference]} /><meshBasicMaterial color={colors.bad} transparent opacity={.68} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <Line points={[...second, second[0] ?? [0, 0]].map(([x, z]) => [x, .16, z] as [number, number, number])} color={colors.bad} lineWidth={1.5} />
    </>}
    {layers.building && <group position={[modelFrame.center[0], .15, modelFrame.center[1]]} rotation-y={-frame.angle}>
      {Array.from({ length: illustration.floors }, (_, floor) => <group key={floor} position={[0, floor * floorHeight, 0]}>
        {box(width, floorHeight - .2, depth, [0, (floorHeight - .2) / 2, 0], colors.wall)}
        {box(width + .22, .2, depth + .22, [0, floorHeight - .1, 0], colors.slab)}
        {[-.3, 0, .3].map(x => <group key={x}>{[-1, 1].map(side => <group key={side}>{box(width * .14, 1.3, .12, [width * x, 1.65, side * (depth / 2 + .08)], colors.glass)}{box(.12, 1.3, depth * .15, [side * (width / 2 + .08), 1.65, depth * x], colors.glass)}</group>)}</group>)}
      </group>)}
      {box(width * .13, 2.2, .18, [-width * .3, 1.1, depth / 2 + .1], colors.door)}
      {box(width * .22, .15, .75, [-width * .3, 2.4, depth / 2 + .3], colors.slab)}
      {[-.18, -.08, .02].map(x => <group key={x}>{box(.12, illustration.floors * floorHeight - .5, .12, [width * x, illustration.floors * floorHeight / 2, depth / 2 + .08], colors.slab)}</group>)}
      {box(width + .3, .18, depth + .3, [0, illustration.floors * floorHeight + .06, 0], colors.slab)}
      {[-1, 1].map(side => <group key={side}>{box(width, .4, .16, [0, illustration.floors * floorHeight + .3, side * (depth / 2 - .08)], colors.wall)}{box(.16, .4, depth, [side * (width / 2 - .08), illustration.floors * floorHeight + .3, 0], colors.wall)}</group>)}
      {box(width * .13, .12, depth * .28, [-width * .3, .1, depth / 2 + depth * .12], colors.slab)}
      {illustration.floorsVisible && layers.dims && view !== 'top' && Array.from({ length: illustration.floors }, (_, i) => <Annotation key={i} position={[width / 2 + 1, i * floorHeight + 1.5, depth / 2]} text={i === 0 ? 'أرضي' : i === 1 ? 'أول' : `دور ${i}`} />)}
      {layers.dims && <>
        <Annotation position={[0, .3, depth / 2 + 1]} text={`${Math.min(...illustration.coverage) * 100}% مشتركة · ${areas.common.toFixed(2)} م²`} tone="common" width={8} />
        <Annotation position={[-modelFrame.width / 2 - 2, .6, modelFrame.depth * .32]} text={`${Math.max(...illustration.coverage) * 100}% · ${areas.larger.toFixed(3)} م²\nفرق ≈ ${areas.difference.toFixed(2)} م² · غير محسوم`} tone="discrepancy" width={8} />
        <Annotation position={[0, illustration.floors * floorHeight + 1.1, 0]} text={regulations.requirements.find(r => r.id === 'floors')?.value ?? ''} width={4} />
      </>}
    </group>}
    {layers.dims && <group>
      {parcelPolygon.map((p, i) => {
        const next = parcelPolygon[(i + 1) % parcelPolygon.length]; if (!next || i < 2) return null;
        const distance = Math.hypot(next[0] - p[0], next[1] - p[1]);
        const dx = (next[0] - p[0]) / distance, dz = (next[1] - p[1]) / distance;
        const mx = (p[0] + next[0]) / 2, mz = (p[1] + next[1]) / 2;
        const outward = Math.sign((mx - frame.center[0]) * -dz + (mz - frame.center[1]) * dx);
        const ox = -dz * outward * 1.3, oz = dx * outward * 1.3;
        const a: [number, number, number] = [p[0] + ox, .3, p[1] + oz], b: [number, number, number] = [next[0] + ox, .3, next[1] + oz];
        return <group key={i}><Line points={[a, b]} color={colors.line} lineWidth={1} />{[a, b].map((end, j) => <Line key={j} points={[[end[0] + (j ? -1 : 1) * dx * .55 - dz * .25, .3, end[2] + (j ? -1 : 1) * dz * .55 + dx * .25], end, [end[0] + (j ? -1 : 1) * dx * .55 + dz * .25, .3, end[2] + (j ? -1 : 1) * dz * .55 - dx * .25]]} color={colors.line} lineWidth={1} />)}<Annotation position={[mx + ox * 1.8, .5, mz + oz * 1.8]} text={`${distance.toFixed(2)} م · من الإحداثيات`} width={6} /></group>;
      })}
    </group>}
  </group>;
}