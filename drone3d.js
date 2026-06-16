import * as THREE from "./node_modules/three/build/three.module.js";

const canvas = document.getElementById("drone3dCanvas");
let renderer;
let scene;
let camera;
let droneGroup;
let rotors = [];
let lastDetail = null;

if (canvas) {
  init3d();
  window.addEventListener("pidron:drone-change", (event) => {
    lastDetail = event.detail;
    rebuildDrone(event.detail);
  });
  if (window.pidronCurrentDrone) {
    lastDetail = window.pidronCurrentDrone;
    rebuildDrone(lastDetail);
  }
}

function init3d() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
  camera.position.set(3.5, 3.2, 5.2);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(4, 6, 5);
  scene.add(ambient, key);

  const grid = new THREE.GridHelper(5.5, 12, 0x9aa7a2, 0xd4dcd8);
  grid.position.y = -0.08;
  scene.add(grid);

  droneGroup = new THREE.Group();
  scene.add(droneGroup);
  resize();
  animate();
  window.addEventListener("resize", resize);
}

function rebuildDrone(detail) {
  if (!droneGroup) return;
  droneGroup.clear();
  rotors = [];
  const count = motorCountFor(detail.layout);
  const radius = Math.max(1.15, Math.min(2.15, detail.armLength / 180));
  const propRadius = Math.max(0.28, Math.min(0.62, detail.propDiameter / 18));
  const start = detail.layout === "quad" ? -45 : -90;
  const colors = getThemeColors();
  const armMaterial = new THREE.MeshStandardMaterial({ color: colors.line, roughness: 0.62, metalness: 0.18 });
  const hubMaterial = new THREE.MeshStandardMaterial({ color: colors.panel, roughness: 0.48, metalness: 0.12 });
  const standardMaterial = new THREE.MeshStandardMaterial({
    color: colors.standard,
    roughness: 0.38,
    metalness: 0.18
  });
  const pusherMaterial = new THREE.MeshStandardMaterial({
    color: colors.pusher,
    roughness: 0.34,
    metalness: 0.2
  });

  const hub = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.5), hubMaterial);
  hub.position.y = 0.05;
  droneGroup.add(hub);

  for (let index = 0; index < count; index += 1) {
    const angle = THREE.MathUtils.degToRad(start + (360 / count) * index);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const armLength = radius;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(armLength, 0.06, 0.06), armMaterial);
    arm.position.set(x / 2, 0, z / 2);
    arm.rotation.y = -angle;
    droneGroup.add(arm);

    const isPusher = Boolean(detail.pusherMotors[index]);
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.22, 32),
      isPusher ? pusherMaterial : standardMaterial
    );
    motor.position.set(x, 0.08, z);
    motor.rotation.x = Math.PI / 2;
    droneGroup.add(motor);

    const rotor = new THREE.Mesh(
      new THREE.CylinderGeometry(propRadius, propRadius, 0.018, 64),
      new THREE.MeshStandardMaterial({
        color: isPusher ? colors.pusher : colors.standard,
        transparent: true,
        opacity: 0.28,
        roughness: 0.25
      })
    );
    rotor.position.set(x, isPusher ? -0.08 : 0.25, z);
    rotor.rotation.x = Math.PI / 2;
    droneGroup.add(rotor);
    rotors.push({ mesh: rotor, direction: isPusher ? -1 : 1 });
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (droneGroup) {
    droneGroup.rotation.y += 0.003;
    droneGroup.rotation.x = Math.sin(Date.now() * 0.0011) * 0.06;
  }
  rotors.forEach((rotor) => {
    rotor.mesh.rotation.z += rotor.direction * 0.12;
  });
  renderer.render(scene, camera);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width || canvas.width));
  const height = Math.max(220, Math.floor(rect.height || canvas.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (lastDetail) rebuildDrone(lastDetail);
}

function getThemeColors() {
  const css = getComputedStyle(document.body);
  return {
    line: css.getPropertyValue("--line").trim() || "#d8e0dc",
    panel: css.getPropertyValue("--panel").trim() || "#ffffff",
    standard: css.getPropertyValue("--standard").trim() || "#1f7a68",
    pusher: css.getPropertyValue("--pusher").trim() || "#cc5a2e"
  };
}

function motorCountFor(layout) {
  return { quad: 4, hex: 6, octo: 8, coax: 8 }[layout] || 4;
}
