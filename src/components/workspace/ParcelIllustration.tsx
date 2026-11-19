import { Edges, Line } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { illustrativeCoveragePolygon, parcelFrame } from '@/lib/geometry';
import type { ParcelElement } from '@/lib/illustration-details';
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

export default function ParcelIllustration({ parcelPolygon = [], illustration, layers = {}, view, selectedElement, onElementSelect }: EnvelopeProps) {
  const gl = useThree(state => state.gl);
  useEffect(() => () => { gl.domElement.style.cursor = ''; }, [gl]);
  const events = (element: ParcelElement) => onElementSelect ? {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); gl.domElement.style.cursor = 'pointer'; },
    onPointerOut: () => { gl.domElement.style.cursor = ''; },
    onClick: (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onElementSelect(element); },
  } : {};
  const coverageSelected = selectedElement === 'shared' || selectedElement === 'difference';
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
  const floorHeight = 3.2; // Illustrative material/model proportions, never a regulatory height.
  const box = (w: number, h: number, d: number, position: [number, number, number], color: string, element: ParcelElement = 'ground') => <mesh {...events(element)} position={position} castShadow={!coverageSelected} receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial key={coverageSelected ? 'transparent' : 'solid'} color={color} transparent={coverageSelected} opacity={coverageSelected ? .12 : 1} depthWrite={!coverageSelected} emissive={selectedElement === element ? colors.warn : color} emissiveIntensity={selectedElement === element ? .35 : 0} roughness={color === colors.glass ? .2 : .8} metalness={color === colors.glass ? .25 : 0} /><Edges color={colors.line} transparent opacity={coverageSelected ? .15 : 1} threshold={25} /></mesh>;
  return <group>
    <mesh rotation-x={-Math.PI / 2} position={[frame.center[0], -.09, frame.center[1]]} onClick={() => onElementSelect?.(null)} receiveShadow><planeGeometry args={[frame.width * 5, frame.width * 5]} /><meshStandardMaterial color={colors.ground} /></mesh>
    <mesh rotation-x={-Math.PI / 2} position={[0, .02, 0]} onClick={() => onElementSelect?.(null)} receiveShadow><shapeGeometry args={[surface(parcelPolygon)]} /><meshStandardMaterial color={colors.parcel} /></mesh>
    {parcelPolygon.map(([x, z], i) => {
      const next = parcelPolygon[(i + 1) % parcelPolygon.length]; if (!next) return null;
      const direction = new THREE.Vector3(next[0] - x, 0, next[1] - z);
      const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      return <mesh key={i} {...events('boundary')} position={[(x + next[0]) / 2, .1, (z + next[1]) / 2]} quaternion={rotation}><cylinderGeometry args={[.07, .07, direction.length(), 8]} /><meshStandardMaterial color={colors.line} emissive={colors.warn} emissiveIntensity={selectedElement === 'boundary' ? .6 : 0} /></mesh>;
    })}
    {illustration.footprint && <>
      <mesh {...events('shared')} rotation-x={-Math.PI / 2} position={[0, .13, 0]}><extrudeGeometry args={[surface(first), { depth: .18, bevelEnabled: false }]} /><meshStandardMaterial color={colors.ok} emissive={colors.ok} emissiveIntensity={selectedElement === 'shared' ? .6 : .12} side={THREE.DoubleSide} /></mesh>
      <mesh {...events('difference')} rotation-x={-Math.PI / 2} position={[0, .13, 0]}><extrudeGeometry args={[difference, { depth: .22, bevelEnabled: false }]} /><meshStandardMaterial color={colors.bad} emissive={colors.bad} emissiveIntensity={selectedElement === 'difference' ? .6 : .12} transparent opacity={.92} side={THREE.DoubleSide} /></mesh>
      <Line points={[...second, second[0] ?? [0, 0]].map(([x, z]) => [x, .36, z] as [number, number, number])} color={colors.bad} lineWidth={2} />
    </>}
    {layers.building && <group position={[modelFrame.center[0], .15, modelFrame.center[1]]} rotation-y={-frame.angle}>
      {Array.from({ length: illustration.floors }, (_, floor) => <group key={floor} position={[0, floor * floorHeight, 0]} {...events(floor === 0 ? 'ground' : 'first')}>
        {box(width, floorHeight - .2, depth, [0, (floorHeight - .2) / 2, 0], colors.wall, floor === 0 ? 'ground' : 'first')}
        {box(width + .22, .2, depth + .22, [0, floorHeight - .1, 0], colors.slab, floor === 0 ? 'ground' : 'first')}
        {[-.3, 0, .3].map(x => <group key={x}>{[-1, 1].map(side => <group key={side}>{box(width * .14, 1.3, .12, [width * x, 1.65, side * (depth / 2 + .08)], colors.glass, floor === 0 ? 'ground' : 'first')}{box(.12, 1.3, depth * .15, [side * (width / 2 + .08), 1.65, depth * x], colors.glass, floor === 0 ? 'ground' : 'first')}</group>)}</group>)}
      </group>)}
      {box(width * .13, 2.2, .18, [-width * .3, 1.1, depth / 2 + .1], colors.door)}
      {box(width * .22, .15, .75, [-width * .3, 2.4, depth / 2 + .3], colors.slab)}
      {[-.18, -.08, .02].map(x => <group key={x}>{box(.12, illustration.floors * floorHeight - .5, .12, [width * x, illustration.floors * floorHeight / 2, depth / 2 + .08], colors.slab)}</group>)}
      {box(width + .3, .18, depth + .3, [0, illustration.floors * floorHeight + .06, 0], colors.slab, 'first')}
      {[-1, 1].map(side => <group key={side}>{box(width, .4, .16, [0, illustration.floors * floorHeight + .3, side * (depth / 2 - .08)], colors.wall, 'first')}{box(.16, .4, depth, [side * (width / 2 - .08), illustration.floors * floorHeight + .3, 0], colors.wall, 'first')}</group>)}
      {box(width * .13, .12, depth * .28, [-width * .3, .1, depth / 2 + depth * .12], colors.slab)}
      {illustration.floorsVisible && layers.dims && Array.from({ length: illustration.floors }, (_, i) => <group key={i} {...events(i === 0 ? 'ground' : 'first')}><Annotation position={[width / 2 + 1.5, i * floorHeight + 1.5, view === 'top' ? (i ? -1 : 1) * depth * .3 : depth / 2]} text={i === 0 ? 'أرضي' : 'أول'} width={1.4} /></group>)}
      {layers.dims && <>
        <group {...events('shared')}><Annotation position={[0, .65, depth / 2 + 1]} text={`${Math.min(...illustration.coverage) * 100}% مشترك`} tone="common" width={2.5} /></group>
        <group {...events('difference')}><Annotation position={[-modelFrame.width / 2 - 1.5, .65, depth * .3]} text="فرق التغطية" tone="discrepancy" width={2.5} /></group>
      </>}
    </group>}
    {layers.dims && <group position={[frame.center[0], 0, frame.center[1]]} rotation-y={-frame.angle} {...events('boundary')}><Annotation position={[0, .55, -frame.depth / 2 - 2]} text="حدود القطعة" width={2.5} /></group>}
  </group>;
}
