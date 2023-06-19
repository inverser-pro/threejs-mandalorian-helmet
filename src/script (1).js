import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import animejs from 'animejs/lib/anime.es.js'
//import * as dat from 'dat.gui'

// HDR map
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import {VolumetricMatrial} from './threex.volumetricspotlightmaterial'

// Debug
//const gui = new dat.GUI()
"use strict";
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const sceneData=Object.create({
    model:'/models/Mandalorean_pseudo_hidden_bg3.glb',
    hdr:'/hdr/softly_gray.hdr', // HDR map
})

// Objects
/* const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere) */

// CODE
let scrollPercent =0, oldScrollPercent = 0, old2=0,
    percentToScreens=330,
    pl=null,
    matForLight;
if(window.innerWidth<1025){//MOBILE
    // camera.position.set(0, 0, 3.2);
    percentToScreens=400
}
const loader = new GLTFLoader(),
      dracoLoader = new DRACOLoader(),
      d=document,
      a=e=>d.querySelectorAll(e),
      s=e=>(d.querySelector(e))?d.querySelector(e):null,
      DEBUG=true,
      easing='linear',
      duration=2000,
      screenConst=parseInt(window.getComputedStyle(d.body).height)/ 45 //percentToScreens;//100/7 ( 7 = screens.length);
      // console.log(screenConst);
function lerp(x, y, a) {return (1 - a) * x + a * y}
// HDR map
const hdrEquirect = new RGBELoader().load(
    sceneData.hdr,
    () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
);
// \ HDR map
dracoLoader.setDecoderPath('/js/libs/draco-new/'); // use a full url path
loader.setDRACOLoader(dracoLoader);
loader.load(
    sceneData.model,// Manda
    gltf=>{
        const sceneGlb=gltf.scene,
              animationScripts = [{ start:0, end:0, func:0 }];
        sceneGlb.scale.set(.05,.05,.05)

        // Add volumetric light
        const cylForLight=new THREE.CylinderGeometry( .01, 2.7, 10, 64, 80, true);
        // console.log(cylForLight.parameters);
        cylForLight.scale(10,10,10)
        cylForLight.translate( 0, 32, 15.5 );
        //cylForLight.rotateX( -Math.PI / 2 );
        matForLight	= VolumetricMatrial()
        const meshForLight	= new THREE.Mesh( cylForLight, matForLight);
        meshForLight.position.set(1,2.1,.2)
        //meshForLight.lookAt(sceneGlb.position.x+.1,sceneGlb.position.y+.7,sceneGlb.position.z)
        //meshForLight.lookAt(sceneGlb.position.x-.25,sceneGlb.position.y,sceneGlb.position.z)
        matForLight.uniforms.lightColor.value.set(0xffffff)
        matForLight.uniforms.spotPosition.value	= meshForLight.position
        matForLight.uniforms.anglePower.value=10.
        matForLight.uniforms.attenuation.value=2.7
        matForLight.uniforms.yy.value=.2
        //matForLight.uniforms.rotationY.value=mesh.rotation.y
        matForLight.uniforms.need.value=1.1
        //matForLight.uniforms.attenuation.value=3.
        sceneGlb.add( meshForLight );

        /* sceneGlb.add( 
            new THREE.Mesh(
                cylForLight,
                new THREE.MeshBasicMaterial({opacity:.5,transparent:true})
            )
         ) */
        // \ Add volumetric light
        scene.add(sceneGlb)

        sceneGlb.rotation.set(-.21,0,0)
        sceneGlb.position.set(0,-.49,0)

        //animejs({targets:sceneGlb.position,z:[-4,0],duration,delay:2e3,easing})

        const tmp2scr=screenConst,// 2 screen
              tmp3scr=screenConst*1.8,// 3 screen
              tmp4scr=screenConst*2.8,// 4 screen
              tmp5scr=screenConst*3.8// 4 screen
        animationScripts.push({// 2 screen
            start: 0,
            end: tmp2scr,
            func: () => {
                sceneGlb.position.set(
                    lerp(0, 1.9, scalePercent(0, tmp2scr)), // x
                    -.49, //lerp(-.49,-.49, scalePercent(0, tmp2scr)), // y
                    0 // z
                )
                sceneGlb.rotation.set(-.21,lerp(0, -.6, scalePercent(0, tmp2scr)),0)
            },
        });
        animationScripts.push({// 3 screen
            start: tmp2scr,
            end: tmp3scr,
            func: () => {
                sceneGlb.position.set(
                    lerp(1.9, -1.4, scalePercent(tmp2scr, tmp3scr)), // x
                    -.49,
                    0 // z
                )
                sceneGlb.rotation.set(-.21,lerp(-.6, .6, scalePercent(tmp2scr, tmp3scr)),0)
            },
        });
        animationScripts.push({// 4 screen
            start: tmp3scr,
            end: tmp4scr,
            func: () => {
                sceneGlb.position.set(
                    lerp(-1.4, 2.4, scalePercent(tmp3scr, tmp4scr)), // x
                    -.49,
                    lerp(0, 1.3, scalePercent(tmp3scr, tmp4scr)) // z
                )
                sceneGlb.rotation.set(-.21,lerp(.6, -1.2, scalePercent(tmp3scr, tmp4scr)),0)
            },
        });
        animationScripts.push({// 5 screen
            start: tmp4scr,
            end: tmp5scr,
            func: () => {
                sceneGlb.position.set(
                    lerp(2.4, .7, scalePercent(tmp4scr, tmp5scr)), // x
                    -.49,
                    lerp(1.3, 3, scalePercent(tmp4scr, tmp5scr)) // z
                )
                sceneGlb.rotation.set(-.21,lerp(-1.2, -1.8, scalePercent(tmp4scr, tmp5scr)),0)
            },
        });

        animationScripts.push({
            start: tmp5scr,
            end: 101,
            func: () => {
                scalePercent(tmp5scr, 101)
            }
        })

        pl=()=>{
            //if(oldScrollPercent<scrollPercent){oldScrollPercent=scrollPercent}
            if(oldScrollPercent){
                animationScripts.forEach(a=>{
                    if (oldScrollPercent >= a.start && oldScrollPercent < a.end) {
                    /* if(typeof func==='function') */a.func();
                    //console.log(777);
                    }
                })
            }
        }

        // sceneGlb.children[0].children[0].receiveShadow=true
        // sceneGlb.children[0].children[0].castShadow=true


        for(const el in sceneGlb.children[0].children){
            //sceneGlb.children[0].children[el].receiveShadow=true
            sceneGlb.children[0].children[el].castShadow=true;
            const mesh = sceneGlb.children[0].children[el];
            /*
            New_object_1-5
            New_object_1 — main helmet
            New_object_2 — что-то на ушах (где и накладки)
            New_object_3 — накладки на ушах
            New_object_4 — unknown
            New_object_5 — glass
             */
            //console.log(mesh.name); // what is it?
            if(mesh.name!=='New_object_5'){
                mesh.material.color=new THREE.Color(0x1c1810)
                mesh.material.roughness=.4
                mesh.material.metalness=.5

                // HDR map
                mesh.material.envMapIntensity=.8
                mesh.material.envMap = hdrEquirect
                // \ HDR map

            }
            if(mesh.name==='New_object_5'){ // Glass
                //mesh.material.color=new THREE.Color(0x000000)
                //mesh.material.roughness=.1
                //mesh.material.metalness=.9

                // HDR map
                //mesh.material.envMapIntensity=1
                //mesh.material.envMap = hdrEquirect
                // \ HDR map


                const material = new THREE.MeshPhysicalMaterial({
                    roughness: .1,
                    transmission: .9,
                    thickness: 3.4,
                    metalness: .2,
                    color:0x2c2c2c,
                    sheen:1,
                    sheenColor:0x000000,
                    sheenRoughness:.2,
                    ior:1.9,
                    envMap: hdrEquirect,
                    envMapIntensity:1,
                    // wireframe:true,

                });
                mesh.material=material;
                console.log(mesh);
                let i=0;
                // const positionOfGlassPoints=[];
                const pseudoLines=new THREE.Mesh(
                    new THREE.BoxGeometry(.5,.5,.5),
                    new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide})
                );
                const grp=new THREE.Group()
                // 1000 < 0
                // console.log(mesh.geometry.attributes.position.count*3>i);
                while(mesh.geometry.attributes.position.count*3>i){
                    // const cloned=pseudoLines.clone()
                    // cloned.position.set(i++,i++,i++);
                    // scene.add(cloned)
                    //const pseudoLinesClone=pseudoLines.clone()
                    const pseudoLinesClone=new THREE.Mesh(
                        new THREE.BoxGeometry(.5,.5,.5),
                        new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide})
                    );
                    pseudoLinesClone.position.set(
                        //new THREE.Vector3(
                            mesh.geometry.attributes.position.array[i++],
                            mesh.geometry.attributes.position.array[i++],
                            mesh.geometry.attributes.position.array[i++],
                        //)
                    );
                    //console.log(i);
                    // pseudoLinesClone.lookAt(mesh)
                    grp.add(pseudoLinesClone)

                    //if(i>500)break // JFT
                    //i++
                }
                grp.rotateX(Math.PI/2.3)
                grp.scale.set(.046,.046,.046)
                grp.position.set(0,-.44,.09)
                scene.add(grp)


                
                    

                /* const pointGeometry = new THREE.Geometry();
                pointGeometry.vertices.push( new THREE.Vector3( 0, 1, 0), new THREE.Vector3( 0, 2, 0), new THREE.Vector3( 0, 3, 0) );
                            
                const pointMaterial = new THREE.PointsMaterial( { color: 0x888888 , size: 0.15 } ); ///what to do here
                
                pointOnGeo = new THREE.Points( pointGeometry, pointMaterial ); */

            }
            // mesh.material.color=new THREE.Color(0x1c1810)
            // mesh.material.envMapIntensity=.8
            // mesh.material.envMap = hdrEquirect
            // mesh.receiveShadow=true
            // mesh.castShadow=true
            //sceneGlb.children[0].children[el].castShadow.material=new THREE.Material

            //JFT || light & light helper
                /* const lightPos={x:0,y:0,z:.7}
                const pointLightJFT = new THREE.PointLight(0xffffff, 1)
                    pointLightJFT.position.set(lightPos.x,lightPos.y,lightPos.z)
                    scene.add(pointLightJFT)
                const boxJFT = new THREE.BoxGeometry(.1,.1,.1);
                const meshJFT=new THREE.Mesh(boxJFT,new THREE.MeshStandardMaterial({color:0xff0000}));
                scene.add(meshJFT);
                meshJFT.position.set(lightPos.x,lightPos.y+.1,lightPos.z) */
            // \ JFT
        }

        /* function scalePercent(start, end) {
            return (scrollPercent - start) / (end - start)
        } */

        function scalePercent(start, end) {
            let howTo=.1;
            if(scrollPercent<0)scrollPercent=0
            if(scrollPercent>99)scrollPercent=99
            if(Math.abs(old2-scrollPercent)>10){
                howTo=.16
            }
            if(Math.abs(old2-scrollPercent)>15){
                howTo=1
            }
            if(scrollPercent>75)howTo=1
            oldScrollPercent=parseFloat(parseFloat(oldScrollPercent).toFixed(2))
            scrollPercent=parseFloat(parseFloat(scrollPercent).toFixed(2))
            if(parseFloat(oldScrollPercent-scrollPercent)>0){
                oldScrollPercent=parseFloat(oldScrollPercent)-howTo;
            }
            if(oldScrollPercent<scrollPercent){
                oldScrollPercent=oldScrollPercent+howTo;
            }
            if(parseInt(oldScrollPercent)===parseInt(scrollPercent)){
                old2=scrollPercent
            }
            return (oldScrollPercent - start) / (end - start)
        };

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
    //    window.addEventListener('mousemove',onPointerMove,false)
    //    document.addEventListener('mouseleave',()=>{
    //        animejs({targets:sceneGlb.rotation,y:0,duration:duration/2,easing})
    //    })
        // \ Helmet Rotation
        // floor
        /* const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshStandardMaterial({color:0x333333,side: THREE.DoubleSide,}))
        floor.rotateX(-Math.PI/2)
        floor.position.set(0,-.45,0)
        floor.receiveShadow = true;
        scene.add(floor) */
        // \ floor
        /////////////   \\\ LESS 2 

    }
);

window.scrollTo({ top: 0, behavior: 'smooth' })
function animate() {
    //requestAnimationFrame(animate)
    if(typeof pl==='function')pl()
    //render()
    //stats.update()
    //if (mixer) mixer.update(clock.getDelta());
}
// \ CODE



/* const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.setx = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight) */

const pointLight2 = new THREE.PointLight(0xffffff, 3)
pointLight2.position.setx = 2
pointLight2.position.y = 3
pointLight2.position.z = 1
scene.add(pointLight2)

/////////////   LESS 2
/* pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.camera.near = .1;
pointLight.castShadow = true; */
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
    window.requestAnimationFrame(tick);

    animate()
}

tick()