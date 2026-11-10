/**
 * EarthGlaze — Natural Skincare
 * 3D Interactive Product Experience
 * Hydrating Face Cream (50 g) Studio View
 * 
 * Built with Three.js & GSAP animation sequence.
 * Features:
 *  - High-fidelity frosted glass jar body with refractive optical depth
 *  - Natural beechwood cap with procedural grain and chamfered bevels
 *  - Rich whipped cosmetic cream with organic swirl ripples and specular gloss
 *  - Authentic EarthGlaze logo, typography, and botanical emblem label mapping
 *  - Realistic warm golden & botanical green lighting with contact shadow
 *  - 6-phase opening animation sequence (fly-in, rotation, cap lift, floating, shine, replay)
 *  - Touch & mouse 360° interactive orbit exploration
 */

(function () {
  'use strict';

  // 3D Engine State
  const state = {
    isOpen: false,
    isAnimating: false,
    capIsOpen: false,
    currentTimeline: null,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    targetRotationY: 0.15,
    targetRotationX: 0.1,
    currentRotationY: 0.15,
    currentRotationX: 0.1,
    clock: null,
    floatingTime: 0,
    isFloating: false,
  };

  // Three.js References
  let scene, camera, renderer, animationFrameId;
  let jarGroup, bodyGroup, capGroup, creamMesh, labelMesh, contactShadow, creamGlintLight;
  let woodTexture, labelTexture, creamTexture;

  // DOM Elements
  const stageEl = document.getElementById('product-3d-stage');
  const canvasEl = document.getElementById('product-3d-canvas');
  const canvasWrap = document.getElementById('product-3d-canvas-wrap');
  const closeBtn = document.getElementById('close-3d-btn');
  const replayBtn = document.getElementById('replay-3d-btn');
  const toggleCapBtn = document.getElementById('toggle-cap-btn');
  const toggleCapText = document.getElementById('toggle-cap-text');
  const centralCardEl = document.querySelector('.step-card[data-card-index="2"]');

  /**
   * Initialize Three.js Scene, Materials, Lights, and Model
   */
  function init3D() {
    if (!canvasEl || !window.THREE) return false;

    state.clock = new THREE.Clock();

    // 1. Scene with soft fog matching brand palette #FAF4EE
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFAF4EE, 0.035);

    // 2. Camera: Luxury telephoto perspective (low distortion)
    const aspect = canvasWrap ? canvasWrap.clientWidth / canvasWrap.clientHeight : window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    camera.position.set(0, 0.6, 8.5);

    // 3. Renderer with high color fidelity and tone mapping
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
    if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    // 4. Setup Lighting
    setupLights();

    // 5. Load Textures & Build 3D Jar Model
    loadTexturesAndBuildModel();

    // 6. Setup Interactive Events (Orbit, Click, Touch)
    setupInteractionListeners();

    // 7. Start Render Loop
    animate();

    return true;
  }

  /**
   * Luxury Lighting Rig: Warm Cream Key, Soft Mint Fill, Emerald Rim, Amber Halo
   */
  function setupLights() {
    // A. Soft Ambient Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xEADECA, 0.9);
    scene.add(hemiLight);

    // B. Main Warm Key Light (Upper-Right Front)
    const keyLight = new THREE.DirectionalLight(0xFFF6EA, 1.4);
    keyLight.position.set(4.5, 6, 5);
    scene.add(keyLight);

    // C. Soft Diffused Fill Light (Upper-Left)
    const fillLight = new THREE.DirectionalLight(0xEFF7F1, 0.8);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    // D. Signature Botanical Rim Light (Behind-Left, casts fresh green edge glint)
    const rimLight = new THREE.DirectionalLight(0x8EB58F, 0.95);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // E. Warm Amber Pedestal Glow Light (Directly behind jar)
    const backglowLight = new THREE.PointLight(0xF4C579, 1.2, 10);
    backglowLight.position.set(0, 0.2, -2.5);
    scene.add(backglowLight);

    // F. Cream Surface Glint Spotlight (used during cap opening)
    creamGlintLight = new THREE.SpotLight(0xFFFFFF, 0, 8, Math.PI / 6, 0.6, 1);
    creamGlintLight.position.set(1.5, 4.5, 2.5);
    scene.add(creamGlintLight);
  }

  /**
   * Load Textures and Assemble the 3D Jar Model
   */
  function loadTexturesAndBuildModel() {
    const textureLoader = new THREE.TextureLoader();

    // Texture 1: Beechwood Cap Texture
    woodTexture = textureLoader.load('assets/wood-cap-texture.png', (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(1.5, 1);
      if (renderer) renderer.render(scene, camera);
    });

    // Texture 2: High-Resolution Front Product Label
    labelTexture = textureLoader.load('assets/jar-label-texture.png', () => {
      if (renderer) renderer.render(scene, camera);
    });

    // Texture 3: Cosmetic Whipped Cream Swirl Texture
    creamTexture = textureLoader.load('assets/cream-swirl-texture.png', () => {
      if (renderer) renderer.render(scene, camera);
    });

    // Root Assembly Group
    jarGroup = new THREE.Group();
    jarGroup.position.set(0, -0.15, 0);
    scene.add(jarGroup);

    // ------------------------------------------------------------------------
    // Part A: Frosted Opal Glass Jar Body
    // ------------------------------------------------------------------------
    bodyGroup = new THREE.Group();
    jarGroup.add(bodyGroup);

    // Outer Glass Jar Body (Filleted Cylinder)
    const jarOuterGeo = new THREE.CylinderGeometry(2.0, 1.95, 2.05, 64, 8);
    const jarGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7,
      roughness: 0.16,
      metalness: 0.04,
      transmission: 0.22,
      thickness: 1.15,
      ior: 1.51,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });
    const jarOuterMesh = new THREE.Mesh(jarOuterGeo, jarGlassMat);
    jarOuterMesh.position.y = 0;
    bodyGroup.add(jarOuterMesh);

    // Rounded Bottom Rim (Torus fillet)
    const baseFilletGeo = new THREE.TorusGeometry(1.92, 0.08, 24, 64);
    baseFilletGeo.rotateX(Math.PI / 2);
    const baseFilletMesh = new THREE.Mesh(baseFilletGeo, jarGlassMat);
    baseFilletMesh.position.y = -1.0;
    bodyGroup.add(baseFilletMesh);

    // Inner Jar Hollow Chamber
    const jarInnerGeo = new THREE.CylinderGeometry(1.72, 1.68, 1.85, 48);
    const jarInnerMat = new THREE.MeshStandardMaterial({
      color: 0xFAF6EF,
      roughness: 0.35,
    });
    const jarInnerMesh = new THREE.Mesh(jarInnerGeo, jarInnerMat);
    jarInnerMesh.position.y = 0.08;
    bodyGroup.add(jarInnerMesh);

    // Jar Neck / Screw Ring (Translucent Polypropylene)
    const neckGeo = new THREE.CylinderGeometry(1.76, 1.78, 0.42, 64);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.28,
      metalness: 0.02,
      transparent: true,
      opacity: 0.92,
    });
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.y = 1.18;
    bodyGroup.add(neckMesh);

    // Delicate screw thread ribs around neck
    for (let r = 0; r < 2; r++) {
      const threadGeo = new THREE.TorusGeometry(1.77, 0.025, 16, 48);
      threadGeo.rotateX(Math.PI / 2);
      const threadMesh = new THREE.Mesh(threadGeo, neckMat);
      threadMesh.position.y = 1.08 + r * 0.15;
      bodyGroup.add(threadMesh);
    }

    // ------------------------------------------------------------------------
    // Part B: Authentic Front Product Label
    // ------------------------------------------------------------------------
    // Curved label cylinder matching front arc
    const labelGeo = new THREE.CylinderGeometry(
      2.015,
      1.965,
      1.55,
      48,
      1,
      true,
      -Math.PI * 0.35,
      Math.PI * 0.70
    );
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      transparent: true,
      roughness: 0.38,
      metalness: 0.02,
    });
    labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.02;
    bodyGroup.add(labelMesh);

    // ------------------------------------------------------------------------
    // Part C: Whipped Cosmetic Cream Inside Jar
    // ------------------------------------------------------------------------
    // Rich swirling spiral surface geometry with organic peak
    const creamRadius = 1.70;
    const creamGeo = new THREE.CylinderGeometry(creamRadius, creamRadius * 0.95, 0.45, 64, 16);
    
    // Displace top vertices into an organic cosmetic swirl
    const posAttr = creamGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);

      if (vy > 0.1) {
        const dist = Math.sqrt(vx * vx + vz * vz);
        const normDist = dist / creamRadius;
        const angle = Math.atan2(vz, vx);

        // Spiral ripples with central whipped wave
        const ripple = Math.sin(normDist * 12.0 - angle * 2.8) * 0.06;
        const peak = Math.exp(-normDist * 2.5) * 0.18;
        const rim = Math.sin(normDist * Math.PI) * 0.04;
        
        posAttr.setY(i, vy + ripple + peak + rim);
      }
    }
    creamGeo.computeVertexNormals();

    const creamMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFDF8,
      map: creamTexture,
      roughness: 0.22,
      metalness: 0.0,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      reflectivity: 0.65,
    });
    creamMesh = new THREE.Mesh(creamGeo, creamMat);
    creamMesh.position.y = 0.88;
    bodyGroup.add(creamMesh);

    // ------------------------------------------------------------------------
    // Part D: Natural Beechwood Cap Group (Lifts and Separates)
    // ------------------------------------------------------------------------
    capGroup = new THREE.Group();
    // Default closed position sitting flush on top of jar body
    capGroup.position.set(0, 1.25, 0);
    jarGroup.add(capGroup);

    // Main Wooden Cap Cylinder
    const capGeo = new THREE.CylinderGeometry(2.05, 2.08, 0.78, 64, 4);
    const capWoodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      color: 0xFAF3EA,
      roughness: 0.45,
      metalness: 0.02,
    });
    const capMainMesh = new THREE.Mesh(capGeo, capWoodMat);
    capMainMesh.position.y = 0.39;
    capGroup.add(capMainMesh);

    // Rounded Top Edge (Fillet Bevel)
    const capBevelGeo = new THREE.TorusGeometry(2.02, 0.06, 24, 64);
    capBevelGeo.rotateX(Math.PI / 2);
    const capBevelMesh = new THREE.Mesh(capBevelGeo, capWoodMat);
    capBevelMesh.position.y = 0.77;
    capGroup.add(capBevelMesh);

    // Top Cap Disc (End-grain surface)
    const capTopDiscGeo = new THREE.CircleGeometry(2.02, 64);
    capTopDiscGeo.rotateX(-Math.PI / 2);
    const capTopDisc = new THREE.Mesh(capTopDiscGeo, capWoodMat);
    capTopDisc.position.y = 0.78;
    capGroup.add(capTopDisc);

    // Cap Underside Cosmetic Liner (Clean white seal ring)
    const linerGeo = new THREE.CylinderGeometry(1.82, 1.82, 0.06, 48);
    const linerMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
    });
    const linerMesh = new THREE.Mesh(linerGeo, linerMat);
    linerMesh.position.y = 0.02;
    capGroup.add(linerMesh);

    // ------------------------------------------------------------------------
    // Part E: Soft Contact Floor Shadow
    // ------------------------------------------------------------------------
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(40, 25, 12, 0.45)');
    grad.addColorStop(0.35, 'rgba(70, 45, 20, 0.22)');
    grad.addColorStop(0.7, 'rgba(120, 90, 50, 0.06)');
    grad.addColorStop(1, 'rgba(250, 244, 238, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
    });
    contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.y = -1.04;
    jarGroup.add(contactShadow);
  }

  /**
   * 6-Phase Cinematic Opening Animation Sequence
   */
  function runOpeningSequence() {
    if (!jarGroup || !capGroup) return;

    state.isAnimating = true;
    state.isFloating = false;

    // Reset initial transforms for replay
    state.targetRotationY = 0.22;
    state.targetRotationX = 0.08;

    // Check if GSAP is available
    if (window.gsap) {
      if (state.currentTimeline) {
        state.currentTimeline.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          state.isAnimating = false;
          state.capIsOpen = true;
          state.isFloating = true;
          if (toggleCapText) toggleCapText.textContent = 'Close Lid';
        },
      });
      state.currentTimeline = tl;

      // Reset to closed start state
      gsap.set(jarGroup.position, { z: -4.5, y: -0.35 });
      gsap.set(jarGroup.scale, { x: 0.72, y: 0.72, z: 0.72 });
      gsap.set(jarGroup.rotation, { x: 0.12, y: -0.45 });
      gsap.set(capGroup.position, { y: 1.25 });
      gsap.set(capGroup.rotation, { y: 0, z: 0 });
      if (creamGlintLight) creamGlintLight.intensity = 0;

      // ----------------------------------------------------------------------
      // Sequence 1: Selected product moves smoothly forward from carousel toward viewer
      // ----------------------------------------------------------------------
      tl.to(jarGroup.position, {
        z: 0.1,
        y: -0.15,
        duration: 1.0,
        ease: 'power2.out',
      }, 0);

      tl.to(jarGroup.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 1.0,
        ease: 'power2.out',
      }, 0);

      // ----------------------------------------------------------------------
      // Sequence 2: Glass jar rotates gently to reveal form, label & realistic reflections
      // ----------------------------------------------------------------------
      tl.to(jarGroup.rotation, {
        y: 0.22,
        x: 0.08,
        duration: 1.2,
        ease: 'power1.inOut',
      }, 0.2);

      // ----------------------------------------------------------------------
      // Sequence 3: Wooden cap slowly unscrews & lifts upward, separating from jar
      // ----------------------------------------------------------------------
      // Slight unscrew twist
      tl.to(capGroup.rotation, {
        y: Math.PI * 0.75,
        duration: 1.4,
        ease: 'power1.inOut',
      }, 1.1);

      // Upward vertical separation revealing cream inside
      tl.to(capGroup.position, {
        y: 3.35,
        duration: 1.4,
        ease: 'power2.out',
      }, 1.1);

      // Subtle tilt of floating cap
      tl.to(capGroup.rotation, {
        z: 0.06,
        duration: 0.8,
        ease: 'sine.out',
      }, 1.7);

      // ----------------------------------------------------------------------
      // Sequence 4: Cap floats above jar while cream surface receives glossy highlight
      // ----------------------------------------------------------------------
      if (creamGlintLight) {
        tl.to(creamGlintLight, {
          intensity: 1.8,
          duration: 0.6,
          ease: 'power2.in',
        }, 1.6);
        tl.to(creamGlintLight.position, {
          x: -1.2,
          y: 3.8,
          duration: 1.2,
          ease: 'sine.inOut',
        }, 1.8);
        tl.to(creamGlintLight, {
          intensity: 0.9,
          duration: 0.8,
          ease: 'power1.out',
        }, 2.5);
      }

      // Contact shadow subtly adjusts
      tl.to(contactShadow.scale, {
        x: 1.08,
        y: 1.08,
        duration: 1.0,
        ease: 'power2.out',
      }, 0);

    } else {
      // Robust Fallback Tween Engine (Zero External Dependency)
      runFallbackTween();
    }
  }

  /**
   * Replay animation or close/open cap
   */
  function toggleCapAnimation() {
    if (!capGroup || state.isAnimating) return;

    state.isAnimating = true;

    if (state.capIsOpen) {
      // Smoothly return cap to jar
      state.isFloating = false;
      if (window.gsap) {
        gsap.timeline({
          onComplete: () => {
            state.isAnimating = false;
            state.capIsOpen = false;
            if (toggleCapText) toggleCapText.textContent = 'Open Lid';
          },
        })
        .to(capGroup.position, {
          y: 1.25,
          duration: 0.9,
          ease: 'power2.inOut',
        })
        .to(capGroup.rotation, {
          y: 0,
          z: 0,
          duration: 0.9,
          ease: 'power2.inOut',
        }, 0);
      } else {
        capGroup.position.y = 1.25;
        capGroup.rotation.y = 0;
        capGroup.rotation.z = 0;
        state.isAnimating = false;
        state.capIsOpen = false;
        if (toggleCapText) toggleCapText.textContent = 'Open Lid';
      }
    } else {
      // Replay open animation
      runOpeningSequence();
    }
  }

  /**
   * Fallback Tween Engine if GSAP is not yet loaded
   */
  function runFallbackTween() {
    const startTime = performance.now();
    const duration = 2800;

    jarGroup.position.set(0, -0.15, -4);
    jarGroup.scale.set(0.75, 0.75, 0.75);
    jarGroup.rotation.set(0.12, -0.4);
    capGroup.position.y = 1.25;
    capGroup.rotation.set(0, 0, 0);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Phase 1: Forward glide (0 - 0.4)
      const p1 = Math.min(1, progress / 0.4);
      const ease1 = 1 - Math.pow(1 - p1, 2);
      jarGroup.position.z = -4 + ease1 * 4.1;
      jarGroup.scale.setScalar(0.75 + ease1 * 0.3);

      // Phase 2: Rotation (0.1 - 0.5)
      const p2 = Math.max(0, Math.min(1, (progress - 0.1) / 0.4));
      jarGroup.rotation.y = -0.4 + p2 * 0.62;

      // Phase 3 & 4: Cap lift (0.4 - 0.9)
      if (progress > 0.4) {
        const p3 = Math.min(1, (progress - 0.4) / 0.5);
        const ease3 = 1 - Math.pow(1 - p3, 3);
        capGroup.position.y = 1.25 + ease3 * 2.1;
        capGroup.rotation.y = ease3 * Math.PI * 0.75;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        state.isAnimating = false;
        state.capIsOpen = true;
        state.isFloating = true;
        if (toggleCapText) toggleCapText.textContent = 'Close Lid';
      }
    }
    requestAnimationFrame(step);
  }

  /**
   * Mouse and Touch Orbit Interaction
   */
  function setupInteractionListeners() {
    if (!canvasEl) return;

    // Pointer Down (Mouse & Touch)
    function onPointerDown(e) {
      state.isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      state.prevPointerX = clientX;
      state.prevPointerY = clientY;
    }

    // Pointer Move
    function onPointerMove(e) {
      if (!state.isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - state.prevPointerX;
      const deltaY = clientY - state.prevPointerY;

      state.prevPointerX = clientX;
      state.prevPointerY = clientY;

      // Update target rotation with smooth scaling
      state.targetRotationY += deltaX * 0.007;
      state.targetRotationX = Math.max(-0.35, Math.min(0.35, state.targetRotationX + deltaY * 0.005));
    }

    // Pointer Up
    function onPointerUp() {
      state.isDragging = false;
    }

    canvasEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvasEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Window Resize
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    if (!camera || !renderer || !canvasWrap) return;
    const width = canvasWrap.clientWidth;
    const height = canvasWrap.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /**
   * Main Render Loop with Smooth Orbit Damping & Floating Cap Oscillation
   */
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!state.isOpen && !state.isAnimating) return;

    const delta = state.clock ? state.clock.getDelta() : 0.016;
    state.floatingTime += delta;

    // Smooth Orbit Damping (Inertia)
    if (!state.isAnimating && jarGroup) {
      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.08;
      state.currentRotationX += (state.targetRotationX - state.currentRotationX) * 0.08;
      jarGroup.rotation.y = state.currentRotationY;
      jarGroup.rotation.x = state.currentRotationX;
    }

    // Organic Floating Oscillation on Open Cap
    if (state.isFloating && capGroup) {
      const bob = Math.sin(state.floatingTime * 2.2) * 0.08;
      const tilt = Math.cos(state.floatingTime * 1.6) * 0.025;
      capGroup.position.y = 3.35 + bob;
      capGroup.rotation.z = 0.06 + tilt;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  /**
   * Open the 3D Product Experience
   */
  function openExperience() {
    if (state.isOpen) return;
    state.isOpen = true;

    // 1. Initialize Three.js on first open
    if (!scene) {
      const initialized = init3D();
      if (!initialized) {
        console.warn('Three.js failed to initialize');
        return;
      }
    }

    // 2. Dim surrounding carousel cards & step backward
    const allCards = document.querySelectorAll('.step-card, .ghost-card');
    allCards.forEach((c) => {
      c.classList.add('carousel-card-dimmed');
    });

    // 3. Reveal 3D Stage Overlay with smooth fade
    if (stageEl) {
      stageEl.classList.remove('pointer-events-none', 'opacity-0');
      stageEl.classList.add('pointer-events-auto', 'opacity-100');
      stageEl.setAttribute('aria-hidden', 'false');
    }

    // 4. Force resize & start animation sequence
    onWindowResize();
    runOpeningSequence();
  }

  /**
   * Close the 3D Product Experience & Return to Carousel
   */
  function closeExperience() {
    if (!state.isOpen) return;

    // 1. Fade out stage
    if (stageEl) {
      stageEl.classList.remove('pointer-events-auto', 'opacity-100');
      stageEl.classList.add('pointer-events-none', 'opacity-0');
      stageEl.setAttribute('aria-hidden', 'true');
    }

    // 2. Restore carousel cards
    const allCards = document.querySelectorAll('.step-card, .ghost-card');
    allCards.forEach((c) => {
      c.classList.remove('carousel-card-dimmed');
    });

    state.isOpen = false;
    state.isFloating = false;
  }

  /**
   * Attach Click Triggers to DOM Elements
   */
  function setupTriggers() {
    // A. Central Card Click Handler (Hydrating Face Cream)
    if (centralCardEl) {
      centralCardEl.addEventListener('click', (e) => {
        // If clicking on center card (step-0), trigger 3D Studio!
        if (centralCardEl.classList.contains('step-0')) {
          e.stopPropagation();
          openExperience();
        }
      });
    }

    const hintPill = document.querySelector('.card-3d-hint-pill');
    if (hintPill) {
      hintPill.addEventListener('click', (e) => {
        e.stopPropagation();
        openExperience();
      });
    }

    // B. Close Button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeExperience);
    }

    // C. Replay Animation Button
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        runOpeningSequence();
      });
    }

    // D. Toggle Cap Button
    if (toggleCapBtn) {
      toggleCapBtn.addEventListener('click', toggleCapAnimation);
    }

    // E. Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeExperience();
      }
    });

    // F. Backdrop click to close
    const backdrop = document.querySelector('.product-3d-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeExperience);
    }
  }

  // Self-initialize triggers on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTriggers);
  } else {
    setupTriggers();
  }

  // Public API
  window.EarthGlaze3D = {
    open: openExperience,
    close: closeExperience,
    replay: runOpeningSequence,
    toggleCap: toggleCapAnimation,
    state: state,
  };

})();
