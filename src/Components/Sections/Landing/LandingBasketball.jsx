import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import basketballModelUrl from "../../../assets/modelo/basketball.glb?url";

function disposeModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) return;
    node.geometry.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });
}

function LandingBasketball() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff6a18, 0.9);
    rimLight.position.set(3, -2, -3);
    scene.add(rimLight);

    let ball = null;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load(basketballModelUrl, (gltf) => {
      const model = gltf.scene;
      if (disposed) {
        disposeModel(model);
        return;
      }

      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      const largestDimension = Math.max(size.x, size.y, size.z);
      model.position.sub(center);
      model.scale.multiplyScalar(2.08 / largestDimension);
      ball = model;
      scene.add(ball);
    });

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(container);

    let frameId;
    let previousTime = 0;
    const animate = (time) => {
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      if (ball) ball.rotation.y += delta * 0.22;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      disposed = true;
      resizeObserver.disconnect();
      if (ball) disposeModel(ball);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-ball-scene" ref={containerRef} aria-hidden="true" />;
}

export default LandingBasketball;