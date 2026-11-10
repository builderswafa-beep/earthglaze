'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ThreeGiftBoxCanvas({
  items = [],
  onUnboxingComplete,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // 3D Model references for animation
  const boxGroupRef = useRef(null);
  const lidPivotRef = useRef(null);
  const interiorLightRef = useRef(null);
  const productMeshesRef = useRef([]);

  // Match customer's purchased items to the 3 real EarthGlaze products
  const getPurchasedProductList = () => {
    if (!items || items.length === 0) {
      return [
        { type: 'manjistha', name: 'Manjistha Soap', price: 349, qty: 1 },
        { type: 'goatmilk', name: 'Goat Milk Soap', price: 300, qty: 1 },
        { type: 'lipbalm', name: 'Beet Root Lip Balm', price: 249, qty: 1 },
      ];
    }

    const matched = [];
    items.forEach((item) => {
      const name = (item.product_name || item.name || '').toLowerCase();
      const sku = (item.sku || '').toLowerCase();
      const qty = item.quantity || 1;
      const price = item.total_price || item.unit_price * qty || 300;

      if (name.includes('goat') || sku.includes('goat')) {
        matched.push({ type: 'goatmilk', name: item.product_name || 'Goat Milk Soap', price, qty });
      } else if (name.includes('balm') || sku.includes('balm') || name.includes('beet')) {
        matched.push({ type: 'lipbalm', name: item.product_name || 'Beet Root Lip Balm', price, qty });
      } else {
        matched.push({ type: 'manjistha', name: item.product_name || 'Manjistha Soap', price, qty });
      }
    });

    const unique = [];
    const seen = new Set();
    for (const p of matched) {
      if (!seen.has(p.type)) {
        seen.add(p.type);
        unique.push(p);
      }
      if (unique.length === 3) break;
    }
    return unique.length > 0 ? unique : [
      { type: 'manjistha', name: 'Manjistha Soap', price: 349, qty: 1 },
      { type: 'goatmilk', name: 'Goat Milk Soap', price: 300, qty: 1 },
      { type: 'lipbalm', name: 'Beet Root Lip Balm', price: 249, qty: 1 },
    ];
  };

  const productList = getPurchasedProductList();

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 840;
    const height = Math.min(Math.max(width * 0.62, 380), 520);

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup (studio perspective)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 8.0);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Studio Lighting
    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfffbf0, 1.35);
    scene.add(ambientLight);

    // Key Directional Light (casts warm directional sunlight shadow)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    keyLight.position.set(4, 7, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    // Fill Light (soft cool botanical bounce from left)
    const fillLight = new THREE.DirectionalLight(0xdff0e6, 1.1);
    fillLight.position.set(-4.5, 4, 3.5);
    scene.add(fillLight);

    // Back / Rim Light (creates subtle rim highlight on box edges)
    const rimLight = new THREE.DirectionalLight(0xffe8b8, 1.3);
    rimLight.position.set(0, 5, -4.5);
    scene.add(rimLight);

    // Interior Golden Glow Light (inside box cavity)
    const interiorLight = new THREE.PointLight(0xffdf80, 0, 6, 1.8);
    interiorLight.position.set(0, 0.7, 0);
    scene.add(interiorLight);
    interiorLightRef.current = interiorLight;

    // 5. Contact Shadow Ground Plane
    const shadowGeo = new THREE.PlaneGeometry(12, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Box Front Logo Texture (EarthGlaze gold foil logo + botanical filigree)
    const boxFrontTex = textureLoader.load('/assets/3d_box_front_texture.png');
    boxFrontTex.colorSpace = THREE.SRGBColorSpace;

    // Golden Tissue Paper Texture
    const tissueTex = textureLoader.load('/assets/3d_tissue_texture.png');
    tissueTex.colorSpace = THREE.SRGBColorSpace;
    tissueTex.wrapS = THREE.RepeatWrapping;
    tissueTex.wrapT = THREE.RepeatWrapping;
    tissueTex.repeat.set(2, 2);

    // High-resolution Transparent Product Cutouts
    const texManjistha = textureLoader.load('/assets/3d_prod_manjistha_closed_box.png');
    texManjistha.colorSpace = THREE.SRGBColorSpace;

    const texGoatMilk = textureLoader.load('/assets/3d_prod_goatmilksoap_close_box.png');
    texGoatMilk.colorSpace = THREE.SRGBColorSpace;

    const texLipBalm = textureLoader.load('/assets/3d_prod_lip_balm_closed_box.png');
    texLipBalm.colorSpace = THREE.SRGBColorSpace;

    // 7. Materials Definition
    // Forest-green packaging material (#0F3822)
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x0f3822,
      roughness: 0.38,
      metalness: 0.08,
    });

    // Front wall material with EarthGlaze logo texture
    const frontWallMat = [
      boxMat, // right
      boxMat, // left
      boxMat, // top
      boxMat, // bottom
      new THREE.MeshStandardMaterial({
        map: boxFrontTex,
        roughness: 0.35,
        metalness: 0.15,
      }), // front (+Z)
      boxMat, // back (-Z)
    ];

    // Metallic satin gold material for ribbon & bow
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.88,
    });

    // Interior tissue cushion material
    const tissueMat = new THREE.MeshStandardMaterial({
      map: tissueTex,
      color: 0xe5c378,
      roughness: 0.65,
      metalness: 0.12,
    });

    // 8. Build 3D Gift Box
    // Dimensions: width 3.6, height 1.35, depth 2.4, wall thickness 0.08
    const boxGroup = new THREE.Group();
    boxGroupRef.current = boxGroup;
    scene.add(boxGroup);

    const bW = 3.6;
    const bH = 1.35;
    const bD = 2.4;
    const t = 0.08;

    // Floor panel
    const floorGeo = new THREE.BoxGeometry(bW, t, bD);
    const floorMesh = new THREE.Mesh(floorGeo, boxMat);
    floorMesh.position.set(0, t / 2, 0);
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    boxGroup.add(floorMesh);

    // Front Wall (with logo texture)
    const frontGeo = new THREE.BoxGeometry(bW, bH, t);
    const frontMesh = new THREE.Mesh(frontGeo, frontWallMat);
    frontMesh.position.set(0, bH / 2, bD / 2 - t / 2);
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    boxGroup.add(frontMesh);

    // Back Wall
    const backGeo = new THREE.BoxGeometry(bW, bH, t);
    const backMesh = new THREE.Mesh(backGeo, boxMat);
    backMesh.position.set(0, bH / 2, -bD / 2 + t / 2);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    boxGroup.add(backMesh);

    // Left Wall
    const sideW = bD - 2 * t;
    const leftGeo = new THREE.BoxGeometry(t, bH, sideW);
    const leftMesh = new THREE.Mesh(leftGeo, boxMat);
    leftMesh.position.set(-bW / 2 + t / 2, bH / 2, 0);
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    boxGroup.add(leftMesh);

    // Right Wall
    const rightGeo = new THREE.BoxGeometry(t, bH, sideW);
    const rightMesh = new THREE.Mesh(rightGeo, boxMat);
    rightMesh.position.set(bW / 2 - t / 2, bH / 2, 0);
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    boxGroup.add(rightMesh);

    // Gold Vertical Ribbon Band on Front Wall
    const ribbonFrontGeo = new THREE.BoxGeometry(0.24, bH + 0.01, t + 0.01);
    const ribbonFront = new THREE.Mesh(ribbonFrontGeo, goldMat);
    ribbonFront.position.set(0, bH / 2, bD / 2 - t / 2 + 0.005);
    ribbonFront.castShadow = true;
    boxGroup.add(ribbonFront);

    // Golden Crumpled Tissue Paper Bed inside Box
    const tissueGeo = new THREE.BoxGeometry(bW - 2 * t - 0.05, 0.65, bD - 2 * t - 0.05);
    const tissueMesh = new THREE.Mesh(tissueGeo, tissueMat);
    tissueMesh.position.set(0, 0.42, 0);
    tissueMesh.receiveShadow = true;
    boxGroup.add(tissueMesh);

    // 9. Build Separate 3D Hinged Lid
    // Pivot positioned EXACTLY at top back edge of the box: y = bH, z = -bD / 2
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, bH, -bD / 2);
    lidPivotRef.current = lidPivot;
    boxGroup.add(lidPivot);

    const lidW = bW + 0.12;
    const lidD = bD + 0.12;
    const lidThickness = 0.08;
    const lidLipHeight = 0.28;

    // Top panel of lid (relative to pivot: center along Z is lidD / 2)
    const lidTopGeo = new THREE.BoxGeometry(lidW, lidThickness, lidD);
    const lidTopMesh = new THREE.Mesh(lidTopGeo, boxMat);
    lidTopMesh.position.set(0, lidThickness / 2, lidD / 2);
    lidTopMesh.castShadow = true;
    lidTopMesh.receiveShadow = true;
    lidPivot.add(lidTopMesh);

    // Lid drop rims (front, left, right lips hanging down)
    const rimFrontGeo = new THREE.BoxGeometry(lidW, lidLipHeight, t);
    const rimFront = new THREE.Mesh(rimFrontGeo, boxMat);
    rimFront.position.set(0, -lidLipHeight / 2 + lidThickness, lidD - t / 2);
    rimFront.castShadow = true;
    lidPivot.add(rimFront);

    const rimLeftGeo = new THREE.BoxGeometry(t, lidLipHeight, lidD);
    const rimLeft = new THREE.Mesh(rimLeftGeo, boxMat);
    rimLeft.position.set(-lidW / 2 + t / 2, -lidLipHeight / 2 + lidThickness, lidD / 2);
    rimLeft.castShadow = true;
    lidPivot.add(rimLeft);

    const rimRightGeo = new THREE.BoxGeometry(t, lidLipHeight, lidD);
    const rimRight = new THREE.Mesh(rimRightGeo, boxMat);
    rimRight.position.set(lidW / 2 - t / 2, -lidLipHeight / 2 + lidThickness, lidD / 2);
    rimRight.castShadow = true;
    lidPivot.add(rimRight);

    // Gold Ribbon cross band on top of lid
    const lidRibbonZGeo = new THREE.BoxGeometry(0.24, lidThickness + 0.015, lidD + 0.01);
    const lidRibbonZ = new THREE.Mesh(lidRibbonZGeo, goldMat);
    lidRibbonZ.position.set(0, lidThickness / 2 + 0.005, lidD / 2);
    lidRibbonZ.castShadow = true;
    lidPivot.add(lidRibbonZ);

    const lidRibbonXGeo = new THREE.BoxGeometry(lidW + 0.01, lidThickness + 0.015, 0.24);
    const lidRibbonX = new THREE.Mesh(lidRibbonXGeo, goldMat);
    lidRibbonX.position.set(0, lidThickness / 2 + 0.005, lidD / 2);
    lidRibbonX.castShadow = true;
    lidPivot.add(lidRibbonX);

    // 3D Gold Ribbon Bow on top center of lid
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, lidThickness + 0.05, lidD / 2);
    lidPivot.add(bowGroup);

    // Center knot
    const knotGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const knotMesh = new THREE.Mesh(knotGeo, goldMat);
    knotMesh.castShadow = true;
    bowGroup.add(knotMesh);

    // Left ribbon loop
    const loopGeoL = new THREE.TorusGeometry(0.25, 0.065, 12, 24, Math.PI * 1.6);
    const loopL = new THREE.Mesh(loopGeoL, goldMat);
    loopL.rotation.set(Math.PI / 2, -0.35, 0);
    loopL.position.set(-0.24, 0.08, 0);
    loopL.castShadow = true;
    bowGroup.add(loopL);

    // Right ribbon loop
    const loopGeoR = new THREE.TorusGeometry(0.25, 0.065, 12, 24, Math.PI * 1.6);
    const loopR = new THREE.Mesh(loopGeoR, goldMat);
    loopR.rotation.set(Math.PI / 2, 0.35, 0);
    loopR.position.set(0.24, 0.08, 0);
    loopR.castShadow = true;
    bowGroup.add(loopR);

    // Ribbon tails draping slightly
    const tailGeo = new THREE.BoxGeometry(0.18, 0.02, 0.45);
    const tail1 = new THREE.Mesh(tailGeo, goldMat);
    tail1.position.set(-0.25, -0.02, 0.22);
    tail1.rotation.set(0.2, 0.3, 0);
    bowGroup.add(tail1);

    const tail2 = new THREE.Mesh(tailGeo, goldMat);
    tail2.position.set(0.25, -0.02, 0.22);
    tail2.rotation.set(0.2, -0.3, 0);
    bowGroup.add(tail2);

    // Initial Lid State: COMPLETELY CLOSED
    lidPivot.rotation.x = 0;

    // 10. Build Real Skincare Products inside the 3D scene
    const productsGroup = new THREE.Group();
    scene.add(productsGroup);

    const createdProductMeshes = [];

    productList.forEach((prod, idx) => {
      let mesh;
      const count = productList.length;

      // Realistic 3D Product Cartons with Authentic Packaging Textures
      if (prod.type === 'manjistha' || prod.type === 'goatmilk') {
        const pW = 1.05;
        const pH = 1.25;
        const pD = 0.58;
        const pGeo = new THREE.BoxGeometry(pW, pH, pD);

        const tex = prod.type === 'manjistha' ? texManjistha : texGoatMilk;
        const pMatFront = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.32,
          metalness: 0.06,
        });
        const pMatBase = new THREE.MeshStandardMaterial({
          color: prod.type === 'manjistha' ? 0xf5eee0 : 0xfbf9f3,
          roughness: 0.38,
          metalness: 0.04,
        });

        const pMats = [pMatBase, pMatBase, pMatBase, pMatBase, pMatFront, pMatBase];
        mesh = new THREE.Mesh(pGeo, pMats);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      } else {
        // 3D Round Lip Balm Tin
        const r = 0.50;
        const h = 0.36;
        const cylGeo = new THREE.CylinderGeometry(r, r, h, 32);

        const topMat = new THREE.MeshStandardMaterial({
          map: texLipBalm,
          roughness: 0.30,
          metalness: 0.25,
        });
        const sideMat = new THREE.MeshStandardMaterial({
          color: 0x881337, // deep beetroot magenta
          roughness: 0.28,
          metalness: 0.75,
        });
        const botMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37, // gold metallic base
          roughness: 0.3,
          metalness: 0.8,
        });

        mesh = new THREE.Mesh(cylGeo, [sideMat, topMat, botMat]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }

      // Products START INSIDE THE BOX CAVITY:
      // y = 0.52 (well below box top rim of 1.35), z = 0
      let startX = 0;
      if (count === 2) {
        startX = idx === 0 ? -0.75 : 0.75;
      } else if (count === 3) {
        startX = idx === 0 ? -1.0 : idx === 1 ? 0 : 1.0;
      }

      mesh.position.set(startX, 0.52, 0);
      mesh.scale.set(0.9, 0.9, 0.9);

      // Target position: Arranged neatly in front of the open box
      let endX = 0;
      let endZ = 2.15;
      let endY = prod.type === 'lipbalm' ? 0.24 : 0.62;
      let endRotY = 0;
      let endRotX = 0.04;
      let endRotZ = 0;

      if (count === 1) {
        endX = 0;
        endZ = 2.25;
      } else if (count === 2) {
        endX = idx === 0 ? -1.05 : 1.05;
        endRotY = idx === 0 ? 0.22 : -0.22;
        endZ = 2.2;
      } else if (count === 3) {
        if (idx === 0) {
          endX = -1.45;
          endZ = 2.05;
          endRotY = 0.26;
          endRotZ = -0.04;
        } else if (idx === 1) {
          endX = 0;
          endZ = 2.35;
          endRotY = 0;
        } else {
          endX = 1.45;
          endZ = 2.05;
          endRotY = -0.26;
          endRotZ = 0.04;
        }
      }

      mesh.userData = {
        startX,
        startY: 0.52,
        startZ: 0,
        endX,
        endY,
        endZ,
        endRotX,
        endRotY,
        endRotZ,
        prodInfo: prod,
      };

      productsGroup.add(mesh);
      createdProductMeshes.push(mesh);
    });

    productMeshesRef.current = createdProductMeshes;

    // 11. Render Loop with subtle organic floating
    const clock = new THREE.Clock();
    let isFloating = false;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Subtle organic breathing motion once fully revealed
      if (isFloating && boxGroupRef.current) {
        boxGroupRef.current.position.y = Math.sin(elapsedTime * 1.4) * 0.032;
        boxGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.7) * 0.018;

        if (cameraRef.current) {
          cameraRef.current.position.x = Math.sin(elapsedTime * 0.4) * 0.12;
          cameraRef.current.lookAt(0, 0.45, 0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Master Animation Sequencing using GSAP
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instant reveal for reduced-motion users
      lidPivot.rotation.x = -Math.PI * 0.65;
      interiorLight.intensity = 1.2;
      createdProductMeshes.forEach((mesh) => {
        mesh.position.set(mesh.userData.endX, mesh.userData.endY, mesh.userData.endZ);
        mesh.rotation.set(mesh.userData.endRotX, mesh.userData.endRotY, mesh.userData.endRotZ);
        mesh.scale.set(1, 1, 1);
      });
      isFloating = true;
      if (onUnboxingComplete) onUnboxingComplete();
    } else {
      const masterTl = gsap.timeline({
        delay: 1.2,
        onComplete: () => {
          isFloating = true;
          if (onUnboxingComplete) onUnboxingComplete();
        },
      });

      // STAGE A: BOX ARRIVAL (enters smoothly from center, moving forward)
      boxGroup.position.set(0, -1.8, -2.5);
      boxGroup.scale.set(0.65, 0.65, 0.65);
      boxGroup.rotation.y = -0.15;

      masterTl.to(boxGroup.position, {
        y: 0,
        z: 0,
        duration: 1.05,
        ease: 'back.out(1.2)',
      })
      .to(boxGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.05,
        ease: 'back.out(1.2)',
      }, '<')
      .to(boxGroup.rotation, {
        y: 0,
        duration: 0.95,
        ease: 'power2.out',
      }, '<');

      // STAGE B: BOX OPENING (lid rotates backwards around its physical back hinge)
      masterTl.to(lidPivot.rotation, {
        x: -Math.PI * 0.65, // -117 degrees backwards
        duration: 1.25,
        ease: 'power2.inOut',
      }, '+=0.15');

      // Soft natural interior light illuminates the cavity
      masterTl.to(interiorLight, {
        intensity: 2.2,
        duration: 0.6,
        ease: 'power2.out',
      }, '<0.2')
      .to(interiorLight, {
        intensity: 1.0,
        duration: 0.7,
        ease: 'power1.inOut',
      }, '+=0.1');

      // STAGE C: PRODUCT REVEAL
      // Step 1: All products rise together out of the box cavity, clearing the front wall!
      createdProductMeshes.forEach((mesh, i) => {
        masterTl.to(mesh.position, {
          y: 2.2 + (i === 1 ? 0.15 : 0),
          duration: 0.9,
          ease: 'back.out(1.4)',
        }, i === 0 ? '-=0.85' : '<0.08');

        masterTl.to(mesh.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.85,
          ease: 'power2.out',
        }, '<');
      });

      // Step 2: All products glide forward and outward to their landing positions!
      createdProductMeshes.forEach((mesh, i) => {
        masterTl.to(mesh.position, {
          x: mesh.userData.endX,
          y: mesh.userData.endY,
          z: mesh.userData.endZ,
          duration: 0.95,
          ease: 'power3.inOut',
        }, i === 0 ? '+=0.05' : '<0.06');

        masterTl.to(mesh.rotation, {
          x: mesh.userData.endRotX,
          y: mesh.userData.endRotY,
          z: mesh.userData.endRotZ,
          duration: 0.95,
          ease: 'power3.out',
        }, '<');

        masterTl.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        }, '<');
      });
    }

    // 13. Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth || 840;
      const newH = Math.min(Math.max(newW * 0.62, 380), 520);

      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 14. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      scene.clear();
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[840px] mx-auto flex items-center justify-center select-none"
      style={{
        minHeight: '380px',
        maxHeight: '520px',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none pointer-events-none"
        style={{
          background: 'transparent',
          outline: 'none',
        }}
      />
    </div>
  );
}
