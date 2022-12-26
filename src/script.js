import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import animejs from 'animejs/lib/anime.es.js'
//import * as dat from 'dat.gui'

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const sceneData=Object.create({
    model:'/models/Mandalorean.glb',
})

// Objects
/* const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere) */

// CODE
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/js/libs/draco/'); // use a full url path
loader.setDRACOLoader(dracoLoader);
loader.load(
    sceneData.model,// Spaceship
    gltf=>{
        const sceneGlb=gltf.scene
        //console.log(sceneGlb);
        sceneGlb.scale.set(.05,.05,.05)
        scene.add(sceneGlb)

        ///////////// LESS 2

        sceneGlb.rotation.set(-.21,0,0)
        sceneGlb.position.set(0,-.49,0)

        // sceneGlb.children[0].children[0].receiveShadow=true
        // sceneGlb.children[0].children[0].castShadow=true

        for(const el in sceneGlb.children[0].children){
            //sceneGlb.children[0].children[el].receiveShadow=true
            sceneGlb.children[0].children[el].castShadow=true
        }

        let scrollPercent =0, oldScrollPercent = 0, old2=0
        function scalePercent(start, end) {
            //console.log('OLD: '+oldScrollPercent,'CUR: '+scrollPercent,'OLD2: '+old2,`MIN: ${scrollPercent-old2}`)
            let howTo=.04;
            if(scrollPercent<0)scrollPercent=0
            if(scrollPercent>99)scrollPercent=99
            if(Math.abs(old2-scrollPercent)>10){
                howTo=.1
            }
            if(Math.abs(old2-scrollPercent)>15){
                howTo=1
            }
            if(scrollPercent>75)howTo=1
            oldScrollPercent=parseFloat(parseFloat(oldScrollPercent).toFixed(2))
            scrollPercent=parseFloat(parseFloat(scrollPercent).toFixed(2))
            //console.log(oldScrollPercent);
            //console.log('MINUS',oldScrollPercent-scrollPercent,'OLD:' + oldScrollPercent,'CUR:' + scrollPercent, `howTo => ${howTo}` );
            if(parseFloat(oldScrollPercent-scrollPercent)>0){
                oldScrollPercent=parseFloat(oldScrollPercent)-howTo;
                //console.log('HERE',oldScrollPercent-scrollPercent);
            }
            if(oldScrollPercent<scrollPercent){
                //console.log(Math.abs(scrollPercent-oldScrollPercent))
                //if(Math.abs(scrollPercent-oldScrollPercent)>.1){
                    oldScrollPercent=oldScrollPercent+howTo
                //}
            }
            if(parseInt(oldScrollPercent)===parseInt(scrollPercent)){
                old2=scrollPercent
            }
            //if(scrollPercent>screenConst*5-.1){// we scrolled to end
            //    oldScrollPercent-=howTo
            //}
            //console.log(parseFloat(oldScrollPercent),howTo);
            return (oldScrollPercent - start) / (end - start)
        };


        const d=document,
              a=e=>d.querySelectorAll(e),
              s=e=>(d.querySelector(e))?d.querySelector(e):null,
              DEBUG=true,
              easing='easeInOutExpo',
              duration=2000
        /* JFT */
        const style=d.createElement('style');
        style.innerHTML=`#scrollProgress {position: fixed;bottom: 10px;left: 10px;z-index: 99;font-size: 3vh}`
        d.body.appendChild(style)
        const scrollProgress=d.createElement('span');
        scrollProgress.id='scrollProgress'
        d.body.appendChild(scrollProgress)
        /* \ JFT */

        // https://sbcode.net/threejs/animate-on-scroll/
        d.body.onscroll = () => {//calculate the current scroll progress as a percentage
            scrollPercent = ((d.documentElement.scrollTop || d.body.scrollTop) / ((d.documentElement.scrollHeight || d.body.scrollHeight) - d.documentElement.clientHeight)) * 100;
            /* JFT */
            d.getElementById('scrollProgress').innerText = 'Scroll Progress : ' + scrollPercent.toFixed(2)
            /* \ JFT */
        }

        function clkMnu(container){
            a(container).forEach(e=>{
              e.addEventListener("click",q=>{
                const where=e.dataset.where;//main
                q.preventDefault();
                if(!where)return
                s(".to-"+where).scrollIntoView({behavior:"smooth"});
                return false;
              });
            });
        }
        clkMnu("nav ul li a");
        // console.log(sceneGlb);

        // Helmet Rotation
        function onPointerMove( event ) {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            const x = ((event.clientX / window.innerWidth)*2-1) / 4;
            animejs({targets:sceneGlb.rotation,y:x,duration:duration/2,easing})
        }
        window.addEventListener('mousemove',onPointerMove,false)
        document.addEventListener('mouseleave',()=>{
            animejs({targets:sceneGlb.rotation,y:0,duration:duration/2,easing})
        })
        // \ Helmet Rotation
        // floor
        const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshStandardMaterial({color:0x333333,side: THREE.DoubleSide,}))
        floor.rotateX(-Math.PI/2)
        floor.position.set(0,-.45,0)
        floor.receiveShadow = true;
        scene.add(floor)
        // \ floor
        /////////////   \\\ LESS 2 

    }
)
// \ CODE



const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.setx = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/////////////   LESS 2
pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.camera.near = .1;
pointLight.castShadow = true;
/////////////   \\\ LESS 2

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, .1, 100)
camera.position.set(0,1,5);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/////////////   LESS 2
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/////////////   \\\ LESS 2
//const clock = new THREE.Clock()

const tick = () =>
{

    //const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()