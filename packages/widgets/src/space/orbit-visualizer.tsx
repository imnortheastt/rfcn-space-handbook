import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../shared/use-reduced-motion';

type OrbitType = 'LEO' | 'MEO' | 'GEO';

const ORBIT_PARAMS: Record<OrbitType, { altitudeKm: number; label: string }> = {
  LEO: { altitudeKm: 550, label: 'Low Earth Orbit (550 km)' },
  MEO: { altitudeKm: 8000, label: 'Medium Earth Orbit (8,000 km)' },
  GEO: { altitudeKm: 35786, label: 'Geostationary Orbit (35,786 km)' },
};

const EARTH_RADIUS = 1;
// Orbit ring radius scaled relative to Earth — purely visual, not to scale
const ORBIT_SCALE: Record<OrbitType, number> = { LEO: 1.4, MEO: 2.2, GEO: 3.8 };

/**
 * Three.js orbit visualizer. Three.js is loaded dynamically inside useEffect
 * to ensure SSR renders only a placeholder div (no top-level three import).
 *
 * @experimental Visual scale is illustrative; not to astronomical scale.
 * Use `client:visible` in Astro, never `client:load`.
 */
export function OrbitVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [orbit, setOrbit] = useState<OrbitType>('LEO');
  const [inclination, setInclination] = useState(53);
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mountRef.current) return;

    const container = mountRef.current;
    let rafId: number;
    let cancelled = false;

    async function init() {
      const THREE = await import('three');
      if (cancelled || !container) return;

      // Clear previous render
      while (container.firstChild) container.removeChild(container.firstChild);

      const width = container.clientWidth || 320;
      const height = 280;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Scene + camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
      camera.position.set(0, 2, 6);
      camera.lookAt(0, 0, 0);

      // Ambient + directional light
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const sun = new THREE.DirectionalLight(0xffffff, 1);
      sun.position.set(5, 5, 5);
      scene.add(sun);

      // Earth sphere
      const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
      const earthMat = new THREE.MeshPhongMaterial({ color: 0x2a7ae2, wireframe: false });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      // Orbit ring
      const orbitR = ORBIT_SCALE[orbit];
      const orbitGeo = new THREE.TorusGeometry(orbitR, 0.015, 8, 128);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = (inclination * Math.PI) / 180;
      scene.add(orbitRing);

      // Satellite (small box)
      const satGeo = new THREE.BoxGeometry(0.07, 0.04, 0.12);
      const satMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const satellite = new THREE.Mesh(satGeo, satMat);
      scene.add(satellite);

      let angle = 0;
      const inclRad = (inclination * Math.PI) / 180;

      function placeSatellite(theta: number) {
        const x = orbitR * Math.cos(theta);
        const y = orbitR * Math.sin(theta) * Math.sin(inclRad);
        const z = orbitR * Math.sin(theta) * Math.cos(inclRad);
        satellite.position.set(x, y, z);
      }

      placeSatellite(angle);
      renderer.render(scene, camera);

      if (!prefersReduced) {
        function animate() {
          if (cancelled) return;
          angle += 0.008;
          placeSatellite(angle);
          earth.rotation.y += 0.002;
          renderer.render(scene, camera);
          rafId = requestAnimationFrame(animate);
        }
        rafId = requestAnimationFrame(animate);
      }

      // Cleanup closure
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        renderer.dispose();
        earthGeo.dispose();
        earthMat.dispose();
        orbitGeo.dispose();
        orbitMat.dispose();
        satGeo.dispose();
        satMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    let cleanupFn: (() => void) | undefined;
    init().then((fn) => { cleanupFn = fn; }).catch(console.error);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupFn?.();
    };
  }, [mounted, orbit, inclination, prefersReduced]);

  const orbitLabel = ORBIT_PARAMS[orbit].label;

  return (
    <figure aria-label="Orbit visualizer" style={{ margin: 0 }}>
      <div role="group" aria-label="Orbit type">
        {(Object.keys(ORBIT_PARAMS) as OrbitType[]).map((o) => (
          <label key={o} style={{ marginRight: '0.75rem' }}>
            <input
              type="radio"
              name="orbit-type"
              value={o}
              checked={orbit === o}
              onChange={() => setOrbit(o)}
            />{' '}
            {o}
          </label>
        ))}
      </div>

      <label htmlFor="orbit-inc" style={{ display: 'block', marginTop: '0.5rem' }}>
        Inclination: {inclination}°
      </label>
      <input
        id="orbit-inc"
        type="range"
        min={0}
        max={90}
        step={1}
        value={inclination}
        onChange={(e) => setInclination(Number(e.target.value))}
        aria-label={`Orbital inclination ${inclination} degrees`}
      />

      {/* Three.js mounts here; placeholder div shown during SSR */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: 280, marginTop: '0.5rem', background: '#0a0a0f' }}
        aria-hidden="true"
      />

      <figcaption>
        {orbitLabel} — inclination {inclination}°.
        {prefersReduced ? ' (Static frame — reduced motion active.)' : ''}
      </figcaption>
    </figure>
  );
}
