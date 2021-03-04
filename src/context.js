import * as THREE from 'three';

export const renderer = new THREE.WebGLRenderer();
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
