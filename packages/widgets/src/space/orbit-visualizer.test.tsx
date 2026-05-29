import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrbitVisualizer } from './orbit-visualizer';

// Stub Three.js — dynamic import inside useEffect fires async after initial render.
// We only need no-op constructors so the effect doesn't throw when three is loaded.
vi.mock('three', () => {
  const noop = function () {};
  noop.prototype.set = () => {};
  noop.prototype.lookAt = () => {};
  noop.prototype.add = () => {};
  noop.prototype.dispose = () => {};

  const MockMesh = function () {
    this.position = { set: () => {} };
    this.rotation = { x: 0, y: 0, z: 0 };
  };

  const MockRenderer = function () {
    this.domElement = document.createElement('canvas');
    this.setSize = () => {};
    this.setPixelRatio = () => {};
    this.render = () => {};
    this.dispose = () => {};
  };

  const MockScene = function () {
    this.add = () => {};
  };

  const MockCamera = function () {
    this.position = { set: () => {} };
    this.lookAt = () => {};
    this.aspect = 1;
    this.updateProjectionMatrix = () => {};
  };

  const MockGeo = function () { this.dispose = () => {}; };
  const MockMat = function () { this.dispose = () => {}; };

  return {
    WebGLRenderer: MockRenderer,
    Scene: MockScene,
    PerspectiveCamera: MockCamera,
    SphereGeometry: MockGeo,
    TorusGeometry: MockGeo,
    BoxGeometry: MockGeo,
    MeshPhongMaterial: MockMat,
    MeshBasicMaterial: MockMat,
    Mesh: MockMesh,
    AmbientLight: noop,
    DirectionalLight: function () { this.position = { set: () => {} }; },
  };
});

describe('OrbitVisualizer', () => {
  it('renders placeholder div without crashing (SSR-safe initial state)', () => {
    const { container } = render(<OrbitVisualizer />);
    const mountDiv = container.querySelector('div[aria-hidden="true"]');
    expect(mountDiv).toBeTruthy();
  });

  it('has orbit type radio buttons with accessible labels', () => {
    render(<OrbitVisualizer />);
    expect(screen.getByRole('radio', { name: 'LEO' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'MEO' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'GEO' })).toBeTruthy();
  });

  it('updates figcaption when orbit type changes', () => {
    const { getByRole, getByText } = render(<OrbitVisualizer />);
    fireEvent.click(getByRole('radio', { name: 'GEO' }));
    expect(getByText(/Geostationary Orbit/i)).toBeTruthy();
  });
});
