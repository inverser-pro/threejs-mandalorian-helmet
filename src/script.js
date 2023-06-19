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

// Shader material for pseudoLines
//const shaderMaterial=[]
// \ Shader material for pseudoLines
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
            animationScripts.forEach(a=>{
                if (oldScrollPercent >= a.start && oldScrollPercent < a.end) {
                a.func();
                }
            })
        }
        // sceneGlb.children[0].children[0].receiveShadow=true
        // sceneGlb.children[0].children[0].castShadow=true


                // обрезаем анимированные линии
                //
                renderer.localClippingEnabled = true;
                // \
                const clipPlanes = [
                    new THREE.Plane( new THREE.Vector3( .8, 0, 0 ),1),
                    new THREE.Plane( new THREE.Vector3( -.8, 0, 0 ),1),
                    // new THREE.Plane( new THREE.Vector3( 0, 0, .8 ),1),
                    // new THREE.Plane( new THREE.Vector3( .8, 0, .8 ),1),
                    //new THREE.Plane( new THREE.Vector3( -.8, 0, .8 ),1),
                    new THREE.Plane( new THREE.Vector3( 0, 0, -.8 ),3),
                    //new THREE.Plane( new THREE.Vector3( .8, 0, -.8 ),1),
                    //new THREE.Plane( new THREE.Vector3( -.8, 0, -.8 ),1),
                ];
                const helpers = new THREE.Group();
                helpers.add( new THREE.PlaneHelper( clipPlanes[0], 5, 0xff0000 ) );
                helpers.add( new THREE.PlaneHelper( clipPlanes[1], 5, 0xcccccc ) );
                helpers.add( new THREE.PlaneHelper( clipPlanes[2], 5, 0x0086ff ) );
                //helpers.add( new THREE.PlaneHelper( clipPlanes[3], 5, 0xffff00 ) );
                //helpers.add( new THREE.PlaneHelper( clipPlanes[4], 5, 0x00ffff ) );
                //helpers.add( new THREE.PlaneHelper( clipPlanes[5], 5, 0x00ff00 ) );
                //helpers.add( new THREE.PlaneHelper( clipPlanes[6], 5, 0xffff00 ) );
                //helpers.add( new THREE.PlaneHelper( clipPlanes[7], 5, 0x00ffff ) );
                //console.log(helpers);
                helpers.visible = false;
                scene.add( helpers );

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
                function getRandomFloat(min, max) {
                    return Math.random() * (max - min) + min
                };
                const material = new THREE.MeshPhysicalMaterial({
                    roughness: .05,
                    transmission: 1,
                    thickness: 1.4,
                    metalness: .2,
                    //color:0x2c2c2c,
                    color:0xffffff,
                    sheen:0,
                    sheenColor:0x000000,
                    sheenRoughness:.2,
                    ior:1.9,
                    envMap: hdrEquirect,
                    envMapIntensity:1,
                    // wireframe:true,
                });
                mesh.material=material;
                let i=0;
                const grp=new THREE.Group(),
                      forMemory=[];
                // проходим по всему массиву точек стекла шлема
                //  ЭТО СЛИШКОМ НАПРЯЖНАЯ ОПЕРАЦИЯ. ЛЕГЧЕ УБРАТЬ ЛИШНИЕ ТОЧКИ В САМОЙ МОДЕЛИ. НО МНЕ ЛЕНЬ
                while(mesh.geometry.attributes.position.count*3>i){
                    // позиция каждой точки стекла шлема
                    const x=mesh.geometry.attributes.position.array[i++],
                          y=mesh.geometry.attributes.position.array[i++],
                          z=mesh.geometry.attributes.position.array[i++];
                    
                    // рабочий код
                    const hgt=getRandomFloat(1,2),
                            pseudoLines=new THREE.Mesh(
                            new THREE.CylinderGeometry(.01,.01,hgt,6),
                            //shaderForThisLine
                            new THREE.MeshBasicMaterial({
                                color:0xffffff,
                                side:THREE.DoubleSide,
                                clippingPlanes: clipPlanes,
                                clipIntersection: false
                            })
                        );
                    pseudoLines.rotateX(Math.PI/-1.0)
                    pseudoLines.position.set(
                        x,  y,  z,
                    );
                    grp.add(pseudoLines);
                    // Animate pseudo lines
                    animejs({targets:pseudoLines.position,y:[z+2,z,z+2,z],duration:duration,easing,loop:true,delay:getRandomFloat(0,3e3)});

                    // if array is empty
                    /* if(forMemory.length===0){
                        forMemory.push([x,y,z])
                    }else{
                        let forCounter=0
                        for(const el of forMemory){// проходимся по массиму с уже обработанными точками
                            if(el[0]===x&&el[1]===y&&el[2]===z){
                                //console.log('true detected')
                            }else{
                                forCounter++
                                // находим разницу расстояния между всеми точками К ОДНОЙ и добавляем только те (по идее), которые находятся НЕ близко друг к другу
                                const distance = new THREE.Vector3(el[0],el[1],el[2]).distanceTo(new THREE.Vector3(x,y,z));
                                //console.log(distance);
                                if(distance>5){
                                    console.log('distance>5 detected');
                                    // const hgt=getRandomFloat(1,2),
                                    //         pseudoLines=new THREE.Mesh(
                                    //         new THREE.CylinderGeometry(.01,.01,hgt,6),
                                    //         //shaderForThisLine
                                    //         new THREE.MeshBasicMaterial({
                                    //             color:0xffffff,
                                    //             side:THREE.DoubleSide,
                                    //             clippingPlanes: clipPlanes,
                                    //             clipIntersection: false
                                    //         })
                                    //     );
                                    // pseudoLines.rotateX(Math.PI/-1.0)
                                    // pseudoLines.position.set(
                                    //     x,  y,  z,
                                    // );
                                    // grp.add(pseudoLines);
                    
                                    // Set the desired quaternion rotation
                                    //const quaternion = new THREE.Quaternion();
                                    //quaternion.setFromAxisAngle(new THREE.Vector3(x,y,z).multiplyScalar(2), Math.PI / 2); // Rotate 90 degrees around the y-axis
        
                                    // Set the quaternion rotation to the cylinder's rotation property
                                    //pseudoLines.rotation.setFromQuaternion(quaternion);
                
                                    // console.log(pseudoLines);
                                    // Animate pseudo lines
                                //    animejs({targets:pseudoLines.position,y:[z+25,z,z+25,z],duration:duration,easing,loop:true,delay:getRandomFloat(0,3e3)});
                                }
                            }
                        }
                        forMemory.push([x,y,z])
                        console.log(forCounter); */
                    // }
                    //const pseudoLinesClone=pseudoLines.clone()
                    /* const shaderForThisLine=new THREE.ShaderMaterial({
                        uniforms: {
                        color1: { value: new THREE.Color(0xffffff)},
                        color2: { value: new THREE.Color(0x000000)},
                        ratio: {value: 1.},
                        time: {value: 0.},
                    },
                        vertexShader: `varying vec2 vUv;
                    varying vec3 vPosition;
                    void main () {
                        vPosition = position;
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
                    }`,
                        fragmentShader: `varying vec2 vUv;
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float ratio;
                    uniform float time;
                    float cubicPulse(float c, float w, float x){
                        x = abs(x - c);
                        if(x>w) return 0.0;
                        x /= w;
                        return 1.0 - x*x*(3.0-2.0*x);
                    }
                    void main(){
                        vec2 uv = (vUv - 0.5) * vec2(ratio, 1.);
                        float alpha = cubicPulse(sin(time),1.,vUv.y*.5);
                        gl_FragColor = vec4(mix(color1, color2, length(uv)), alpha);
                    }`,
                        transparent:true,//opacity: 1,depthWrite:false,
                        clippingPlanes: clipPlanes,
                        clipIntersection: false
                    })
                    shaderMaterial.push(
                        shaderForThisLine
                    ) */
                    
                    // animejs({targets:pseudoLines.scale,y:[0,getRandomFloat(1,3)],duration:duration,easing:'easeOutElastic',loop:true,delay:getRandomFloat(.1,5e3)});
                    // if(i>500)break // JFT
                }
                // grp — это анимированные за шлемом линии...
                grp.rotateX(Math.PI/2)
                grp.scale.set(.95,.95,.95)
                grp.position.set(0,0,-.9)
                sceneGlb.add(grp)
                // Добавлю лист, чтобы скрыть нижние линии, улитевшие назад
                const pln=new THREE.Mesh(
                    new THREE.PlaneGeometry(1.3,1.3),
                    new THREE.MeshBasicMaterial({color:0x000000})
                );
                pln.rotateX(-2.4)
                pln.scale.set(20,20,20)
                pln.position.set(0,0,-1.5)
                mesh.add(pln)
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

//JFT
//let iiii=0
// \ JFT

const tick = ()=>{

    // const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);

    animate()

    // console.log(shaderMaterial);

    //if( /*JFT*/ /* iiii>200 && */ /*JFT*/ shaderMaterial&&shaderMaterial.length>0){
        //shaderMaterial[0].uniforms.time.value=elapsedTime
    //    for(const el of shaderMaterial){
    //        el.uniforms.time.value=elapsedTime
    //    }
    //}

    // JFT
    //iiii++
    // \ JFT

}

tick()