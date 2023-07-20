import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: '#8181F7' });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.lookAt(cube.position);

    const ambientalLight = new THREE.AmbientLight(0x404040, 5);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xff0000, 5);
    pointLight.position.set(8, 8, 8);
    scene.add(pointLight);

    const clock = new THREE.Clock();

    // Función para actualizar la posición del cubo en función de las teclas presionadas
    const updateCubePosition = () => {
      if (keys.w) {
        cube.position.z -= moveDistance * moveSpeedMultiplier;
      }
      if (keys.s) {
        cube.position.z += moveDistance * moveSpeedMultiplier;
      }
      if (keys.a) {
        cube.position.x -= moveDistance * moveSpeedMultiplier;
      }
      if (keys.d) {
        cube.position.x += moveDistance * moveSpeedMultiplier;
      }
    };

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      updateCubePosition(); // Llama a la función de actualización de posición

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
      // Marca la tecla como presionada
      keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      // Marca la tecla como no presionada
      keys[event.key] = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp); // Agregar evento de escucha para el levantamiento de teclas

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp); // Eliminar eventos al desmontar el componente
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default Model3D;
