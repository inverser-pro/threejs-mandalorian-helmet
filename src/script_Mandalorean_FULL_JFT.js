import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'
// HDR map
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const models=Object.create({
    model:'/models/THREE_52_without_pre_keys.glb',
    hdr:'/hdr/kiara_1_dawn_4k.hdr', // HDR map
});

// Scene
const scene = new THREE.Scene()

const hdrEquirect = new RGBELoader().load(
    models.hdr,
    () => {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        const sphere=new THREE.Mesh(
            new THREE.IcosahedronGeometry(8,4),
            new THREE.MeshBasicMaterial({
                map:hdrEquirect,
                side:THREE.DoubleSide,
            })
        );
        scene.add(sphere)
    }
);

const loader = new GLTFLoader(),
      dracoLoader = new DRACOLoader();
let mixer;//for animation
dracoLoader.setDecoderPath('/js/libs/draco/'); // v155 use a full url path
loader.setDRACOLoader(dracoLoader);

loader.load(
    models.model,// Manda full
    glb=>{
        //console.log(glb.scene);
        const sceneGlb=glb.scene;
        //console.log(sceneGlb.material);
        //sceneGlb.material.color=0x00ffff;//new THREE.MeshBasicMaterial({color:0x00ffff})
        //scene.add(glb);
        //for(const model_ of sceneGlb.children){
            /* if(model_.name==='Armature'){//Sketchfab_model_0|Sketchfab_model_0001
                const y=model_.children[0];
                //console.log(y);
                //y.material=new THREE.Material({color:0x000000});
                scene.add(y);
                console.log(model_);
            } */
        //    if(sceneGlb.children[0]){
        //        console.log(sceneGlb.children[0]);
        //    }
        //}

        sceneGlb.position.set(0,-1,0)
        scene.add(sceneGlb)
        //sceneGlb.scale.set(.01, .01, .01)

        mixer = new THREE.AnimationMixer(sceneGlb);
        mixer.timeScale=8;// DEF: 8
        mixer.clipAction((glb).animations[0]).play();
        // установим параметры, чтобы анимация останавливалась после полного проигрывания на последнем кадре
        mixer._actions[0].clampWhenFinished=true;
        mixer._actions[0].loop = THREE.LoopOnce;
        // проверим воспроизводится ли на данный момент 0 (первая) анимация (ходьба)
        // если уже НЕТ, то запускаем вторую анимацию
        let tt=setInterval(()=>{
            if(!mixer._actions[0].isRunning()){
                // console.log('!! anim finished___!!');
                clearInterval(tt);
                tt=null;
                // Воспроизводим вторую анимацию (цикличное дыхание)
                // Она почему-то с прерыванием. то дышит, то — нет. ниже попытался исправить, но не вышло быстро... попробую хотя бы сделать, чтобы после запуска второй он находился в том же месте...
                mixer.clipAction((glb).animations[1]).play();
                //mixer.setTime(50);
                // mixer._actions[1].clampWhenFinished=true;
                // mixer._actions[1].loop = THREE.LoopOnce;
                //sceneGlb.position.set(0,-1,.6)
            }
            // console.log(mixer._actions[0].isRunning());
        },500);
        /* setInterval(()=>{
            if(mixer._actions[1]){
                console.log('anim 2 is running');
                if(!mixer._actions[1].isRunning()){
                    mixer.setTime(50);
                    mixer._actions[1].play=true; ///  TRY!
                    mixer._actions[1].clampWhenFinished=true;
                    mixer._actions[1].loop = THREE.LoopOnce;
                    console.log('anim 2 REPLAYING');

                }else{
                    console.log('anim 2 playing');
                }
            }
            // if(!mixer._actions[1].isRunning()){
            //     console.log('!! anim 2 finished___!!');
            //     //mixer.setTime(50);
            //     // mixer._actions[1].clampWhenFinished=false;
            //     // mixer._actions[1].loop = THREE.LoopRepeat;
            //     //sceneGlb.position.set(1,0,1)
            // }
            // // JFT
            // else{
            //     console.log('anim 2 NOT FINISHED');
            // }
            // console.log(mixer._actions[0].isRunning());
        },500);
        // FIX~!~ animation start
        setTimeout(()=>mixer.setTime(0),0); */
//JFT
// console.log(mixer);

/* setTimeout(()=>{
    //mixer.timeScale = -1;
    mixer.play = false;
    console.log(mixer);
},1400); */
// \ JFT
        //console.log((glb).animations);

        let metall=sceneGlb.children[0]; // and his childrens
        console.log(metall.children)
        if(metall.children.length>0){
            for(const m_ of metall.children){//sceneGlb.children[0].children[0].children[0].children[0].children[0].children[0].children[4].material.envMapIntensity=.8
                //console.log(m_);
                if(m_.name==='02_armor')m_.material.envMap = hdrEquirect}
            }
        }
)

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// JFT
/* const geometry = new THREE.BoxGeometry(3, 3, 3 );
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xffffff)
const cube = new THREE.Mesh(geometry,material)
scene.add(cube) */

// Lights

const pointLight = new THREE.PointLight(0xffffff, 35)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 5
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas/* ,alpha: true */
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//renderer.setClearColor(0x000000, 0);
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    // animate sceneGLB
    if (mixer) mixer.update(clock.getDelta());
}

tick()