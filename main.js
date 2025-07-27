import * as THREE from "three"
import { gsap } from "gsap"

// Global variables
let scene, camera, renderer
let desk,
  room,
  holographicScreens = []
const books = []
let neuralNetwork
const projectGallery = [],
  skillCards = []
let animationMixer, clock
let isAnimationPlaying = true

// Add these variables after the existing global variables
let isViewingProjects = false
let isViewingSkills = false
let currentCardIndex = 0
const viewingCards = []

// New god-level variables
let audioContext, audioAnalyser, audioData
let isAudioEnabled = false
const environmentEffects = []
const weatherSystem = null
let aiAssistant = null
let hologramProjector = null
let quantumField = null
let matrixRain = null

// Camera control variables
let targetRotationX = 0,
  targetRotationY = 0
let rotationX = 0,
  rotationY = 0
let currentDistance = 8

// Mobile touch variables
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
let touchStartX = 0,
  touchStartY = 0
let touchStartDistance = 0
let lastTouchTime = 0
const touchSensitivity = isMobile ? 0.003 : 0.005

// Khentit Safouane Amine's Real Projects
const projectsData = [
  {
    title: "TotTrust",
    tech: "Express.js, MongoDB, WebRTC, WebSockets",
    description:
      "Babysitting freelance platform with live streaming for baby monitoring and real-time communication between parents and babysitters.",
    features: ["Live Video Streaming", "Real-time Chat", "Booking System", "Payment Integration"],
    github: "https://github.com/khentit/tottrust",
    demo: "https://tottrust.com",
    color: "#87CEEB",
  },
  {
    title: "Chatty",
    tech: "Express.js, MongoDB, WebSockets, EJS, Kotlin",
    description:
      "Real-time chat platform similar to Telegram/WhatsApp with mobile app using Jetpack Compose for seamless communication.",
    features: ["Real-time Messaging", "File Sharing", "Group Chats", "Mobile App"],
    github: "https://github.com/khentit/chatty",
    demo: "https://chatty-app.com",
    color: "#9966CC",
  },
  {
    title: "JobScout",
    tech: "NestJS, Angular, PostgreSQL, Puppeteer, Kafka",
    description:
      "Job scraping platform that aggregates opportunities from LinkedIn, Indeed, and Upwork with real-time notifications and smart filtering.",
    features: ["Web Scraping", "Real-time Notifications", "Smart Filtering", "Analytics Dashboard"],
    github: "https://github.com/khentit/jobscout",
    demo: "https://jobscout.dev",
    color: "#800080",
  },
]

// Skills data
const skillsData = [
  { name: "Kotlin", color: "#7F52FF" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "HTML", color: "#E34F26" },
  { name: "CSS", color: "#1572B6" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Angular", color: "#DD0031" },
  { name: "Compose", color: "#4285F4" },
  { name: "Express", color: "#000000" },
  { name: "NestJS", color: "#E0234E" },
  { name: "Docker", color: "#2496ED" },
  { name: "Git", color: "#F05032" },
  { name: "GitHub", color: "#181717" },
  { name: "Redis", color: "#DC382D" },
  { name: "Kafka", color: "#231F20" },
  { name: "System Design", color: "#FF6B6B" },
]

// Initialize the 3D workspace
function init() {
  // Create scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 100)

  // Create camera with better positioning
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(4, 3, 8)
  camera.lookAt(0, 2, 0)

  // Create renderer with better settings
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x0a0a0a, 1)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  document.getElementById("canvas-container").appendChild(renderer.domElement)

  // Add orbit controls
  addOrbitControls()

  // Create the workspace
  createRealisticRoom()
  createRealisticDesk()
  createHolographicScreens()
  createNeuralNetwork()
  createProjectGallery()
  createFlyingSkillCards()
  createRealisticLighting()
  createParticles()

  // GOD-LEVEL COMPONENTS
  createQuantumField()
  createHologramProjector()
  createAIAssistant()
  createMatrixRain()
  createEnvironmentEffects()
  createFloatingCodeMatrix()
  createEnergyBeams()
  createPortalEffects()

  // Initialize mobile controls
  initializeMobileControls()

  // Start animation loop
  clock = new THREE.Clock()
  animate()

  // Hide loading screen
  setTimeout(() => {
    document.getElementById("loading").style.display = "none"
  }, 2000)

  // Simulate loading progress
  simulateLoading()
}

function simulateLoading() {
  const progress = document.getElementById("progress")
  let width = 0
  const interval = setInterval(() => {
    width += Math.random() * 20
    if (width >= 100) {
      width = 100
      clearInterval(interval)
    }
    progress.style.width = width + "%"
  }, 200)
}

function addOrbitControls() {
  let isMouseDown = false
  let mouseX = 0,
    mouseY = 0

  // Mouse controls for desktop
  renderer.domElement.addEventListener("mousedown", (event) => {
    isMouseDown = true
    mouseX = event.clientX
    mouseY = event.clientY
    renderer.domElement.style.cursor = "grabbing"
  })

  renderer.domElement.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      targetRotationY += deltaX * touchSensitivity
      targetRotationX += deltaY * touchSensitivity

      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX))

      mouseX = event.clientX
      mouseY = event.clientY
    }
  })

  renderer.domElement.addEventListener("mouseup", () => {
    isMouseDown = false
    renderer.domElement.style.cursor = "grab"
  })

  renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault()
    const zoomSpeed = 0.1
    const delta = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed

    currentDistance *= delta
    currentDistance = Math.max(3, Math.min(15, currentDistance))
  })

  // Touch controls for mobile
  let touches = []

  renderer.domElement.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault()
      touches = Array.from(event.touches)

      if (touches.length === 1) {
        // Single touch - rotation
        touchStartX = touches[0].clientX
        touchStartY = touches[0].clientY
        showTouchFeedback(touches[0].clientX, touches[0].clientY)
      } else if (touches.length === 2) {
        // Two finger touch - zoom
        const dx = touches[0].clientX - touches[1].clientX
        const dy = touches[0].clientY - touches[1].clientY
        touchStartDistance = Math.sqrt(dx * dx + dy * dy)
      }

      lastTouchTime = Date.now()
    },
    { passive: false },
  )

  renderer.domElement.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault()
      touches = Array.from(event.touches)

      if (touches.length === 1) {
        // Single touch rotation
        const deltaX = touches[0].clientX - touchStartX
        const deltaY = touches[0].clientY - touchStartY

        targetRotationY += deltaX * touchSensitivity
        targetRotationX += deltaY * touchSensitivity

        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX))

        touchStartX = touches[0].clientX
        touchStartY = touches[0].clientY
      } else if (touches.length === 2) {
        // Two finger zoom
        const dx = touches[0].clientX - touches[1].clientX
        const dy = touches[0].clientY - touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (touchStartDistance > 0) {
          const scale = distance / touchStartDistance
          const newDistance = currentDistance / scale
          currentDistance = Math.max(3, Math.min(15, newDistance))
          touchStartDistance = distance
        }
      }
    },
    { passive: false },
  )

  renderer.domElement.addEventListener(
    "touchend",
    (event) => {
      event.preventDefault()
      touches = Array.from(event.touches)

      // Reset touch distance when lifting fingers
      if (touches.length < 2) {
        touchStartDistance = 0
      }
    },
    { passive: false },
  )

  renderer.domElement.style.cursor = "grab"

  function updateCamera() {
    rotationX += (targetRotationX - rotationX) * 0.15
    rotationY += (targetRotationY - rotationY) * 0.15

    camera.position.x = currentDistance * Math.sin(rotationY) * Math.cos(rotationX)
    camera.position.y = currentDistance * Math.sin(rotationX) + 2
    camera.position.z = currentDistance * Math.cos(rotationY) * Math.cos(rotationX)
    camera.lookAt(0, 2, 0)

    requestAnimationFrame(updateCamera)
  }
  updateCamera()
}

function initializeMobileControls() {
  // Zoom in button
  document.getElementById("zoom-in").addEventListener("click", () => {
    currentDistance = Math.max(3, currentDistance - 1)
  })

  // Zoom out button
  document.getElementById("zoom-out").addEventListener("click", () => {
    currentDistance = Math.min(15, currentDistance + 1)
  })

  // Reset view button
  document.getElementById("reset-view").addEventListener("click", () => {
    resetCamera()
  })

  // Add touch feedback for all buttons
  const allButtons = document.querySelectorAll(".control-btn, .touch-btn, .nav-btn")
  allButtons.forEach((button) => {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault()
      button.style.transform = "scale(0.95)"
      showTouchFeedback(e.touches[0].clientX, e.touches[0].clientY)
    })

    button.addEventListener("touchend", (e) => {
      e.preventDefault()
      button.style.transform = "scale(1)"
      // Trigger click after a short delay
      setTimeout(() => {
        button.click()
      }, 50)
    })
  })
}

function showTouchFeedback(x, y) {
  const feedback = document.createElement("div")
  feedback.className = "touch-feedback"
  feedback.style.left = x + "px"
  feedback.style.top = y + "px"
  document.body.appendChild(feedback)

  setTimeout(() => {
    document.body.removeChild(feedback)
  }, 600)
}

function createRealisticRoom() {
  // Realistic floor with wood texture
  const floorGeometry = new THREE.PlaneGeometry(30, 30)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d1b14,
    roughness: 0.8,
    metalness: 0.1,
  })

  // Add wood grain pattern
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")

  // Create wood grain pattern
  ctx.fillStyle = "#2d1b14"
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 100; i++) {
    ctx.strokeStyle = `rgba(${45 + Math.random() * 20}, ${27 + Math.random() * 10}, ${20 + Math.random() * 10}, 0.3)`
    ctx.lineWidth = Math.random() * 3 + 1
    ctx.beginPath()
    ctx.moveTo(0, Math.random() * 512)
    ctx.lineTo(512, Math.random() * 512)
    ctx.stroke()
  }

  const floorTexture = new THREE.CanvasTexture(canvas)
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(4, 4)
  floorMaterial.map = floorTexture

  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Create Matrix-style digital wall texture with better clarity
  function createMatrixWallTexture() {
    const wallCanvas = document.createElement("canvas")
    wallCanvas.width = 1024
    wallCanvas.height = 1024
    const wallCtx = wallCanvas.getContext("2d")

    // Dark background
    wallCtx.fillStyle = "#0a0a0a"
    wallCtx.fillRect(0, 0, 1024, 1024)

    const characters = ["0", "1", "ᛏ", "ᚱ", "ᚦ", "ᚲ", "ᚠ", "ᛋ", "ᛒ", "ᛁ"]
    const fontSize = 16 // Slightly larger for better clarity
    wallCtx.font = `bold ${fontSize}px monospace`
    wallCtx.textAlign = "center"

    // Create vertical streams of characters with better visibility
    for (let col = 0; col < 64; col++) {
      const x = col * 16
      let currentOpacity = Math.random() * 0.3 + 0.5 // Higher base opacity

      for (let row = 0; row < 64; row++) {
        const y = row * 16 + 16
        const char = characters[Math.floor(Math.random() * characters.length)]

        // Create more visible fading effect
        const fadePosition = Math.random() * 15 + 5
        if (row > fadePosition) {
          currentOpacity *= 0.92 // Less aggressive fading
        } else {
          currentOpacity = 0.7 + Math.random() * 0.3 // Brighter characters
        }

        // Leading character is much brighter
        if (row === Math.floor(fadePosition)) {
          wallCtx.fillStyle = "#ffffff"
          wallCtx.shadowColor = "#00ff41"
          wallCtx.shadowBlur = 10
        } else {
          wallCtx.fillStyle = `rgba(0, 255, 65, ${Math.max(currentOpacity, 0.3)})`
          wallCtx.shadowColor = "#00ff41"
          wallCtx.shadowBlur = 3
        }

        wallCtx.fillText(char, x, y)
      }
    }

    const wallTexture = new THREE.CanvasTexture(wallCanvas)
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
    wallTexture.repeat.set(2, 1)
    return wallTexture
  }

  // Matrix wall material
  const matrixWallTexture = createMatrixWallTexture()
  const matrixWallMaterial = new THREE.MeshStandardMaterial({
    map: matrixWallTexture,
    emissive: 0x002211,
    emissiveIntensity: 0.3,
    roughness: 0.9,
    metalness: 0.1,
  })

  // Very slow, subtle animation - almost static
  function animateMatrixWalls() {
    matrixWallTexture.offset.y += 0.0003 // Much slower movement
    requestAnimationFrame(animateMatrixWalls)
  }
  animateMatrixWalls()

  // Walls with Matrix digital rain
  const wallGeometry = new THREE.PlaneGeometry(30, 15)

  // Back wall
  const backWall = new THREE.Mesh(wallGeometry, matrixWallMaterial)
  backWall.position.set(0, 7.5, -15)
  backWall.receiveShadow = true
  scene.add(backWall)

  // Front wall (behind camera/player)
  const frontWallTexture = createMatrixWallTexture()
  const frontWallMaterial = new THREE.MeshStandardMaterial({
    map: frontWallTexture,
    emissive: 0x002211,
    emissiveIntensity: 0.3,
    roughness: 0.9,
    metalness: 0.1,
  })

  const frontWall = new THREE.Mesh(wallGeometry, frontWallMaterial)
  frontWall.position.set(0, 7.5, 15)
  frontWall.rotation.y = Math.PI // Face inward
  frontWall.receiveShadow = true
  scene.add(frontWall)

  // Side walls
  const leftWall = new THREE.Mesh(wallGeometry, matrixWallMaterial.clone())
  leftWall.position.set(-15, 7.5, 0)
  leftWall.rotation.y = Math.PI / 2
  leftWall.receiveShadow = true
  scene.add(leftWall)

  const rightWall = new THREE.Mesh(wallGeometry, matrixWallMaterial.clone())
  rightWall.position.set(15, 7.5, 0)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.receiveShadow = true
  scene.add(rightWall)

  // Ceiling with Matrix code pattern
  const ceilingTexture = createMatrixWallTexture()
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    emissive: 0x001108,
    emissiveIntensity: 0.2,
    roughness: 0.9,
    metalness: 0.1,
  })

  const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial)
  ceiling.position.y = 15
  ceiling.rotation.x = Math.PI / 2
  ceiling.receiveShadow = true
  scene.add(ceiling)
}

function createRealisticDesk() {
  // Ultra-modern floating desk surface with curved edges
  const deskGeometry = new THREE.BoxGeometry(8, 0.12, 4)
  // Round the edges for that premium look
  deskGeometry.parameters.widthSegments = 8
  deskGeometry.parameters.heightSegments = 2
  deskGeometry.parameters.depthSegments = 6

  const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.02,
    metalness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
  })

  desk = new THREE.Mesh(deskGeometry, deskMaterial)
  desk.position.set(0, 1.5, 0)
  desk.castShadow = true
  desk.receiveShadow = true
  scene.add(desk)

  // Invisible glass/acrylic legs (modern floating effect)
  const legGeometry = new THREE.BoxGeometry(0.12, 1.4, 0.12)
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    metalness: 0.9,
    roughness: 0.0,
    transmission: 0.9,
  })

  const positions = [
    [-3.4, 0.7, -1.4],
    [3.4, 0.7, -1.4],
    [-3.4, 0.7, 1.4],
    [3.4, 0.7, 1.4],
  ]

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(...pos)
    leg.castShadow = true
    scene.add(leg)
  })

  // RGB LED strip around entire desk perimeter
  const createLEDStrip = (geometry, position, rotation = [0, 0, 0]) => {
    const ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3d71,
      emissive: 0xff3d71,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    })

    const ledStrip = new THREE.Mesh(geometry, ledMaterial)
    ledStrip.position.set(...position)
    ledStrip.rotation.set(...rotation)
    scene.add(ledStrip)

    // RGB color cycling animation
    gsap
      .timeline({ repeat: -1 })
      .to(ledMaterial.emissive, { r: 0.2, g: 0.8, b: 1.0, duration: 2 })
      .to(ledMaterial.emissive, { r: 0.8, g: 0.2, b: 1.0, duration: 2 })
      .to(ledMaterial.emissive, { r: 1.0, g: 0.8, b: 0.2, duration: 2 })
      .to(ledMaterial.emissive, { r: 1.0, g: 0.2, b: 0.4, duration: 2 })

    return ledStrip
  }

  // Front LED strip
  createLEDStrip(new THREE.BoxGeometry(8.2, 0.03, 0.05), [0, 1.42, 2.05])

  // Back LED strip
  createLEDStrip(new THREE.BoxGeometry(8.2, 0.03, 0.05), [0, 1.42, -2.05])

  // Left LED strip
  createLEDStrip(new THREE.BoxGeometry(0.05, 0.03, 4.0), [-4.05, 1.42, 0])

  // Right LED strip
  createLEDStrip(new THREE.BoxGeometry(0.05, 0.03, 4.0), [4.05, 1.42, 0])

  // Underglow lighting (multiple strips for even distribution)
  for (let i = 0; i < 5; i++) {
    const underglowGeometry = new THREE.BoxGeometry(1.5, 0.02, 3.5)
    const underglowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.4,
    })

    const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial)
    underglow.position.set(-3 + i * 1.5, 1.35, 0)
    scene.add(underglow)

    // Gentle wave animation
    gsap.to(underglowMaterial, {
      emissiveIntensity: 1.0,
      duration: 1.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.3,
    })
  }

  // Modern wireless charging pad integrated into desk
  const chargingPadGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32)
  const chargingPadMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    emissive: 0x4fc3f7,
    emissiveIntensity: 0.2,
    metalness: 0.3,
    roughness: 0.1,
  })

  const chargingPad = new THREE.Mesh(chargingPadGeometry, chargingPadMaterial)
  chargingPad.position.set(2.5, 1.57, 1)
  chargingPad.castShadow = true
  scene.add(chargingPad)

  // Charging pad LED ring
  const ringGeometry = new THREE.TorusGeometry(0.35, 0.02, 8, 32)
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x4fc3f7,
    emissive: 0x4fc3f7,
    emissiveIntensity: 0.8,
  })

  const chargingRing = new THREE.Mesh(ringGeometry, ringMaterial)
  chargingRing.position.set(2.5, 1.58, 1)
  chargingRing.rotation.x = -Math.PI / 2
  scene.add(chargingRing)

  // Animate charging ring
  gsap.to(chargingRing.rotation, {
    z: Math.PI * 2,
    duration: 4,
    repeat: -1,
    ease: "none",
  })

  // Cable management system with RGB
  const cableChannelGeometry = new THREE.BoxGeometry(6, 0.15, 0.3)
  const cableChannelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: 0x8e24aa,
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2,
  })

  const cableChannel = new THREE.Mesh(cableChannelGeometry, cableChannelMaterial)
  cableChannel.position.set(0, 1.2, -1.7)
  cableChannel.castShadow = true
  scene.add(cableChannel)

  // Add premium touches
  createPremiumTouches()

  // Add desk accessories
  createDeskAccessories()
}

function createPremiumTouches() {
  // Holographic desk corners
  const cornerPositions = [
    [-3.9, 1.58, -1.9],
    [3.9, 1.58, -1.9],
    [-3.9, 1.58, 1.9],
    [3.9, 1.58, 1.9],
  ]

  cornerPositions.forEach((pos, index) => {
    const cornerGeometry = new THREE.ConeGeometry(0.08, 0.03, 8)
    const cornerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x64ffda,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
    })

    const corner = new THREE.Mesh(cornerGeometry, cornerMaterial)
    corner.position.set(...pos)
    scene.add(corner)

    // Pulse animation
    gsap.to(corner.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.4,
    })
  })
}

function createDeskAccessories() {
  // Laptop
  const laptopBase = new THREE.BoxGeometry(1.2, 0.05, 0.8)
  const laptopScreen = new THREE.BoxGeometry(1.2, 0.8, 0.05)
  const laptopMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.2,
  })

  const laptop1 = new THREE.Mesh(laptopBase, laptopMaterial)
  laptop1.position.set(-2, 1.65, 0)
  laptop1.castShadow = true
  scene.add(laptop1)

  const laptop2 = new THREE.Mesh(laptopScreen, laptopMaterial)
  laptop2.position.set(-2, 2.05, -0.35)
  laptop2.rotation.x = -Math.PI / 6
  laptop2.castShadow = true
  scene.add(laptop2)

  // Coffee mug
  const mugGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.25)
  const mugMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8,
  })
  const mug = new THREE.Mesh(mugGeometry, mugMaterial)
  mug.position.set(2.5, 1.75, 0.5)
  mug.castShadow = true
  scene.add(mug)

  // Keyboard
  const keyboardGeometry = new THREE.BoxGeometry(1.5, 0.08, 0.5)
  const keyboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.3,
    roughness: 0.7,
  })
  const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial)
  keyboard.position.set(0.5, 1.65, 1)
  keyboard.castShadow = true
  scene.add(keyboard)
}

function createHolographicScreens() {
  const screenData = [
    { pos: [-2, 3, -1], content: "code", title: "NestJS API" },
    { pos: [2, 3.5, -0.5], content: "terminal", title: "Docker & Git" },
    { pos: [0, 4, -2], content: "dashboard", title: "System Monitor" },
  ]

  screenData.forEach((data, index) => {
    const screenGroup = new THREE.Group()

    // Screen frame with realistic bezel
    const frameGeometry = new THREE.BoxGeometry(2.5, 1.8, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.2,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)

    // Screen content
    const screenGeometry = new THREE.PlaneGeometry(2.3, 1.6)
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 384
    const ctx = canvas.getContext("2d")

    drawScreenContent(ctx, data.content, data.title)

    const screenTexture = new THREE.CanvasTexture(canvas)
    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0x001122,
      emissiveIntensity: 0.2,
    })

    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.z = 0.06

    screenGroup.add(frame)
    screenGroup.add(screen)
    screenGroup.position.set(...data.pos)
    screenGroup.rotation.x = -0.1
    screenGroup.castShadow = true

    scene.add(screenGroup)
    holographicScreens.push(screenGroup)

    // Subtle animation
    gsap.to(screenGroup.rotation, {
      y: Math.sin(index) * 0.05,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
  })
}

function drawScreenContent(ctx, type, title) {
  // Clear canvas with realistic screen background
  ctx.fillStyle = "#0d1117"
  ctx.fillRect(0, 0, 512, 384)

  // Title bar
  ctx.fillStyle = "#21262d"
  ctx.fillRect(0, 0, 512, 40)

  ctx.fillStyle = "#58a6ff"
  ctx.font = '16px "Courier New", monospace'
  ctx.fillText(title, 10, 25)

  // Content based on type
  ctx.font = '12px "Courier New", monospace'

  if (type === "code") {
    const codeLines = [
      'import { Injectable } from "@nestjs/common";',
      'import { WebSocketGateway } from "@nestjs/websockets";',
      "",
      "@Injectable()",
      "export class JobScrapingService {",
      "  async scrapeJobs() {",
      "    const browser = await puppeteer.launch();",
      "    const page = await browser.newPage();",
      '    await page.goto("linkedin.com/jobs");',
      "    ",
      '    const jobs = await page.$$eval(".job-card",',
      "      cards => cards.map(card => ({",
      '        title: card.querySelector("h3").innerText,',
      '        company: card.querySelector(".company").innerText',
      "      })));",
      "    return jobs;",
      "  }",
      "}",
    ]

    codeLines.forEach((line, i) => {
      if (line.includes("import") || line.includes("export")) {
        ctx.fillStyle = "#ff7b72"
      } else if (line.includes("@")) {
        ctx.fillStyle = "#ffa657"
      } else if (line.includes("async") || line.includes("await")) {
        ctx.fillStyle = "#79c0ff"
      } else {
        ctx.fillStyle = "#e6edf3"
      }
      ctx.fillText(line, 10, 60 + i * 18)
    })
  } else if (type === "terminal") {
    ctx.fillStyle = "#7ce38b"
    const terminalLines = [
      "$ docker-compose up -d",
      'Creating network "jobscout_default"',
      "Creating postgres_db ... done",
      "Creating kafka_broker ... done",
      "",
      "$ git add .",
      '$ git commit -m "Add Puppeteer scraping"',
      "[main 7a8b9c2] Add Puppeteer scraping",
      " 3 files changed, 45 insertions(+)",
      "",
      "$ npm run start:dev",
      "[Nest] 12345 - NestJS application starting",
      "[Nest] 12345 - JobScrapingService initialized",
      "[Nest] 12345 - WebSocket server listening on 3001",
    ]

    terminalLines.forEach((line, i) => {
      if (line.startsWith("$")) {
        ctx.fillStyle = "#58a6ff"
      } else if (line.includes("done") || line.includes("starting")) {
        ctx.fillStyle = "#7ce38b"
      } else {
        ctx.fillStyle = "#e6edf3"
      }
      ctx.fillText(line, 10, 60 + i * 18)
    })
  } else if (type === "dashboard") {
    // Draw realistic dashboard
    ctx.fillStyle = "#58a6ff"
    ctx.fillRect(50, 80, 120, 25)
    ctx.fillStyle = "#7ce38b"
    ctx.fillRect(200, 100, 100, 25)
    ctx.fillStyle = "#ffa657"
    ctx.fillRect(320, 90, 80, 25)

    ctx.fillStyle = "#e6edf3"
    ctx.font = '14px "Courier New", monospace'
    ctx.fillText("TotTrust: Active Users 1.2k", 50, 200)
    ctx.fillText("Chatty: Messages/sec 450", 50, 220)
    ctx.fillText("JobScout: Jobs Scraped 15k", 50, 240)
    ctx.fillText("System Load: 67%", 50, 260)
  }
}

function createNeuralNetwork() {
  const networkGroup = new THREE.Group()

  // Larger nodes for better visibility
  const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const nodes = []
  const connections = []

  // Circular neural network - all neurons in one sphere
  const totalNeurons = 24
  const goldenRatio = (1 + Math.sqrt(5)) / 2

  for (let i = 0; i < totalNeurons; i++) {
    // Color based on position in the sphere
    const hue = (i / totalNeurons) * 0.8 // Rainbow gradient
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.3),
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.3,
    })

    const node = new THREE.Mesh(nodeGeometry, nodeMaterial)

    // Fibonacci sphere distribution for even spacing
    const y = 1 - (i / (totalNeurons - 1)) * 2 // Y from 1 to -1
    const radius = Math.sqrt(1 - y * y)
    const theta = goldenRatio * i * 2 * Math.PI

    const sphereRadius = 0.8
    node.position.set(
      Math.cos(theta) * radius * sphereRadius,
      y * sphereRadius,
      Math.sin(theta) * radius * sphereRadius,
    )

    networkGroup.add(node)
    nodes.push({ mesh: node, layer: 0, index: i })

    // Dynamic pulsing animation
    gsap.to(node.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 1 + Math.random() * 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: Math.random() * 2,
    })

    // Emissive intensity animation
    gsap.to(node.material, {
      emissiveIntensity: 0.8,
      duration: 1.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random(),
    })
  }

  // Create connections between nearby neurons
  nodes.forEach((nodeA, indexA) => {
    nodes.forEach((nodeB, indexB) => {
      if (indexA < indexB) {
        // Avoid duplicate connections
        const distance = nodeA.mesh.position.distanceTo(nodeB.mesh.position)

        // Only connect nearby neurons (within a certain distance)
        if (distance < 1.2) {
          const points = [nodeA.mesh.position, nodeB.mesh.position]

          const geometry = new THREE.BufferGeometry().setFromPoints(points)

          // Connection opacity based on distance (closer = stronger)
          const baseOpacity = Math.max(0.1, 0.8 - distance * 0.4)

          const material = new THREE.LineBasicMaterial({
            color: 0x00ccff,
            transparent: true,
            opacity: baseOpacity,
          })

          const line = new THREE.Line(geometry, material)
          networkGroup.add(line)
          connections.push({ line, material, baseOpacity })

          // Animated data flow through connections
          gsap.to(material, {
            opacity: baseOpacity + 0.3,
            duration: 0.8 + Math.random() * 1.2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: Math.random() * 3,
          })
        }
      }
    })
  })

  // Better scaling for visibility
  networkGroup.scale.set(0.7, 0.7, 0.7)
  networkGroup.position.set(2, 3, 1)
  scene.add(networkGroup)
  neuralNetwork = networkGroup

  // Complex 3D rotation
  gsap.to(networkGroup.rotation, {
    x: Math.PI * 2,
    y: Math.PI * 2 * 1.5, // Different speed for more dynamic rotation
    z: Math.PI * 0.5,
    duration: 25,
    repeat: -1,
    ease: "none",
  })

  // Gentle orbital motion
  gsap.to(networkGroup.position, {
    y: 3.3,
    x: 2.2,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  })
}

// GOD-LEVEL COMPONENTS START HERE

function createQuantumField() {
  const quantumGroup = new THREE.Group()

  // Create quantum particles
  const particleCount = 200
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    // Quantum field distribution
    positions[i * 3] = (Math.random() - 0.5) * 40
    positions[i * 3 + 1] = Math.random() * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40

    // Quantum colors (blue to purple spectrum)
    const hue = 0.6 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 1.0, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 0.3 + 0.1
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

  const quantumMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Quantum fluctuation
        mvPosition.xyz += sin(time * 2.0 + position.x * 0.01) * 0.1;
        
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        
        // Quantum glow effect
        alpha *= sin(time * 3.0) * 0.3 + 0.7;
        
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  const quantumParticles = new THREE.Points(particles, quantumMaterial)
  quantumGroup.add(quantumParticles)

  scene.add(quantumGroup)
  quantumField = quantumGroup

  // Animate quantum field
  gsap.to(quantumGroup.rotation, {
    y: Math.PI * 2,
    duration: 60,
    repeat: -1,
    ease: "none",
  })
}

function createHologramProjector() {
  const projectorGroup = new THREE.Group()

  // Projector base
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x0066ff,
    emissiveIntensity: 0.2,
  })

  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.set(-5, 1.7, 2)
  projectorGroup.add(base)

  // Hologram projection cone
  const coneGeometry = new THREE.ConeGeometry(1.5, 3, 8, 1, true)
  const coneMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })

  const cone = new THREE.Mesh(coneGeometry, coneMaterial)
  cone.position.set(-5, 3.2, 2)
  cone.rotation.x = Math.PI
  projectorGroup.add(cone)

  // Floating holographic elements
  for (let i = 0; i < 10; i++) {
    const elementGeometry = new THREE.OctahedronGeometry(0.1)
    const elementMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
    })

    const element = new THREE.Mesh(elementGeometry, elementMaterial)
    element.position.set(-5 + (Math.random() - 0.5) * 2, 2.5 + Math.random() * 2, 2 + (Math.random() - 0.5) * 2)

    projectorGroup.add(element)

    // Floating animation
    gsap.to(element.position, {
      y: element.position.y + 0.5,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    gsap.to(element.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      ease: "none",
    })
  }

  scene.add(projectorGroup)
  hologramProjector = projectorGroup

  // Animate projector cone
  gsap.to(cone.material, {
    opacity: 0.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  })
}

function createAIAssistant() {
  const assistantGroup = new THREE.Group()

  // AI Core sphere
  const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32)
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x4444ff,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
  })

  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.position.set(5, 4, 2)
  assistantGroup.add(core)

  // Orbiting data rings
  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(0.5 + i * 0.2, 0.02, 8, 32)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
    })

    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.copy(core.position)
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.y = Math.random() * Math.PI
    assistantGroup.add(ring)

    // Orbit animation
    gsap.to(ring.rotation, {
      z: Math.PI * 2,
      duration: 3 + i,
      repeat: -1,
      ease: "none",
    })
  }

  // Data streams
  for (let i = 0; i < 20; i++) {
    const streamGeometry = new THREE.SphereGeometry(0.02, 8, 8)
    const streamMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.8,
    })

    const stream = new THREE.Mesh(streamGeometry, streamMaterial)
    const angle = (i / 20) * Math.PI * 2
    const radius = 1.5

    stream.position.set(
      core.position.x + Math.cos(angle) * radius,
      core.position.y,
      core.position.z + Math.sin(angle) * radius,
    )

    assistantGroup.add(stream)

    // Stream animation towards core
    gsap.to(stream.position, {
      x: core.position.x,
      y: core.position.y,
      z: core.position.z,
      duration: 2,
      repeat: -1,
      ease: "power2.in",
      delay: i * 0.1,
      onComplete: () => {
        stream.position.set(
          core.position.x + Math.cos(angle) * radius,
          core.position.y,
          core.position.z + Math.sin(angle) * radius,
        )
      },
    })
  }

  scene.add(assistantGroup)
  aiAssistant = assistantGroup

  // Core pulsing
  gsap.to(core.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  })
}

function createMatrixRain() {
  const matrixGroup = new THREE.Group()

  // Create Matrix-style falling 0s and 1s with reduced intensity
  const characters = ["0", "1"]
  const columns = 15 // Reduced from 30
  const rows = 12 // Reduced from 20

  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")

      // Random character
      const char = characters[Math.floor(Math.random() * characters.length)]

      // Transparent background (no black box)
      ctx.clearRect(0, 0, 32, 32)

      // Green matrix style with glow effect
      ctx.fillStyle = "#00ff41"
      ctx.font = "bold 18px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Add subtle glow
      ctx.shadowColor = "#00ff41"
      ctx.shadowBlur = 8
      ctx.fillText(char, 16, 16)

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.4, // Reduced opacity
        blending: THREE.AdditiveBlending, // Makes it glow nicely
      })

      const geometry = new THREE.PlaneGeometry(0.25, 0.25) // Slightly smaller
      const charPlane = new THREE.Mesh(geometry, material)

      charPlane.position.set(
        (col - columns / 2) * 0.6, // More spread out
        15 - row * 0.6,
        (Math.random() - 0.5) * 25, // Less depth variation
      )

      matrixGroup.add(charPlane)

      // Slower falling animation with more variation
      gsap.to(charPlane.position, {
        y: -8,
        duration: 8 + Math.random() * 6, // Slower fall
        repeat: -1,
        ease: "none",
        delay: Math.random() * 8, // More staggered start times
        onComplete: () => {
          charPlane.position.y = 15
        },
      })

      // Gentler opacity flicker
      gsap.to(material, {
        opacity: 0.1 + Math.random() * 0.3, // Subtler opacity range
        duration: 1 + Math.random() * 2, // Slower flicker
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
  }

  scene.add(matrixGroup)
  matrixRain = matrixGroup
}

function createEnvironmentEffects() {
  // Volumetric lighting
  const volumetricGroup = new THREE.Group()

  for (let i = 0; i < 5; i++) {
    const lightBeamGeometry = new THREE.ConeGeometry(0.1, 8, 8, 1, true)
    const lightBeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    })

    const lightBeam = new THREE.Mesh(lightBeamGeometry, lightBeamMaterial)
    lightBeam.position.set((Math.random() - 0.5) * 20, 10, (Math.random() - 0.5) * 20)
    lightBeam.rotation.x = Math.PI

    volumetricGroup.add(lightBeam)

    // Animate light beams
    gsap.to(lightBeam.material, {
      opacity: 0.1,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }

  scene.add(volumetricGroup)
  environmentEffects.push(volumetricGroup)
}

function createFloatingCodeMatrix() {
  const matrixGroup = new THREE.Group()

  // Create floating code snippets
  const codeSnippets = [
    "const ai = new NeuralNetwork()",
    "async function process()",
    "import { quantum } from 'future'",
    "class HolographicUI extends React.Component",
    "SELECT * FROM reality WHERE dimension = '3D'",
  ]

  codeSnippets.forEach((code, index) => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 64
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(0, 0, 512, 64)

    ctx.fillStyle = "#00ff00"
    ctx.font = "16px monospace"
    ctx.fillText(code, 10, 35)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.7,
    })

    const geometry = new THREE.PlaneGeometry(2, 0.25)
    const codePlane = new THREE.Mesh(geometry, material)

    codePlane.position.set((Math.random() - 0.5) * 15, 2 + Math.random() * 6, (Math.random() - 0.5) * 15)

    matrixGroup.add(codePlane)

    // Floating animation
    gsap.to(codePlane.position, {
      y: codePlane.position.y + 1,
      duration: 4 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    gsap.to(codePlane.rotation, {
      y: Math.PI * 2,
      duration: 10 + Math.random() * 5,
      repeat: -1,
      ease: "none",
    })
  })

  scene.add(matrixGroup)
}

function createEnergyBeams() {
  const beamGroup = new THREE.Group()

  // Create energy beams connecting different elements
  const connections = [
    { from: [2, 3, 1], to: [-2, 3, -1] }, // Neural network to screen
    { from: [5, 4, 2], to: [2, 3, 1] }, // AI assistant to neural network
    { from: [-5, 3.2, 2], to: [0, 2, 0] }, // Hologram projector to desk
  ]

  connections.forEach((connection, index) => {
    const points = [new THREE.Vector3(...connection.from), new THREE.Vector3(...connection.to)]

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
    })

    const beam = new THREE.Line(geometry, material)
    beamGroup.add(beam)

    // Animate beam intensity
    gsap.to(material, {
      opacity: 0.8,
      duration: 1 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.5,
    })
  })

  scene.add(beamGroup)
}

function createPortalEffects() {
  const portalGroup = new THREE.Group()

  // Create dimensional portal
  const portalGeometry = new THREE.RingGeometry(0.5, 1, 32)
  const portalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec2 center = vec2(0.5);
        float dist = distance(vUv, center);
        
        float wave = sin(dist * 20.0 - time * 5.0) * 0.5 + 0.5;
        vec3 color = mix(vec3(1.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), wave);
        
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const portal = new THREE.Mesh(portalGeometry, portalMaterial)
  portal.position.set(-8, 5, -5)
  portal.rotation.y = Math.PI / 4

  portalGroup.add(portal)
  scene.add(portalGroup)

  // Animate portal
  gsap.to(portal.rotation, {
    z: Math.PI * 2,
    duration: 8,
    repeat: -1,
    ease: "none",
  })
}

function initializeAudioReactivity() {
  // Initialize Web Audio API
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.fftSize = 256
    audioData = new Uint8Array(audioAnalyser.frequencyBinCount)

    // Request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(audioAnalyser)
        isAudioEnabled = true
      })
      .catch((err) => {
        console.log("Audio not available:", err)
      })
  } catch (err) {
    console.log("Web Audio API not supported:", err)
  }
}

function updateAudioReactivity() {
  if (!isAudioEnabled || !audioAnalyser) return

  audioAnalyser.getByteFrequencyData(audioData)

  // Get average audio level
  const average = audioData.reduce((a, b) => a + b) / audioData.length
  const normalizedLevel = average / 255

  // React neural network to audio
  if (neuralNetwork) {
    const scale = 0.7 + normalizedLevel * 0.3
    neuralNetwork.scale.setScalar(scale)
  }

  // React quantum field to audio
  if (quantumField && quantumField.children[0].material.uniforms) {
    quantumField.children[0].material.uniforms.time.value += normalizedLevel * 0.1
  }

  // React desk LEDs to audio
  const deskLEDs = scene.children.filter((child) => child.material && child.material.emissive)

  deskLEDs.forEach((led) => {
    if (led.material.emissive) {
      led.material.emissiveIntensity = 0.5 + normalizedLevel * 0.5
    }
  })
}

// Continue with existing functions...
function createProjectGallery() {
  // Create project frames on the wall
  projectsData.forEach((project, index) => {
    const frameGroup = new THREE.Group()

    // Frame
    const frameGeometry = new THREE.BoxGeometry(2.2, 1.5, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.8,
      roughness: 0.2,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)

    // Project preview
    const imageGeometry = new THREE.PlaneGeometry(2, 1.3)
    const imageCanvas = createProjectImageCanvas(project)
    const imageTexture = new THREE.CanvasTexture(imageCanvas)
    const imageMaterial = new THREE.MeshStandardMaterial({
      map: imageTexture,
    })
    const imagePanel = new THREE.Mesh(imageGeometry, imageMaterial)
    imagePanel.position.z = 0.06

    frameGroup.add(frame)
    frameGroup.add(imagePanel)

    // Position on back wall
    frameGroup.position.set((index - 1) * 3, 4, -14.8)

    frameGroup.castShadow = true
    scene.add(frameGroup)
    projectGallery.push(frameGroup)
  })
}

function createProjectImageCanvas(project) {
  const canvas = document.createElement("canvas")
  canvas.width = 400
  canvas.height = 260
  const ctx = canvas.getContext("2d")

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 400, 260)
  gradient.addColorStop(0, project.color + "40")
  gradient.addColorStop(1, "#1a1a2e80")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 400, 260)

  // Title
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 24px Arial"
  ctx.textAlign = "center"
  ctx.fillText(project.title, 200, 50)

  // Tech stack
  ctx.fillStyle = project.color
  ctx.font = "16px Arial"
  ctx.fillText(project.tech, 200, 80)

  // Description
  ctx.fillStyle = "#cccccc"
  ctx.font = "14px Arial"
  const words = project.description.split(" ")
  let line = ""
  let y = 120

  words.forEach((word) => {
    const testLine = line + word + " "
    const metrics = ctx.measureText(testLine)

    if (metrics.width > 350 && line !== "") {
      ctx.fillText(line, 200, y)
      line = word + " "
      y += 20
    } else {
      line = testLine
    }
  })
  ctx.fillText(line, 200, y)

  return canvas
}

function createFlyingSkillCards() {
  skillsData.forEach((skill, index) => {
    const cardGroup = new THREE.Group()

    // Card geometry
    const cardGeometry = new THREE.PlaneGeometry(1, 0.6)
    const cardCanvas = createSkillCardCanvas(skill)
    const cardTexture = new THREE.CanvasTexture(cardCanvas)
    const cardMaterial = new THREE.MeshStandardMaterial({
      map: cardTexture,
      transparent: true,
      opacity: 0.9,
    })
    const card = new THREE.Mesh(cardGeometry, cardMaterial)

    // Glowing border
    const borderGeometry = new THREE.PlaneGeometry(1.1, 0.7)
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(skill.color),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    })
    const border = new THREE.Mesh(borderGeometry, borderMaterial)
    border.position.z = -0.01

    cardGroup.add(border)
    cardGroup.add(card)

    // Random flying position
    const radius = 8 + Math.random() * 5
    const angle = (index / skillsData.length) * Math.PI * 2
    const height = 3 + Math.random() * 4

    cardGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius)
    cardGroup.rotation.set((Math.random() - 0.5) * 0.5, angle + Math.PI / 2, (Math.random() - 0.5) * 0.3)

    // Store original position for reset
    cardGroup.userData = {
      originalPosition: cardGroup.position.clone(),
      originalRotation: cardGroup.rotation.clone(),
    }

    scene.add(cardGroup)
    skillCards.push({ group: cardGroup, skill: skill })

    // Flying animation
    gsap.to(cardGroup.position, {
      y: height + 0.5,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    gsap.to(cardGroup.rotation, {
      z: cardGroup.rotation.z + 0.2,
      duration: 4 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    // Pulsing glow
    gsap.to(border.material, {
      opacity: 0.6,
      duration: 1.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
  })
}

function createSkillCardCanvas(skill) {
  const canvas = document.createElement("canvas")
  canvas.width = 200
  canvas.height = 120
  const ctx = canvas.getContext("2d")

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 200, 120)
  gradient.addColorStop(0, "rgba(26, 26, 46, 0.9)")
  gradient.addColorStop(1, skill.color + "40")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 200, 120)

  // Border
  ctx.strokeStyle = skill.color
  ctx.lineWidth = 2
  ctx.strokeRect(5, 5, 190, 110)

  // Skill name - centered and larger
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 20px Arial"
  ctx.textAlign = "center"
  ctx.fillText(skill.name, 100, 70)

  return canvas
}

function createRealisticLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)

  // Main directional light (window light)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -20
  directionalLight.shadow.camera.right = 20
  directionalLight.shadow.camera.top = 20
  directionalLight.shadow.camera.bottom = -20
  scene.add(directionalLight)

  // Desk lamp
  const deskLamp = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 6, 0.5)
  deskLamp.position.set(-1, 4, 1)
  deskLamp.target.position.set(0, 1.6, 0)
  deskLamp.castShadow = true
  scene.add(deskLamp)
  scene.add(deskLamp.target)

  // Screen backlighting
  holographicScreens.forEach((screen) => {
    const backlight = new THREE.PointLight(0x0088ff, 0.5, 5)
    backlight.position.copy(screen.position)
    backlight.position.z += 0.5
    scene.add(backlight)
  })

  // Neural network lighting
  const neuralLight = new THREE.PointLight(0x00ffff, 0.8, 8)
  neuralLight.position.set(2, 3, 1)
  scene.add(neuralLight)

  // Dynamic color-changing lights
  const dynamicLights = []
  for (let i = 0; i < 8; i++) {
    const light = new THREE.PointLight(0xff0080, 0.5, 12)
    light.position.set((Math.random() - 0.5) * 25, 5 + Math.random() * 5, (Math.random() - 0.5) * 25)
    scene.add(light)
    dynamicLights.push(light)

    // Color cycling animation
    gsap
      .timeline({ repeat: -1 })
      .to(light.color, { r: 0.2, g: 0.8, b: 1.0, duration: 3 })
      .to(light.color, { r: 1.0, g: 0.2, b: 0.8, duration: 3 })
      .to(light.color, { r: 0.8, g: 1.0, b: 0.2, duration: 3 })
  }
}

function createParticles() {
  const particleCount = 300 // Increased for god-level
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = Math.random() * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50

    // Enhanced particle colors
    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // Add velocities for movement
    velocities[i * 3] = (Math.random() - 0.5) * 0.02
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.08, // Slightly larger
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  })

  const particleSystem = new THREE.Points(particles, particleMaterial)
  scene.add(particleSystem)

  // Enhanced particle animation
  gsap.to(particleSystem.rotation, {
    y: Math.PI * 2,
    duration: 80,
    repeat: -1,
    ease: "none",
  })
}

// Navigation and interaction functions
function animateProjectsToUser() {
  if (isViewingProjects) return

  isViewingProjects = true
  currentCardIndex = 0

  // Animate project cards to user - center the middle card
  projectGallery.forEach((frame, index) => {
    const targetPos = {
      x: (index - 1) * 3, // Keep horizontal spacing
      y: 2,
      z: 4, // Bring closer to user
    }

    gsap.to(frame.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.5,
      delay: index * 0.2,
      ease: "power2.out",
    })

    gsap.to(frame.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      delay: index * 0.2,
      ease: "power2.out",
    })

    // Scale the middle card (index 1) to be larger
    const scale = index === 1 ? 1.3 : 1
    gsap.to(frame.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 1.5,
      delay: index * 0.2,
      ease: "power2.out",
    })
  })

  // Show navigation controls
  setTimeout(() => {
    showProjectNavigation()
  }, 2000)
}

function animateSkillsToUser() {
  if (isViewingSkills) return

  isViewingSkills = true
  currentCardIndex = Math.floor(skillCards.length / 2) // Start with middle card

  // Kill all existing animations for skill cards
  skillCards.forEach((cardData) => {
    gsap.killTweensOf(cardData.group.position)
    gsap.killTweensOf(cardData.group.rotation)
  })

  // Animate skill cards to user with proper timing
  skillCards.forEach((cardData, index) => {
    const distance = Math.abs(index - currentCardIndex)

    let targetPos, targetScale, targetOpacity

    if (distance === 0) {
      // Center card
      targetPos = { x: 0, y: 2.5, z: 5 }
      targetScale = 1.5
      targetOpacity = 1
    } else if (distance === 1) {
      // Adjacent cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 2.5, y: 2, z: 3 }
      targetScale = 1
      targetOpacity = 0.8
    } else if (distance === 2) {
      // Second adjacent cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 4.5, y: 1.5, z: 1 }
      targetScale = 0.8
      targetOpacity = 0.6
    } else {
      // Hidden cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 8, y: 1, z: -2 }
      targetScale = 0.5
      targetOpacity = 0.3
    }

    gsap.to(cardData.group.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2, // Increased duration
      delay: distance * 0.1,
      ease: "power2.out",
    })

    gsap.to(cardData.group.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      delay: distance * 0.1,
      ease: "power2.out",
    })

    gsap.to(cardData.group.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 2,
      delay: distance * 0.1,
      ease: "power2.out",
    })

    // Animate opacity for both card and border
    gsap.to(cardData.group.children[0].material, {
      opacity: targetOpacity * 0.3,
      duration: 2,
      delay: distance * 0.1,
    })
    gsap.to(cardData.group.children[1].material, {
      opacity: targetOpacity,
      duration: 2,
      delay: distance * 0.1,
    })
  })

  // Show navigation controls after animation completes
  setTimeout(() => {
    showSkillNavigation()
  }, 3000)
}

function showProjectNavigation() {
  const navDiv = document.createElement("div")
  navDiv.id = "project-nav"
  navDiv.className = "nav-overlay"

  navDiv.innerHTML = `
    <button class="nav-btn" onclick="scrollProjects(-1)">← Previous</button>
    <button class="nav-btn close" onclick="resetProjectView()">✕ Close</button>
    <button class="nav-btn" onclick="scrollProjects(1)">Next →</button>
  `

  document.body.appendChild(navDiv)
}

function showSkillNavigation() {
  const navDiv = document.createElement("div")
  navDiv.id = "skill-nav"
  navDiv.className = "nav-overlay"

  navDiv.innerHTML = `
    <button class="nav-btn" onclick="scrollSkills(-1)">← Previous</button>
    <button class="nav-btn close" onclick="resetSkillView()">✕ Close</button>
    <button class="nav-btn" onclick="scrollSkills(1)">Next →</button>
  `

  document.body.appendChild(navDiv)
}

function scrollProjects(direction) {
  currentCardIndex += direction
  if (currentCardIndex < 0) currentCardIndex = projectGallery.length - 1
  if (currentCardIndex >= projectGallery.length) currentCardIndex = 0

  // Focus on current project - bring to center
  projectGallery.forEach((frame, index) => {
    const isActive = index === currentCardIndex
    const offset = index - currentCardIndex

    gsap.to(frame.position, {
      x: offset * 3,
      z: isActive ? 5 : 4,
      duration: 0.8,
      ease: "power2.out",
    })
    gsap.to(frame.scale, {
      x: isActive ? 1.3 : 1,
      y: isActive ? 1.3 : 1,
      z: isActive ? 1.3 : 1,
      duration: 0.8,
      ease: "power2.out",
    })
  })
}

function scrollSkills(direction) {
  currentCardIndex += direction
  if (currentCardIndex < 0) currentCardIndex = skillCards.length - 1
  if (currentCardIndex >= skillCards.length) currentCardIndex = 0

  // Rearrange skills with new center
  skillCards.forEach((cardData, index) => {
    const distance = Math.abs(index - currentCardIndex)

    let targetPos, targetScale, targetOpacity

    if (distance === 0) {
      // Center card
      targetPos = { x: 0, y: 2.5, z: 5 }
      targetScale = 1.5
      targetOpacity = 1
    } else if (distance === 1) {
      // Adjacent cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 2.5, y: 2, z: 3 }
      targetScale = 1
      targetOpacity = 0.8
    } else if (distance === 2) {
      // Second adjacent cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 4.5, y: 1.5, z: 1 }
      targetScale = 0.8
      targetOpacity = 0.6
    } else {
      // Hidden cards
      const side = index < currentCardIndex ? -1 : 1
      targetPos = { x: side * 8, y: 1, z: -2 }
      targetScale = 0.5
      targetOpacity = 0.3
    }

    gsap.to(cardData.group.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 0.8,
      ease: "power2.out",
    })

    gsap.to(cardData.group.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.8,
      ease: "power2.out",
    })

    // Animate opacity
    gsap.to(cardData.group.children[0].material, {
      opacity: targetOpacity * 0.3,
      duration: 0.8,
    })
    gsap.to(cardData.group.children[1].material, {
      opacity: targetOpacity,
      duration: 0.8,
    })
  })
}

function resetProjectView() {
  isViewingProjects = false

  // Remove navigation
  const nav = document.getElementById("project-nav")
  if (nav) nav.remove()

  // Return projects to original positions
  projectGallery.forEach((frame, index) => {
    gsap.to(frame.position, {
      x: (index - 1) * 3,
      y: 4,
      z: -14.8,
      duration: 1.5,
      ease: "power2.out",
    })
    gsap.to(frame.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
    })
  })
}

function resetSkillView() {
  isViewingSkills = false

  // Remove navigation
  const nav = document.getElementById("skill-nav")
  if (nav) nav.remove()

  // Return skills to flying positions
  skillCards.forEach((cardData, index) => {
    gsap.to(cardData.group.position, {
      x: cardData.group.userData.originalPosition.x,
      y: cardData.group.userData.originalPosition.y,
      z: cardData.group.userData.originalPosition.z,
      duration: 1.5,
      ease: "power2.out",
    })

    gsap.to(cardData.group.rotation, {
      x: cardData.group.userData.originalRotation.x,
      y: cardData.group.userData.originalRotation.y,
      z: cardData.group.userData.originalRotation.z,
      duration: 1.5,
    })

    gsap.to(cardData.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
    })

    // Reset opacity
    gsap.to(cardData.group.children[0].material, {
      opacity: 0.3,
      duration: 1.5,
    })
    gsap.to(cardData.group.children[1].material, {
      opacity: 0.9,
      duration: 1.5,
    })

    // Restart flying animations
    setTimeout(() => {
      const height = cardData.group.userData.originalPosition.y
      gsap.to(cardData.group.position, {
        y: height + 0.5,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      gsap.to(cardData.group.rotation, {
        z: cardData.group.rotation.z + 0.2,
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }, 1500)
  })
}

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  if (isAnimationPlaying) {
    // Animate holographic screens
    holographicScreens.forEach((screen, index) => {
      screen.rotation.y += Math.sin(Date.now() * 0.001 + index) * 0.0005
    })

    // Animate neural network
    if (neuralNetwork) {
      neuralNetwork.position.y = 3 + Math.sin(Date.now() * 0.002) * 0.05
    }

    // Update quantum field shader
    if (quantumField && quantumField.children[0].material.uniforms) {
      quantumField.children[0].material.uniforms.time.value = clock.elapsedTime
    }

    // Update portal shader
    const portals = scene.children.filter(
      (child) =>
        child.children && child.children[0] && child.children[0].material && child.children[0].material.uniforms,
    )
    portals.forEach((portal) => {
      if (portal.children[0].material.uniforms.time) {
        portal.children[0].material.uniforms.time.value = clock.elapsedTime
      }
    })
  }

  renderer.render(scene, camera)
}

// Update the global functions
if (typeof window !== "undefined") {
  window.resetCamera = () => {
    targetRotationX = 0
    targetRotationY = 0
    currentDistance = 8

    gsap.to(camera.position, {
      x: 4,
      y: 3,
      z: 8,
      duration: 1.5,
      ease: "power2.inOut",
    })
  }

  window.toggleAnimation = () => {
    isAnimationPlaying = !isAnimationPlaying
  }

  window.viewProjects = () => {
    animateProjectsToUser()
  }

  window.viewSkills = () => {
    animateSkillsToUser()
  }

  // Add new scroll functions
  window.scrollProjects = (direction) => {
    scrollProjects(direction)
  }

  window.scrollSkills = (direction) => {
    scrollSkills(direction)
  }

  window.resetProjectView = () => {
    resetProjectView()
  }

  window.resetSkillView = () => {
    resetSkillView()
  }

  // GOD-LEVEL: Add new control functions
  window.toggleAudio = () => {
    isAudioEnabled = !isAudioEnabled
    if (isAudioEnabled && audioContext.state === "suspended") {
      audioContext.resume()
    }
  }

  window.activateGodMode = () => {
    // Enhance all effects
    scene.children.forEach((child) => {
      if (child.material && child.material.emissive) {
        gsap.to(child.material, {
          emissiveIntensity: 2.0,
          duration: 0.5,
        })
      }
    })

    // Add screen shake effect
    gsap.to(camera.position, {
      x: camera.position.x + 0.1,
      duration: 0.1,
      repeat: 10,
      yoyo: true,
      ease: "power2.inOut",
    })
  }
}

// Handle window resize
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Initialize the application
  init()
}
