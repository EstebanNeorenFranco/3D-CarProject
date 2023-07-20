import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model3D = () => {
  const mountRef = useRef(null);
  const moveDistance = 0.1; // Distancia base de movimiento
  const moveSpeedMultiplier = 2; // Multiplicador para aumentar la velocidad

  // Estado para rastrear qué teclas están siendo presionadas
  const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  let model; // Referencia al modelo 3D cargado

  useEffect(() => {
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x5b00ff);
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 1000);
    scene.add(camera);

    camera.position.z = 6;
    camera.position.x = 6;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/Models/suv.gltf', // Ruta al archivo glb o gltf del modelo
      (gltf) => {
        // Callback cuando el modelo ha sido cargado
        model = gltf.scene;
        scene.add(model); // Agregar el modelo a la escena
        // Puedes ajustar la posición, escala u orientación del modelo aquí si es necesario
      },
      undefined,
      (error) => {
        console.error('Error al cargar el modelo:', error);
      }
    );

    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ajustar la cámara para mirar hacia el origen

    const ambientalLight = new THREE.AmbientLight(0xff0000, 15);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(8, 8, 8);
    scene.add(pointLight);

    const clock = new THREE.Clock();

    const updateCubePosition = () => {
      if (!model) return; // Salir si el modelo no está cargado

      // Obtener la posición actual del modelo
      const modelPosition = new THREE.Vector3();
      modelPosition.copy(model.position);

      // Actualizar la posición del modelo según las teclas presionadas
      if (keys.w) {
        modelPosition.z -= moveDistance * moveSpeedMultiplier;
      }
      if (keys.a) {
        modelPosition.x -= moveDistance * moveSpeedMultiplier;
      }
      if (keys.s) {
        modelPosition.z += moveDistance * moveSpeedMultiplier;
      }
      if (keys.d) {
        modelPosition.x += moveDistance * moveSpeedMultiplier;
      }

      // Aplicar la nueva posición al modelo
      model.position.copy(modelPosition);
    };

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      updateCubePosition();

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const resize = () => {
      const updateWidth = currentRef.clientWidth;
      const updateHeight = currentRef.clientHeight;
      renderer.setSize(updateWidth, updateHeight);
      camera.aspect = updateWidth / updateHeight;
      camera.updateProjectionMatrix();
    };

    const handleKeyDown = (event) => {
      keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys[event.key] = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default Model3D;