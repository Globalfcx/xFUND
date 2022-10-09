import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import MouseMeshInteraction from './three_mmi';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import gsap from 'gsap';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';

/**
 * Debug
 */
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 25;
camera.position.y = 0;
scene.add(camera);


/*
*Lights 
*/
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-3, 2, 0);
scene.add(directionalLight);

let introOpacity = 1;
const introScreen = document.querySelector('.intro-screen');
const loadingBarElement = document.querySelector('.loading-bar');

// introScreen.style.opacity = `${introOpacity}`
introScreen.style.background = `rgba(0, 0, 0, 1)`

/*
*Loading manager 
*/
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    //   // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(introScreen, {
        duration: 3,
        opacity: 0,
        onComplete: () => {
          introScreen.style.display = 'none';
        }
      })



      // Update loadingBarElement
      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    }, 500)
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
  }
);

/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager);

/**
 * Cube texture loader
 */

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/**
 * MatCap texture
 */

const matCapTexture = textureLoader.load('/images/matcap1.png');

/**
 * envirenment map
 */

const envMap = cubeTextureLoader.load([
  'env/px.png',
  'env/nx.png',
  'env/py.png',
  'env/ny.png',
  'env/pz.png',
  'env/nz.png'
]);

// set envirenment map
scene.background = envMap;

/**
 * Font Loader
 */
const fontLoader = new FontLoader();


/**
 * Objects
 */

// cretae planet name on a plate
const createPlanetName = (name, lenght) => {

  const group = new THREE.Group();

  const plateGeometry = new THREE.BoxGeometry(lenght - 0.4, 0.3, 0.1);
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0xC0C0C0
  });

  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  group.add(plate);

  fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
      const planetNameGeometry = new TextGeometry(
        name,
        {
          font: font,
          size: 0.15,
          height: 0.0001,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.003,
          bevelSize: 0.002,
          bevelOffset: 0,
          bevelSegments: 5
        }
      );
  
      planetNameGeometry.center();
  
      const planetNameMaterial = new THREE.MeshMatcapMaterial({
        matcap: matCapTexture
      });
      // const planetNameMaterial = MeshBasicMaterial({
      //   color: 0x000000
      // })
      const planetName = new THREE.Mesh(planetNameGeometry, planetNameMaterial);
  
      // planet1Name.rotation.set(0, Math.PI, 0);
  
      planetName.position.set(planetName.position.x, planetName.position.y, planetName.position.z + 0.05);

      const planetName2 = planetName.clone();
      planetName2.rotation.set(0, Math.PI, 0);
      planetName2.position.set(planetName2.position.x, planetName2.position.y, planetName2.position.z - 0.1);
      group.add(planetName2)
  
      group.add(planetName);
  
    }
  );

  return group;
}

/**
 * point
 */
const pointMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00
})

const PointGeometry = new THREE.SphereGeometry(0.05, 32, 32);

/**
 * planet1
 */

const planet1 = new THREE.Group();
planet1.name = 'planet1';

const planet1Texture = textureLoader.load('/images/planet1.jpg');

const planet1Geometry = new THREE.SphereBufferGeometry(0.545, 32, 32);

const planet1Material = new THREE.MeshStandardMaterial({
  map: planet1Texture
});

const planet1Mesh = new THREE.Mesh(planet1Geometry, planet1Material);

planet1Mesh.name = 'planet1-mesh';

// planet1Mesh.scale.set(0.28, 0.28, 0.28)

planet1.add(planet1Mesh);

// let Planet1NameVisibility = true;

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet1NameGeometry = new TextGeometry(
//       'N F T',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet1NameGeometry.center();

//     const planet1NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet1Name = new THREE.Mesh(planet1NameGeometry, planet1NameMaterial);

//     // planet1Name.rotation.set(0, Math.PI, 0);

//     planet1Name.position.set(planet1Name.position.x, planet1Name.position.y + 0.7, planet1Name.position.z);

//     planet1.add(planet1Name);

//     if (Planet1NameVisibility) {
//       planet1Name.visible = true;
//     } else {
//       planet1Name.visible = false;
//     }

//   }
// );

const planet1Name = createPlanetName('NFT', 1.0);
planet1Name.position.set(planet1Name.position.x, planet1Name.position.y + 0.9, planet1Name.position.z)
planet1.add(planet1Name);

const planet1Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
]

const planet1Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet1Point1.position.set(planet1Points[0].x, planet1Points[0].y, planet1Points[0].z);
planet1Point1.name = 'planet1-point1';
planet1Mesh.add(planet1Point1);

const planet1Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet1Point2.position.set(planet1Points[1].x, planet1Points[1].y, planet1Points[1].z);
planet1Point2.name = 'planet1-point2';
planet1Mesh.add(planet1Point2);

const planet1Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet1Point3.position.set(planet1Points[2].x, planet1Points[2].y, planet1Points[2].z);
planet1Point3.name = 'planet1-point3';
planet1Mesh.add(planet1Point3);


scene.add(planet1);

/**
 * planet2
 */

const planet2 = new THREE.Group();
planet2.name = 'planet2';

const planet2Texture = textureLoader.load('/images/planet2.png');

const planet2Geometry = new THREE.SphereBufferGeometry(0.545, 32, 32);

const planet2Material = new THREE.MeshStandardMaterial({
  map: planet2Texture
});

const planet2Mesh = new THREE.Mesh(planet2Geometry, planet2Material);

planet2Mesh.name = 'planet2-mesh';

planet2.add(planet2Mesh);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet2NameGeometry = new TextGeometry(
//       'Technology',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet2NameGeometry.center();

//     const planet2NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet2Name = new THREE.Mesh(planet2NameGeometry, planet2NameMaterial);

//     // planet2Name.rotation.set(0, Math.PI, 0);

//     planet2Name.position.set(planet2Name.position.x, planet2Name.position.y + 0.7, planet2Name.position.z);

//     planet2.add(planet2Name);
//   }
// );

const planet2Name = createPlanetName('Technology', 1.7);
planet2Name.position.set(planet2Name.position.x, planet2Name.position.y + 0.9, planet2Name.position.z)
planet2.add(planet2Name);

const planet2Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
];

const planet2Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet2Point1.position.set(planet2Points[0].x, planet2Points[0].y, planet2Points[0].z);
planet2Point1.name = 'planet2-point1';
planet2Mesh.add(planet2Point1);

const planet2Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet2Point2.position.set(planet2Points[1].x, planet2Points[1].y, planet2Points[1].z);
planet2Point2.name = 'planet2-point2';
planet2Mesh.add(planet2Point2);

const planet2Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet2Point3.position.set(planet2Points[2].x, planet2Points[2].y, planet2Points[2].z);
planet2Point3.name = 'planet2-point3';
planet2Mesh.add(planet2Point3);

scene.add(planet2);

/**
 * Earth/planet3
 */

const planet3 = new THREE.Group();
planet3.name = 'palnet3';

// Textures for earth
const earthInnerColorMap = textureLoader.load('innerColorMap.jpg');
const earthOuterColorMap = textureLoader.load('outerColorMap.jpg');

const earth = new THREE.Group();

// inner geometry
const innerGeometry = new THREE.SphereBufferGeometry(0.545, 32, 32);
const innerMaterial = new THREE.MeshStandardMaterial({
  map: earthInnerColorMap
});

const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

innerMesh.name = 'planet3-mesh'

earth.add(innerMesh);

// outer geometry
const outerGeometry = new THREE.SphereBufferGeometry(0.545, 32, 32);
const outerMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  map: earthOuterColorMap,
  opacity: 0.9,
  envMap: envMap,
  metalness: 0.4

});

const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
outerMesh.name = "globe";
earth.add(outerMesh);

const planet3Mesh = earth;

planet3.add(earth);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet3NameGeometry = new TextGeometry(
//       'F C X Global',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet3NameGeometry.center();

//     const planet3NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet3Name = new THREE.Mesh(planet3NameGeometry, planet3NameMaterial);

//     // planet3Name.rotation.set(0, Math.PI, 0);

//     planet3Name.position.set(planet3Name.position.x, planet3Name.position.y + 0.7, planet3Name.position.z);

//     planet3.add(planet3Name);
//   }
// );

const planet3Name = createPlanetName('FCX Global', 1.7);
planet3Name.position.set(planet3Name.position.x, planet3Name.position.y + 0.9, planet3Name.position.z)
planet3.add(planet3Name);

// moon

const moon = new THREE.Group();

const moonGeometry = new THREE.SphereBufferGeometry(0.45, 32, 32);
const moonTexture = textureLoader.load('/images/moon.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.name = 'moon-mesh';
moon.add(moonMesh)
moon.position.set(moon.position.x, moon.position.y + 1.2, moon.position.z);

planet3.add(moon);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const moonNameGeometry = new TextGeometry(
//       'DEX',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     moonNameGeometry.center();

//     const moonNameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const moonName = new THREE.Mesh(moonNameGeometry, moonNameMaterial);

//     // planet6Name.rotation.set(0, Math.PI, 0);

//     moonName.position.set(moonName.position.x, moonName.position.y + 0.7, moonName.position.z);

//     moon.add(moonName);
//   }
// );

const moonName = createPlanetName('DEX', 1.0);
moonName.position.set(moonName.position.x, moonName.position.y + 0.9, moonName.position.z)
moon.add(moonName);

// orbitmoon
const moonOrbit = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  2, 2,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const moonOrbitPoints = moonOrbit.getPoints(7000);

const moonOrbitPath = [];

for (let i = 0; i < moonOrbitPoints.length; i++) {
  moonOrbitPath.push(new THREE.Vector3(moonOrbitPoints[i].x, - moonOrbitPoints[i].y * 1, moonOrbitPoints[i].y));
}

const moonOrbitGeometry = new THREE.BufferGeometry().setFromPoints(moonOrbitPath);

const moonOrbitMaterial = new THREE.LineBasicMaterial({
  color: 0x00e7fb,
  transparent: true,
  opacity: 0.2,
  linewidth: 5,
  visible: false
});
const moonOrbitObject = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);

// planet3.add(moonOrbitObject);

const planet3Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
  new THREE.Vector3(-0.419, 0.088, -0.303),
]

const planet3Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet3Point1.position.set(planet3Points[0].x, planet3Points[0].y, planet3Points[0].z);
planet3Point1.name = 'planet3-point1';
planet3Mesh.add(planet3Point1);

const planet3Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet3Point2.position.set(planet3Points[1].x, planet3Points[1].y, planet3Points[1].z);
planet3Point2.name = 'planet3-point2';
planet3Mesh.add(planet3Point2);

const planet3Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet3Point3.position.set(planet3Points[2].x, planet3Points[2].y, planet3Points[2].z);
planet3Point3.name = 'planet3-point3';
planet3Mesh.add(planet3Point3);

const planet3Point4 = new THREE.Mesh(PointGeometry, pointMaterial);
planet3Point4.position.set(planet3Points[3].x, planet3Points[3].y, planet3Points[3].z);
planet3Point4.name = 'planet3-point4';
planet3Mesh.add(planet3Point4);

const moonPoints = [
  new THREE.Vector3(0.380, -0.175, 0.045),
  new THREE.Vector3(-0.419, 0.088, -0.044),
  new THREE.Vector3(-0.210, 0.268, -0.253),
]

const moonPoint1 = new THREE.Mesh(PointGeometry, pointMaterial);
moonPoint1.position.set(moonPoints[0].x, moonPoints[0].y, moonPoints[0].z);
moonPoint1.name = 'moon-point1';
moonMesh.add(moonPoint1);

const moonPoint2 = new THREE.Mesh(PointGeometry, pointMaterial);
moonPoint2.position.set(moonPoints[1].x, moonPoints[1].y, moonPoints[1].z);
moonPoint2.name = 'moon-point2';
moonMesh.add(moonPoint2);

const moonPoint3 = new THREE.Mesh(PointGeometry, pointMaterial);
moonPoint3.position.set(moonPoints[2].x, moonPoints[2].y, moonPoints[2].z);
moonPoint3.name = 'moon-point3';
moonMesh.add(moonPoint3);

scene.add(planet3);


/**
 * planet4
 */

const planet4 = new THREE.Group();
planet4.name = 'planet4';

const planet4Texture = textureLoader.load('/images/planet4.jpg');

const planet4Geometry = new THREE.SphereBufferGeometry(0.545, 32, 32);

const planet4Material = new THREE.MeshStandardMaterial({
  map: planet4Texture
});

const planet4Mesh = new THREE.Mesh(planet4Geometry, planet4Material);

planet4Mesh.name = 'planet4-mesh';

planet4.add(planet4Mesh);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet4NameGeometry = new TextGeometry(
//       'DeF I',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet4NameGeometry.center();

//     const planet4NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet4Name = new THREE.Mesh(planet4NameGeometry, planet4NameMaterial);

//     // planet4Name.rotation.set(0, Math.PI, 0);

//     planet4Name.position.set(planet4Name.position.x, planet4Name.position.y + 0.7, planet4Name.position.z);

//     planet4.add(planet4Name);
//   }
// );

const planet4Name = createPlanetName('DeFI', 1.0);
planet4Name.position.set(planet4Name.position.x, planet4Name.position.y + 0.9, planet4Name.position.z)
planet4.add(planet4Name);

const planet4Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
];

const planet4Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet4Point1.position.set(planet4Points[0].x, planet4Points[0].y, planet4Points[0].z);
planet4Point1.name = 'planet4-point1';
planet4Mesh.add(planet4Point1);

const planet4Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet4Point2.position.set(planet4Points[1].x, planet4Points[1].y, planet4Points[1].z);
planet4Point2.name = 'planet4-point2';
planet4Mesh.add(planet4Point2);

const planet4Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet4Point3.position.set(planet4Points[2].x, planet4Points[2].y, planet4Points[2].z);
planet4Point3.name = 'planet4-point3';
planet4Mesh.add(planet4Point3);

scene.add(planet4);


/**
 * planet5
 */

const planet5 = new THREE.Group();
planet5.name = 'planet5';

const planet5Texture = textureLoader.load('/images/planet5.jpg');

const planet5Geometry = new THREE.SphereBufferGeometry(0.545, 32, 32);

const planet5Material = new THREE.MeshStandardMaterial({
  map: planet5Texture
});

const planet5Mesh = new THREE.Mesh(planet5Geometry, planet5Material);

planet5Mesh.name = 'planet5-mesh';

planet5.add(planet5Mesh);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet5NameGeometry = new TextGeometry(
//       'Gaming',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet5NameGeometry.center();

//     const planet5NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet5Name = new THREE.Mesh(planet5NameGeometry, planet5NameMaterial);

//     // planet5Name.rotation.set(0, Math.PI, 0);

//     planet5Name.position.set(planet5Name.position.x, planet5Name.position.y + 0.7, planet5Name.position.z);

//     planet5.add(planet5Name);
//   }
// );

const planet5Name = createPlanetName('Gaming', 1.3);
planet5Name.position.set(planet5Name.position.x, planet5Name.position.y + 0.9, planet5Name.position.z)
planet5.add(planet5Name);

const planet5Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
]

const planet5Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet5Point1.position.set(planet5Points[0].x, planet5Points[0].y, planet5Points[0].z);
planet5Point1.name = 'planet5-point1';
planet5Mesh.add(planet5Point1);

const planet5Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet5Point2.position.set(planet5Points[1].x, planet5Points[1].y, planet5Points[1].z);
planet5Point2.name = 'planet5-point2';
planet5Mesh.add(planet5Point2);

const planet5Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet5Point3.position.set(planet5Points[2].x, planet5Points[2].y, planet5Points[2].z);
planet5Point3.name = 'planet5-point3';
planet5Mesh.add(planet5Point3);


scene.add(planet5);

/**
 * planet6
 */

const planet6 = new THREE.Group();
planet6.name = 'planet6';

const planet6Texture = textureLoader.load('/images/planet6.jpg');

const planet6Geometry = new THREE.SphereBufferGeometry(0.545, 32, 32);

const planet6Material = new THREE.MeshStandardMaterial({
  map: planet6Texture
});

const planet6Mesh = new THREE.Mesh(planet6Geometry, planet6Material);

planet6Mesh.name = 'planet6-mesh';

planet6.add(planet6Mesh);

// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//     const planet6NameGeometry = new TextGeometry(
//       'Community',
//       {
//         font: font,
//         size: 0.2,
//         height: 0.2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 0.03,
//         bevelSize: 0.02,
//         bevelOffset: 0,
//         bevelSegments: 5
//       }
//     );

//     planet6NameGeometry.center();

//     const planet6NameMaterial = new THREE.MeshMatcapMaterial({
//       matcap: matCapTexture
//     });
//     const planet6Name = new THREE.Mesh(planet6NameGeometry, planet6NameMaterial);

//     // planet6Name.rotation.set(0, Math.PI, 0);

//     planet6Name.position.set(planet6Name.position.x, planet6Name.position.y + 0.7, planet6Name.position.z);

//     planet6.add(planet6Name);
//   }
// );

const planet6Name = createPlanetName('Community', 1.7);
planet6Name.position.set(planet6Name.position.x, planet6Name.position.y + 0.9, planet6Name.position.z)
planet6.add(planet6Name);

const planet6Points = [
  new THREE.Vector3(0.0469, -0.222, 0.450),
  new THREE.Vector3(0.469, 0.050, -0.194),
  new THREE.Vector3(-0.394, 0.324, 0.063),
]

const planet6Point1 = new THREE.Mesh(PointGeometry, pointMaterial);
planet6Point1.position.set(planet6Points[0].x, planet6Points[0].y, planet6Points[0].z);
planet6Point1.name = 'planet6-point1';
planet6Mesh.add(planet6Point1);

const planet6Point2 = new THREE.Mesh(PointGeometry, pointMaterial);
planet6Point2.position.set(planet6Points[1].x, planet6Points[1].y, planet6Points[1].z);
planet6Point2.name = 'planet6-point2';
planet6Mesh.add(planet6Point2);

const planet6Point3 = new THREE.Mesh(PointGeometry, pointMaterial);
planet6Point3.position.set(planet6Points[2].x, planet6Points[2].y, planet6Points[2].z);
planet6Point3.name = 'planet6-point3';
planet6Mesh.add(planet6Point3);



scene.add(planet6);

/**
 * temp function
 */

/**
 * temp
 */
// const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
// const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// const sphereGeometry = new THREE.SphereGeometry(0.546, 32, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//   color: 0x0000ff,
//   wireframe: true
// })
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.set(planet3Mesh.position.x, planet3Mesh.position.y, planet3Mesh.position.z);

// planet3Mesh.add(sphere);

// planet3Mesh.add(cube);


// let arrCounter = 1700;
// const posArray = sphereGeometry.attributes.position.array;
// console.log(posArray);

// const nextVertex = () => {

//   cube.position.set(posArray[arrCounter], posArray[arrCounter + 1], posArray[arrCounter + 2]);

//   console.log(cube.position);

//   arrCounter = arrCounter + 3;
// }

// const nvButton = document.getElementById('nv');

// nvButton.addEventListener('click', () => {
//   nextVertex();
// })

// /**
//  * planet2 points
//  * x: 0.410 y: 0.129 z: -0.280
//  * x: 
//  * 
//  */


const planets = [
  planet1,
  planet2,
  planet3,
  moon,
  planet4,
  planet5,
  planet6
]



// orbits

const orbitSystem = new THREE.Group()

const orbitMaterial = new THREE.LineBasicMaterial({
  color: 0x00e7fb,
  transparent: true,
  opacity: 0.2,
  linewidth: 5,
  visible: false
});

// orbit1
const orbit1 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  1.5, 3,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit1Points = orbit1.getPoints(3000);

const orbit1Path = [];

for (let i = 0; i < orbit1Points.length; i++) {
  orbit1Path.push(new THREE.Vector3(orbit1Points[i].x, - orbit1Points[i].y * 0.1, orbit1Points[i].y));
}

const orbit1Geometry = new THREE.BufferGeometry().setFromPoints(orbit1Path);

const orbit1Object = new THREE.Line(orbit1Geometry, orbitMaterial);

orbitSystem.add(orbit1Object);


// orbit2
const orbit2 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  2.5, 4,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit2Points = orbit2.getPoints(6000);

const orbit2Path = [];

for (let i = 0; i < orbit2Points.length; i++) {
  orbit2Path.push(new THREE.Vector3(orbit2Points[i].x, orbit2Points[i].y * 0.1, orbit2Points[i].y));
}

const orbit2Geometry = new THREE.BufferGeometry().setFromPoints(orbit2Path);

const orbit2Object = new THREE.Line(orbit2Geometry, orbitMaterial);

orbitSystem.add(orbit2Object);

// orbit3
const orbit3 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  3.5, 5,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit3Points = orbit3.getPoints(5000);

const orbit3Path = [];

for (let i = 0; i < orbit3Points.length; i++) {
  orbit3Path.push(new THREE.Vector3(orbit3Points[i].x, - orbit3Points[i].x * 0.2, orbit3Points[i].y));
}

const orbit3Geometry = new THREE.BufferGeometry().setFromPoints(orbit3Path);

const orbit3Object = new THREE.Line(orbit3Geometry, orbitMaterial);

orbitSystem.add(orbit3Object);

// orbit4
const orbit4 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  4.5, 6,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit4Points = orbit4.getPoints(6000);

const orbit4Path = [];

for (let i = 0; i < orbit4Points.length; i++) {
  orbit4Path.push(new THREE.Vector3(orbit4Points[i].x, orbit4Points[i].y * 0.2, orbit4Points[i].y));
}

const orbit4Geometry = new THREE.BufferGeometry().setFromPoints(orbit4Path);

const orbit4Object = new THREE.Line(orbit4Geometry, orbitMaterial);

orbitSystem.add(orbit4Object);

// orbit5
const orbit5 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  5.5, 7,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit5Points = orbit5.getPoints(7000);

const orbit5Path = [];

for (let i = 0; i < orbit5Points.length; i++) {
  orbit5Path.push(new THREE.Vector3(orbit5Points[i].x, - orbit5Points[i].y * 0.3, orbit5Points[i].y));
}

const orbit5Geometry = new THREE.BufferGeometry().setFromPoints(orbit5Path);

const orbit5Object = new THREE.Line(orbit5Geometry, orbitMaterial);

orbitSystem.add(orbit5Object);

// orbit6
const orbit6 = new THREE.EllipseCurve(
  -0, 0,            // ax, aY
  6.5, 8,           // xRadius, yRadius
  0, Math.PI * 2,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);

const orbit6Points = orbit6.getPoints(9000);

const orbit6Path = [];

for (let i = 0; i < orbit6Points.length; i++) {
  orbit6Path.push(new THREE.Vector3(orbit6Points[i].x, orbit6Points[i].y * 0.3, orbit6Points[i].y));
}

const orbit6Geometry = new THREE.BufferGeometry().setFromPoints(orbit6Path);

const orbit6Object = new THREE.Line(orbit6Geometry, orbitMaterial);

orbitSystem.add(orbit6Object);

// scene.add(orbitSystem);

/**
 * Animation Planets
 */

let animateSystem = true;

// animate planet1

let planet1Counter = 0;

let planet1AnimationEnabled = true;

const animatePlanet1 = (planet1AnimationEnabled) => {
  if (planet1AnimationEnabled) {
    if (planet1Counter < orbit1Path.length) {
      planet1.position.set(orbit1Path[planet1Counter].x, orbit1Path[planet1Counter].y, orbit1Path[planet1Counter].z,)
      planet1Counter++;
    }

    if (planet1Counter >= orbit1Path.length) {
      planet1Counter = 0;
    }

    planet1Mesh.rotation.y += 0.005;
  }

}

// animate planet2
let planet2Counter = 1500;

let planet2AnimationEnabled = true;

const animatePlanet2 = (planet2AnimationEnabled) => {
  if (planet2AnimationEnabled) {
    if (planet2Counter < orbit2Path.length) {
      planet2.position.set(orbit2Path[planet2Counter].x, orbit2Path[planet2Counter].y, orbit2Path[planet2Counter].z,)
      planet2Counter++;
    }

    if (planet2Counter >= orbit2Path.length) {
      planet2Counter = 0;
    }

    planet2Mesh.rotation.y += 0.005;
  }
}

// animate planet3
let planet3Counter = 3000;

let planet3AnimationEnabled = true;

const animatePlanet3 = (planet3AnimationEnabled) => {
  if (planet3AnimationEnabled) {
    if (planet3Counter < orbit3Path.length) {
      planet3.position.set(orbit3Path[planet3Counter].x, orbit3Path[planet3Counter].y, orbit3Path[planet3Counter].z,)
      planet3Counter++;
    }

    if (planet3Counter >= orbit3Path.length) {
      planet3Counter = 0;
    }

    planet3Mesh.rotation.y += 0.005;
  }

}

// animate moon
let moonCounter = 6000;

let moonAnimationEnabled = true;

const animateMoon = (moonAnimationEnabled) => {
  if (moonAnimationEnabled) {
    if (moonCounter < moonOrbitPath.length) {
      moon.position.set(moonOrbitPath[moonCounter].x, moonOrbitPath[moonCounter].y, moonOrbitPath[moonCounter].z,)
      moonCounter++;
    }

    if (moonCounter >= moonOrbitPath.length) {
      moonCounter = 0;
    }

    moonMesh.rotation.y += 0.005;
  }

}


// animate planet4
let planet4Counter = 1000;

let planet4AnimationEnabled = true;

const animatePlanet4 = (planet4AnimationEnabled) => {
  if (planet4AnimationEnabled) {
    if (planet4Counter < orbit4Path.length) {
      planet4.position.set(orbit4Path[planet4Counter].x, orbit4Path[planet4Counter].y, orbit4Path[planet4Counter].z,)
      planet4Counter++;
    }

    if (planet4Counter >= orbit4Path.length) {
      planet4Counter = 0;
    }

    planet4Mesh.rotation.y += 0.005;
  }

}

// animate planet5
let planet5Counter = 4000;

let planet5AnimationEnabled = true;

const animatePlanet5 = (planet5AnimationEnabled) => {
  if (planet5AnimationEnabled) {
    if (planet5Counter < orbit5Path.length) {
      planet5.position.set(orbit5Path[planet5Counter].x, orbit5Path[planet5Counter].y, orbit5Path[planet5Counter].z,)
      planet5Counter++;
    }

    if (planet5Counter >= orbit5Path.length) {
      planet5Counter = 0;
    }

    planet5Mesh.rotation.y += 0.005;
  }

}

// animate planet6
let planet6Counter = 6000;

let planet6AnimationEnabled = true;

const animatePlanet6 = (planet6AnimationEnabled) => {
  if (planet6AnimationEnabled) {
    if (planet6Counter < orbit6Path.length) {
      planet6.position.set(orbit6Path[planet6Counter].x, orbit6Path[planet6Counter].y, orbit6Path[planet6Counter].z,)
      planet6Counter++;
    }

    if (planet6Counter >= orbit6Path.length) {
      planet6Counter = 0;
    }

    planet6Mesh.rotation.y += 0.005;
  }

}


/**
 * Resize
 */

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = outerMesh.position;
controls.enableDamping = true;
controls.autoRotateSpeed = 0.1;
controls.enablePan = false;

/**
 * Update some status when clicked on a planet
 */

let singlePlanetView = false;

/** 
 * Event listeners on planets
*/

let isMouseHoldOnPlanet1 = false;
let isMouseHoldOnPlanet2 = false;
let isMouseHoldOnPlanet3 = false;
let isMouseHoldOnMoon = false;
let isMouseHoldOnPlanet4 = false;
let isMouseHoldOnPlanet5 = false;
let isMouseHoldOnPlanet6 = false;

// mousedown events
window.addEventListener('mousedown', (e) => {

  console.log(currentIntersect);

  if (currentIntersect) {
    switch (currentIntersect.object) {
      case planet1Mesh:
        isMouseHoldOnPlanet1 = true;
        planet1AnimationEnabled = false;
        break;

      case planet2Mesh:
        isMouseHoldOnPlanet2 = true;
        planet2AnimationEnabled = false;
        break;

      case innerMesh:
        isMouseHoldOnPlanet3 = true;
        planet3AnimationEnabled = false;
        break;

      case moonMesh:
        isMouseHoldOnMoon = true;
        moonAnimationEnabled = false;
        planet3AnimationEnabled = false;
        break;

      case planet4Mesh:
        isMouseHoldOnPlanet4 = true;
        planet4AnimationEnabled = false;
        break;

      case planet5Mesh:
        isMouseHoldOnPlanet5 = true;
        planet5AnimationEnabled = false;
        break;

      case planet6Mesh:
        isMouseHoldOnPlanet6 = true;
        planet6AnimationEnabled = false;
        break;
    }
  }
});

// mouseup events
window.addEventListener('mouseup', (e) => {

  animateSystem = true;

  if (currentIntersect) {
    switch (currentIntersect.object) {
      case planet1Mesh:
        isMouseHoldOnPlanet1 = false;
        planet1AnimationEnabled = false;
        break;

      case planet2Mesh:
        isMouseHoldOnPlanet2 = false;
        planet2AnimationEnabled = true;
        break;

      case innerMesh:
        isMouseHoldOnPlanet3 = false;
        planet3AnimationEnabled = true;
        break;

      case moonMesh:
        isMouseHoldOnMoon = false;
        moonAnimationEnabled = true;
        planet3AnimationEnabled = true;
        break;

      case planet4Mesh:
        isMouseHoldOnPlanet4 = false;
        planet4AnimationEnabled = true;
        break;

      case planet5Mesh:
        isMouseHoldOnPlanet5 = false;
        planet5AnimationEnabled = true;
        break;

      case planet6Mesh:
        isMouseHoldOnPlanet6 = false;
        planet6AnimationEnabled = true;
        break;
    }
  }
})

// hide planets and orbit system on single planet view
const hidePlanets = (planet) => {
  // planet1.visible = false;
  // planet2.visible = false;
  // planet3.visible = false;
  // moon.visible = false;
  // planet4.visible = false;
  // planet5.visible = false;
  // planet6.visible = false;
  for(let i = 0; i < 7; i++) {
    interactiveMeshes.shift();
  }

  console.log(interactiveMeshes);

  planet1.remove(planet1Name);
  planet2.remove(planet2Name);
  planet3.remove(planet3Name);
  moon.remove(moonName);
  planet4.remove(planet4Name);
  planet5.remove(planet5Name);
  planet6.remove(planet6Name);

  scene.remove(planet1);
  scene.remove(planet2);
  scene.remove(planet3);
  planet3.remove(moon);
  scene.remove(planet4);
  scene.remove(planet5);
  scene.remove(planet6);

  interactiveMeshes.push(planet)
  scene.add(planet);
}

// show planets and orbit system when exit on single planet view
const showPlanets = () => {
  // planet1.visible = true;
  // planet2.visible = true;
  // planet3.visible = true;
  // moon.visible = true;
  // planet4.visible = true;
  // planet5.visible = true;
  // planet6.visible = true;

  scene.add(planet1);
  scene.add(planet2);
  scene.add(planet3);
  planet3.add(moon);
  scene.add(planet4);
  scene.add(planet5);
  scene.add(planet6);

  planet1.add(planet1Name);
  planet2.add(planet2Name);
  planet3.add(planet3Name);
  moon.add(moonName);
  planet4.add(planet4Name);
  planet5.add(planet5Name);
  planet6.add(planet6Name);

  interactiveMeshes.push(planet1)
  interactiveMeshes.push(planet2)
  interactiveMeshes.push(planet3)
  interactiveMeshes.push(moon)
  interactiveMeshes.push(planet4)
  interactiveMeshes.push(planet5)
  interactiveMeshes.push(planet6)

  console.log(interactiveMeshes);
}

window.addEventListener('dblclick', () => {

  if (currentIntersect === null) {
    singlePlanetView = false;

    gsap.to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 25
      }
    )

    camera.lookAt(0, 0, 0);

    controls.autoRotate = false;

    showPlanets();
  }

  if (currentIntersect) {
    switch (currentIntersect.object) {
      // planet1
      case planet1Mesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet1) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet1.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet1 = false;

          hidePlanets(planet1);

        }
        break;

      // planet2
      case planet2Mesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet2) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet2.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet2 = false;

          hidePlanets(planet2);

        }
        break;

      // planet3
      case innerMesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet3) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet3.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet3 = false;

          hidePlanets(planet3);

        }
        break;

      // moon
      case moonMesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnMoon) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            moon.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnMoon = false;

          hidePlanets(moon);

          console.log(scene);

        }
        break;

      case planet4Mesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet4) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet4.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet4 = false;

          hidePlanets(planet4);

        }
        break;

      case planet5Mesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet5) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet5.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet5 = false;

          hidePlanets(planet5);

        }
        break;

      case planet6Mesh:
        singlePlanetView = true;
        if (singlePlanetView && !isMouseHoldOnPlanet6) {

          gsap.to(
            camera.position,
            {
              x: 0,
              y: 0,
              z: 5
            }
          )

          gsap.to(
            planet6.position,
            {
              x: 0,
              y: 0,
              z: 0
            }
          )

          controls.autoRotate = true;

          isMouseHoldOnPlanet6 = false;

          hidePlanets(planet6);

        }
        break;
    }
  }
})

/**
 * Popups
 */

// css selectors
let popup = document.querySelector('.popup-wrapper').style;

const popupContent = document.querySelector('.popup').style;

/**
 * Planet1 popups
 */

// popup function planet1 point1
const popupPlanet1Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/nft/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet1 point2
const popupPlanet1Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/nft/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet1 point3
const popupPlanet1Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/nft/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


/**
 * Planet2 popups
 */

// popup function planet2 point1
const popupPlanet2Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/technology/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet2 point2
const popupPlanet2Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/technology/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet2 point3
const popupPlanet2Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/technology/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}




/**
 * planet3 popups
 */
// popup function planet3 point1
const popupPlanet3Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/japan.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  // enter button
  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet3-point1', 'enter-button-planet3');

  // twitter button
  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-planet3-point1');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/jye_br8";
    window.open("https://mobile.twitter.com/jye_br8", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://japan.globalfcx.com";
    window.open("https://japan.globalfcx.com", "_blank");
  })
}

// popup function planet3 point2
const popupPlanet3Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/korea.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet3-point2', 'enter-button-planet3');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-planet3-point2');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/DE77VJsZOIfUpJx";
    window.open("https://mobile.twitter.com/DE77VJsZOIfUpJx", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://southkorea.globalfcx.com";
    window.open("https://southkorea.globalfcx.com", "_blank");
  })
}


// popup function planet3 point3
const popupPlanet3Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/poland.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet3-point3', 'enter-button-planet3');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-planet3-point3');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://twitter.com/TomyWoo";
    window.open("https://twitter.com/TomyWoo", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet3 point4
const popupPlanet3Point4 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/philippines.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-philippines', 'enter-button-planet3');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-philippines');

  // twitter profile1
  const profile1 = document.createElement('div');
  twitterButton.appendChild(profile1);
  profile1.classList.add('profile', 'profile1');

  profile1.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/CryptoSena08";
    window.open("https://mobile.twitter.com/CryptoSena08", "_blank");
  });

  // twitter profile2
  const profile2 = document.createElement('div');
  twitterButton.appendChild(profile2);
  profile2.classList.add('profile', 'profile2');

  profile2.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/MrQuackazier";
    window.open("https://mobile.twitter.com/MrQuackazier", "_blank");
  });

  // twitter profile3
  const profile3 = document.createElement('div');
  twitterButton.appendChild(profile3);
  profile3.classList.add('profile', 'profile3');

  profile3.addEventListener('click', () => {
    // location.href = "https://twitter.com/xwatercity16";
    window.open("https://twitter.com/xwatercity16", "_blank");
  });

  // twitter profile4
  const profile4 = document.createElement('div');
  twitterButton.appendChild(profile4);
  profile4.classList.add('profile', 'profile4');

  profile4.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/cosme_marygrace";
    window.open("https://mobile.twitter.com/cosme_marygrace", "_blank");
  });

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://philippines.globalfcx.com";
    window.open("https://philippines.globalfcx.com", "_blank");
  })
}

/**
 * Moon popups
 */

// popup function Moon point1
const popupMoonPoint1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/dex/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function Moon point2
const popupMoonPoint2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/dex/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


// popup function Moon point3
const popupMoonPoint3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/dex/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

/**
 * Planet4 popups
 */

// popup function planet4 point1
const popupPlanet4Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/defi/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet4 point2
const popupPlanet4Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/defi/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet4 point3
const popupPlanet4Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/defi/image3.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

/**
 * Planet5 popups
 */

// popup function planet5 point1
const popupPlanet5Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/gaming/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet5 point2
const popupPlanet5Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/gaming/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


// popup function planet5 point3
const popupPlanet5Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/gaming/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


/**
 * Planet6 popups
 */

// popup function planet6 point1
const popupPlanet6Point1 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/community/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}

// popup function planet6 point2
const popupPlanet6Point2 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/community/image2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


// popup function planet6 point3
const popupPlanet6Point3 = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../images/community/image1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-planet1-point1', 'enter-button');

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


// click events on points
document.addEventListener('click', () => {
  if (currentIntersect) {
    switch (currentIntersect.object.name) {
      // planet1
      case 'planet1-point1':
        popupPlanet1Point1();
        console.log('clicked on planet1 point1');
        break;

      case 'planet1-point2':
        popupPlanet1Point2();
        console.log('clicked on planet1 point2');
        break;

      case 'planet1-point3':
        popupPlanet1Point3();
        console.log('clicked on planet1 point3');
        break;

      // planet2
      case 'planet2-point1':
        popupPlanet2Point1();
        console.log('clicked on planet2 point1');
        break;

      case 'planet2-point2':
        popupPlanet2Point2();
        console.log('clicked on planet2 point2');
        break;

      case 'planet2-point3':
        popupPlanet2Point3();
        console.log('clicked on planet2 point3');
        break;

      // planet3
      case 'planet3-point1':
        popupPlanet3Point1();
        console.log('clicked on planet3 point1');
        break;

      case 'planet3-point2':
        popupPlanet3Point2();
        console.log('clicked on planet3 point2');
        break;

      case 'planet3-point3':
        popupPlanet3Point3();
        console.log('clicked on planet3 point3');
        break;

      case 'planet3-point4':
        popupPlanet3Point4();
        console.log('clicked on planet3 point4');
        break;

      // moon
      case 'moon-point1':
        popupMoonPoint1();
        console.log('clicked on moon point1');
        break;

      case 'moon-point2':
        popupMoonPoint2();
        console.log('clicked on moon point2');
        break;

      case 'moon-point3':
        popupMoonPoint3();
        console.log('clicked on moon point3');
        break;

      // planet4
      case 'planet4-point1':
        popupPlanet4Point1();
        console.log('clicked on planet4 point1');
        break;

      case 'planet4-point2':
        popupPlanet4Point2();
        console.log('clicked on planet4 point2');
        break;

      case 'planet4-point3':
        popupPlanet4Point3();
        console.log('clicked on planet4 point3');
        break;

      // planet5
      case 'planet5-point1':
        popupPlanet5Point1();
        console.log('clicked on planet5 point1');
        break;

      case 'planet5-point2':
        popupPlanet5Point2();
        console.log('clicked on planet5 point2');
        break;

      case 'planet5-point3':
        popupPlanet5Point3();
        console.log('clicked on planet5 point3');
        break;

      // planet6
      case 'planet6-point1':
        popupPlanet6Point1();
        console.log('clicked on planet6 point1');
        break;

      case 'planet6-point2':
        popupPlanet6Point2();
        console.log('clicked on planet6 point2');
        break;

      case 'planet6-point3':
        popupPlanet6Point3();
        console.log('clicked on planet6 point3');
        break;
    }
  }
});


/**
 * Mouse
 */
const mouse = new THREE.Vector2();

let preX;
let postX;
let preY;
let postY;

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / sizes.width * 2 - 1;
  mouse.y = - (event.clientY / sizes.height) * 2 + 1;

  preX = event.clientX;
  preY = event.clientY;

  setTimeout(() => {
    postX = event.clientX;
    postY = event.clientY;

    // planet 1
    if (isMouseHoldOnPlanet1 && (preX <= postX) && currentIntersect.object.name === 'planet1-mesh') {
      planet1Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet1 && (preY <= postY) && currentIntersect.object.name === 'planet1-mesh') {
      planet1Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet1 && (preX >= postX) && currentIntersect.object.name === 'planet1-mesh') {
      planet1Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet1 && (preY >= postY) && currentIntersect.object.name === 'planet1-mesh') {
      planet1Mesh.rotation.x += 0.05;
    }

    // planet 2
    if (isMouseHoldOnPlanet2 && (preX <= postX) && currentIntersect.object.name === 'planet2-mesh') {
      planet2Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet2 && (preY <= postY) && currentIntersect.object.name === 'planet2-mesh') {
      planet2Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet2 && (preX >= postX) && currentIntersect.object.name === 'planet2-mesh') {
      planet2Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet2 && (preY >= postY) && currentIntersect.object.name === 'planet2-mesh') {
      planet2Mesh.rotation.x += 0.05;
    }

    // planet 3
    if (isMouseHoldOnPlanet3 && (preX <= postX) && currentIntersect.object.name === 'planet3-mesh') {
      planet3Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet3 && (preY <= postY) && currentIntersect.object.name === 'planet3-mesh') {
      planet3Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet3 && (preX >= postX) && currentIntersect.object.name === 'planet3-mesh') {
      planet3Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet3 && (preY >= postY) && currentIntersect.object.name === 'planet3-mesh') {
      planet3Mesh.rotation.x += 0.05;
    }

    // moon
    if (isMouseHoldOnMoon && (preX <= postX) && currentIntersect.object.name === 'moon-mesh') {
      moonMesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnMoon && (preY <= postY) && currentIntersect.object.name === 'moon-mesh') {
      moonMesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnMoon && (preX >= postX) && currentIntersect.object.name === 'moon-mesh') {
      moonMesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnMoon && (preY >= postY) && currentIntersect.object.name === 'moon-mesh') {
      moonMesh.rotation.x += 0.05;
    }

    // planet 4
    if (isMouseHoldOnPlanet4 && (preX <= postX) && currentIntersect.object.name === 'planet4-mesh') {
      planet4Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet4 && (preY <= postY) && currentIntersect.object.name === 'planet4-mesh') {
      planet4Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet4 && (preX >= postX) && currentIntersect.object.name === 'planet4-mesh') {
      planet4Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet4 && (preY >= postY) && currentIntersect.object.name === 'planet4-mesh') {
      planet4Mesh.rotation.x += 0.05;
    }

    // planet 5
    if (isMouseHoldOnPlanet5 && (preX <= postX) && currentIntersect.object.name === 'planet5-mesh') {
      planet5Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet5 && (preY <= postY) && currentIntersect.object.name === 'planet5-mesh') {
      planet5Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet5 && (preX >= postX) && currentIntersect.object.name === 'planet5-mesh') {
      planet5Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet5 && (preY >= postY) && currentIntersect.object.name === 'planet5-mesh') {
      planet5Mesh.rotation.x += 0.05;
    }

    // planet 6
    if (isMouseHoldOnPlanet6 && (preX <= postX) && currentIntersect.object.name === 'planet6-mesh') {
      planet6Mesh.rotation.y += -0.05;
    }

    if (isMouseHoldOnPlanet6 && (preY <= postY) && currentIntersect.object.name === 'planet6-mesh') {
      planet6Mesh.rotation.x += -0.05;
    }

    if (isMouseHoldOnPlanet6 && (preX >= postX) && currentIntersect.object.name === 'planet6-mesh') {
      planet6Mesh.rotation.y += 0.05;
    }

    if (isMouseHoldOnPlanet6 && (preY >= postY) && currentIntersect.object.name === 'planet6-mesh') {
      planet6Mesh.rotation.x += 0.05;
    }

  }, 100);

})

let currentIntersect = null;

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

const interactiveMeshes = [
  ...planets,
  // 
  planet1Point1,
  planet1Point2,
  planet1Point3,
  // 
  planet2Point1,
  planet2Point2,
  planet2Point3,
  // 
  planet3Point1,
  planet3Point2,
  planet3Point3,
  //
  moonPoint1,
  moonPoint2,
  moonPoint3,
  // 
  planet4Point1,
  planet4Point2,
  planet4Point3,
  // 
  planet5Point1,
  planet5Point2,
  planet5Point3,
  // 
  planet6Point1,
  planet6Point2,
  planet6Point3,
]

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(interactiveMeshes);

  if (intersects.length) {
    if (!currentIntersect) {
      document.body.style.cursor = 'pointer';
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      document.body.style.cursor = 'initial';

      isMouseHoldOnPlanet1 = false;
      planet1AnimationEnabled = true;

      isMouseHoldOnPlanet2 = false;
      planet2AnimationEnabled = true;

      isMouseHoldOnPlanet3 = false;
      planet3AnimationEnabled = true;

      isMouseHoldOnMoon = false;
      moonAnimationEnabled = true;

      isMouseHoldOnPlanet4 = false;
      planet4AnimationEnabled = true;

      isMouseHoldOnPlanet5 = false;
      planet5AnimationEnabled = true;

      isMouseHoldOnPlanet6 = false;
      planet6AnimationEnabled = true;

    }

    currentIntersect = null;
  }

  if (isMouseHoldOnPlanet1 ||
    isMouseHoldOnPlanet2 ||
    isMouseHoldOnPlanet3 ||
    isMouseHoldOnMoon ||
    isMouseHoldOnPlanet4 ||
    isMouseHoldOnPlanet5 ||
    isMouseHoldOnPlanet6
  ) {
    controls.enableRotate = false;
  } else {
    controls.enableRotate = true;
  }


  if (animateSystem) {

    if (!isMouseHoldOnPlanet1 && !singlePlanetView) {
      animatePlanet1(planet1AnimationEnabled);
    }

    if (!isMouseHoldOnPlanet2 && !singlePlanetView) {
      animatePlanet2(planet2AnimationEnabled);
    }

    if (!isMouseHoldOnPlanet3 && !singlePlanetView) {
      animatePlanet3(planet3AnimationEnabled);
    }

    if (!isMouseHoldOnMoon && !singlePlanetView) {
      animateMoon(moonAnimationEnabled);
    }

    if (!isMouseHoldOnPlanet4 && !singlePlanetView) {
      animatePlanet4(planet4AnimationEnabled);
    }

    if (!isMouseHoldOnPlanet5 && !singlePlanetView) {
      animatePlanet5(planet5AnimationEnabled);
    }

    if (!isMouseHoldOnPlanet6 && !singlePlanetView) {
      animatePlanet6(planet6AnimationEnabled);
    }
  }


  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();