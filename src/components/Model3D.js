import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Model3D = () => {
  const mountRef = useRef(null);

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
    const moveDistance = 0.1; // La distancia que se mueve el cubo por cada tecla presionada

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          cube.position.z -= moveDistance;
          break;
        case 's':
          cube.position.z += moveDistance;
          break;
        case 'a':
          cube.position.x -= moveDistance;
          break;
        case 'd':
          cube.position.x += moveDistance;
          break;
        default:
          break;
      }
    };

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

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

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown); // Agregar el evento de escucha para las teclas

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown); // Eliminar el evento al desmontar el componente
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default Model3D;
