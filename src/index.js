import {
  ConeGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  GridHelper,
  AdditiveBlending,
  Vector3,
  Vector2,
  TetrahedronBufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  MultiplyBlending,
  RawShaderMaterial,
  PlaneBufferGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function calcNormal() {
  var r1 = Math.random();
  var r2 = Math.random();
  var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
  value = (value + 3) / 6;
  return value;
}

function r3() {
  return Math.random() * Math.random() * Math.random();
}

function r2() {
  return Math.random() * Math.random();
}

const stage = document.querySelector('#stage');
const { width, height } = stage.getBoundingClientRect();

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.01, 1000);
const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});

// const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 5);
// camera.lookAt(0,3,0)
// controls.update();
renderer.setSize(width, height);
renderer.setPixelRatio(4);
const a = '#00101c';
renderer.setClearColor(0x00101c);
document.querySelector('#stage').appendChild(renderer.domElement);

function firebase() {
  const spread = 1.0;
  const pow = 0.75;
  const spreadRatio = new Vector3(4.5, 8, 4);
  const geometry = new TetrahedronBufferGeometry(1, 0);
  const material = new MeshBasicMaterial({
    color: 0xff3300,
    // wireframe: true,
    transparent: true,
    opacity: 0.4,
    blending: AdditiveBlending,
  });

  for (let i = 0; i < 500; i++) {
    const cone = new Mesh(geometry, material);

    cone.rotation.y = r3() * Math.PI;
    // cone.rotation.x = r3() * Math.PI;
    // cone.rotation.x = r3() * Math.PI;

    cone.position.setY(spreadRatio.y * r2());

    const volume = Math.pow(1 - cone.position.y / spreadRatio.y, 2);
    const invertVolume = 1.0 - volume;
    const theta = (Math.random() * 2 - 1) * Math.PI;

    const x = spreadRatio.x * Math.cos(theta) * r3();
    const z = spreadRatio.z * Math.sin(theta) * r3();
    const wind = ((invertVolume ** 2 * 0.5) / volume) * 4 * calcNormal();
    cone.position.setX(x - wind - invertVolume ** volume);
    cone.position.setZ(z - wind);
    cone.position.setY(cone.position.y + invertVolume ** 2 * Math.random());

    const v2 = new Vector3(
      cone.position.x / spreadRatio.x,
      cone.position.y / spreadRatio.y,
      cone.position.z / spreadRatio.z,
    );

    // cone.scale.setScalar((spread - v2.length()) * pow * volume);
    // cone.scale.setScalar((spread - v2.length()) );
    // cone.scale.setScalar((spread - v2.length()**2) / spread );
    // cone.scale.setScalar((1.5-v2.length()**2*1.5) * 0.2);
    cone.scale.setScalar(
      (spread / (spread + v2.length() ** 2 * 60)) * pow * volume,
    );
    cone.translateY(-1 - r3());

    scene.add(cone);
  }
}

function reflection() {
  const spread = 1.3;
  const pow = 0.7;
  const spreadRatio = new Vector3(4, 4, 1);
  const geometry = new CircleGeometry(0.5);
  const material = new MeshBasicMaterial({
    color: 0xff3300,
    // wireframe: true,
    transparent: true,
    opacity: 0.01,
    blending: AdditiveBlending,
  });

  for (let i = 0; i < 500; i++) {
    const circle = new Mesh(geometry, material);
    const theta = (Math.random() * 2 - 1) * Math.PI;

    circle.lookAt(0, 1, 0);
    circle.translateY(-1 + r3());
    circle.translateZ(-1.9);

    circle.position.setX(spreadRatio.x * Math.cos(theta) * calcNormal());
    circle.position.setZ(spreadRatio.z * Math.sin(theta) * calcNormal());

    scene.add(circle);
  }
}

function firewood() {
  const a = '#0c0202';
  const geometry = new CylinderGeometry(0.1, 0.1, 1.7, 3);
  const material = new MeshBasicMaterial({
    color: 0x0c0202,
    // color: 0xffffff,
    // wireframe: true,
    transparent: true,
    // opacity: 0.75,
    // depthTest: false,
    depthWrite: false,
    // blending: AdditiveBlending,
  });

  const radius = 1.1;

  const num = 15;
  for (let i = 0; i < num; i++) {
    const theta = (i / num) * Math.PI * 2 + (r3() * 2 - 1);
    const cylinder = new Mesh(geometry, material);

    cylinder.position.setX(radius * Math.cos(theta));
    cylinder.position.setZ(radius * Math.sin(theta));

    cylinder.lookAt(0, 1 - (r3() * 2 - 1) * 0.95, 0);

    cylinder.scale.setX(0.75 - (r3() * 2 - 1));
    cylinder.scale.setZ(0.75 - (r3() * 2 - 1));
    cylinder.translateZ(-0.4);
    cylinder.translateY(-2.0);
    scene.add(cylinder);
  }
}
function glow() {
  const geometry = new PlaneBufferGeometry();
  const material = new RawShaderMaterial({
    vertexShader: `
precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

varying vec2 vUv;

void main()  {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
    fragmentShader: `
precision mediump float;
precision mediump int;

varying vec2 vUv;

void main() {
   vec2 fUv = vUv * 2.0 - 1.0;
   gl_FragColor = vec4(vec3(0.0),length(fUv*5.0)*0.8);
}
    `,
    transparent: true,
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.setZ(4.9);
  scene.add(mesh);
}
firebase();
reflection();
firewood();
glow();

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }

// animate();

renderer.render(scene, camera);

//
function saveCanvas() {
  const canvas = document.querySelector('canvas');

  const base64 = canvas.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = base64;
  a.download = `${new Date().toString()}.png`;
  a.click();
}

document.querySelector('[data-save]').addEventListener('click', saveCanvas);
