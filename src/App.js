import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer, Text, Html } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
// import { useControls } from 'leva'

extend({ MeshLineGeometry, MeshLineMaterial })

const publicAsset = (path) => `${process.env.PUBLIC_URL || ''}${path}`
const qmarkLogoUrl = publicAsset('/MockQmarkLogo.png')
const qwordLogoUrl = publicAsset('/MockQwordLogo.png')

useGLTF.preload(
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb'
)
useTexture.preload(qmarkLogoUrl)

export default function App() {
  // const { debug } = useControls({ debug: false })
  const [email, setEmail] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isCompactLayout = viewportWidth <= 1024
  const layoutWidth = isCompactLayout ? 'min(92vw, 560px)' : '592px'
  const inputWidth = isCompactLayout ? '100%' : '470px'
  const compactTop = viewportWidth <= 640 ? 'calc(78% - 100px)' : 'calc(74% - 100px)'
  const htmlProps = isCompactLayout
    ? { fullscreen: true, style: { pointerEvents: 'none' } }
    : { position: [-3.45, 0.35, 0], transform: false, center: false }
  const panelStyle = isCompactLayout
    ? {
        color: 'white',
        fontFamily: 'Roboto, sans-serif',
        position: 'absolute',
        left: '50%',
        top: compactTop,
        transform: 'translateX(-50%)',
        width: layoutWidth,
        textAlign: 'center',
        pointerEvents: 'auto'
      }
    : {
        color: 'white',
        fontFamily: 'Roboto, sans-serif',
        transform: 'translateX(-150px)',
        width: layoutWidth,
        textAlign: 'left',
        pointerEvents: 'auto'
      }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setSubmitStatus('error')
      setSubmitMessage('Please enter your email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmitStatus('error')
      setSubmitMessage('Please enter a valid email address.')
      return
    }

    setSubmitStatus('loading')
    setSubmitMessage('')

    let timeout
    try {
      const controller = new AbortController()
      timeout = setTimeout(() => controller.abort(), 12000)
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
        signal: controller.signal
      })

      const raw = await response.text()
      let data = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        data = {}
      }
      if (!response.ok) {
        const isHtml = raw.trim().startsWith('<!DOCTYPE') || raw.trim().startsWith('<html')
        throw new Error(data?.error || (isHtml ? 'API endpoint is not reachable.' : 'Unable to submit email.'))
      }

      setSubmitStatus('success')
      setSubmitMessage('You are on the waitlist.')
      setEmail('')
    } catch (error) {
      setSubmitStatus('error')
      if (error.name === 'AbortError') {
        setSubmitMessage('Request timed out. Please try again.')
      } else {
        setSubmitMessage(error.message || 'Unable to submit email.')
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', touchAction: 'none' }}
    >
      <ambientLight intensity={Math.PI} />
      <Html {...htmlProps}>
        <div style={panelStyle}>
          <div
            style={{
              fontSize: isCompactLayout ? '44px' : '68px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              whiteSpace: isCompactLayout ? 'normal' : 'nowrap'
            }}
          >
            Join the waitlist.
          </div>
          <div
            style={{
              marginTop: '10px',
              marginLeft: isCompactLayout ? '0' : '3px',
              fontSize: isCompactLayout ? '19px' : '22px',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#b8b8b8'
            }}
          >
            Your one-stop AI interview prep shop.
          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: isCompactLayout ? '36px' : '68px', width: layoutWidth }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: isCompactLayout ? 'center' : 'flex-start' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email: example@gmail.com"
                style={{
                  width: inputWidth,
                  height: '54px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.22)',
                  background: 'linear-gradient(145deg, #050505 0%, #111111 100%)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 18px rgba(255,255,255,0.16)',
                  color: '#e7e7e7',
                  padding: '0 16px',
                  fontSize: '16px',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                style={{
                  height: '54px',
                  width: '140px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.22)',
                  background: 'linear-gradient(145deg, #0a0a0a 0%, #171717 100%)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 16px rgba(255,255,255,0.14)',
                  color: '#f0f0f0',
                  cursor: submitStatus === 'loading' ? 'default' : 'pointer',
                  fontSize: '15px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600
                }}
              >
                {submitStatus === 'loading' ? 'Submitting...' : 'Join'}
              </button>
            </div>
            {submitMessage ? (
              <div
                style={{
                  marginTop: '10px',
                  marginLeft: isCompactLayout ? '0' : '4px',
                  color: submitStatus === 'success' ? '#8ee29f' : '#ff9e9e',
                  fontSize: '14px'
                }}
              >
                {submitMessage}
              </div>
            ) : null}
          </form>
        </div>
      </Html>

      <Physics debug={false} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>

      <Environment background={false} blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef()
  const fixedAnchor = useRef(),
    j1Anchor = useRef(),
    j2Anchor = useRef(),
    j3Anchor = useRef()

  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3(),
    worldP0 = new THREE.Vector3(),
    worldP1 = new THREE.Vector3(),
    worldP2 = new THREE.Vector3(),
    worldP3 = new THREE.Vector3()

  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }

  const { nodes, materials } = useGLTF(
    'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb'
  )
  const qmarkBandLogo = useTexture(qmarkLogoUrl)
  const qwordLogo = useTexture(qwordLogoUrl)
  qwordLogo.anisotropy = 16

  const texture = useMemo(() => {
    const logoImage = qmarkBandLogo.image
    if (!logoImage) return qmarkBandLogo

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return qmarkBandLogo

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#2b2b2b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const logoH = canvas.height * 0.58
    const logoW = logoH * (logoImage.width / logoImage.height)
    const logoY = (canvas.height - logoH) * 0.5
    const xOffsets = [0.18, 0.5, 0.82]
    for (const x of xOffsets) {
      const logoX = canvas.width * x - logoW * 0.5
      ctx.drawImage(logoImage, logoX, logoY, logoW, logoH)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.anisotropy = 16
    return tex
  }, [qmarkBandLogo])

  const { width, height, camera } = useThree((state) => ({
    width: state.size.width,
    height: state.size.height,
    camera: state.camera
  }))
  const isCompactLayout = width <= 1024
  const baseShiftX = isCompactLayout ? 0 : 0.75
  const pixelShiftX = isCompactLayout ? 0 : 100
  const worldShiftX =
    camera?.isPerspectiveCamera && height
      ? pixelShiftX * ((2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(camera.position.z)) / height)
      : 0
  const SHIFT_X = baseShiftX + worldShiftX
  const SHIFT_Y = isCompactLayout ? 1.35 : 0
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }

    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      if (band.current?.parent && fixedAnchor.current && j1Anchor.current && j2Anchor.current && j3Anchor.current) {
        const parent = band.current.parent
        j3Anchor.current.getWorldPosition(worldP0)
        j2Anchor.current.getWorldPosition(worldP1)
        j1Anchor.current.getWorldPosition(worldP2)
        fixedAnchor.current.getWorldPosition(worldP3)

        curve.points[0].copy(parent.worldToLocal(worldP0))
        curve.points[1].copy(parent.worldToLocal(worldP1))
        curve.points[2].copy(parent.worldToLocal(worldP2))
        curve.points[3].copy(parent.worldToLocal(worldP3))
      } else {
        curve.points[0].copy(j3.current.translation())
        curve.points[1].copy(j2.current.lerped)
        curve.points[2].copy(j1.current.lerped)
        curve.points[3].copy(fixed.current.translation())
      }
      band.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return (
    <>
      <group position={[SHIFT_X, SHIFT_Y, 0]}>
        <group position={[0, 4, 0]}>
          <RigidBody ref={fixed} {...segmentProps} type="fixed">
            <group ref={fixedAnchor} />
          </RigidBody>

          <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
            <BallCollider args={[0.1]} />
            <group ref={j1Anchor} />
          </RigidBody>

          <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
            <BallCollider args={[0.1]} />
            <group ref={j2Anchor} />
          </RigidBody>

          <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
            <BallCollider args={[0.1]} />
            <group ref={j3Anchor} />
          </RigidBody>

          <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
            <CuboidCollider args={[0.8, 1.125, 0.01]} />

            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => {
                e.target.releasePointerCapture(e.pointerId)
                drag(false)
              }}
              onPointerDown={(e) =>
                e.target.setPointerCapture(e.pointerId) ||
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
              }
            >
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial color="#050505" roughness={0.3} metalness={0.5} clearcoat={1} clearcoatRoughness={0.15} />
              </mesh>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  color="white"
                  transparent
                  opacity={0.06}
                  roughness={0.2}
                  metalness={0}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  polygonOffset
                  polygonOffsetFactor={-2}
                />
              </mesh>
              <mesh geometry={nodes.card.geometry}>
                <shaderMaterial
                  transparent
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  vertexShader={`
                  varying vec2 vUv;
                  void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                `}
                  fragmentShader={`
                  varying vec2 vUv;
                  void main() {
                    vec2 cornerDelta = vUv - vec2(0.88, 0.88);
                    float cornerGlow = exp(-18.0 * dot(cornerDelta, cornerDelta));

                    float sweepCenter = 0.58 + 0.22 * (1.0 - vUv.y);
                    float sweepGlow = exp(-120.0 * pow(vUv.x - sweepCenter, 2.0)) * smoothstep(0.1, 0.95, vUv.y);

                    float alpha = 0.07 * cornerGlow + 0.05 * sweepGlow;
                    gl_FragColor = vec4(vec3(1.0), alpha);
                  }
                `}
                />
              </mesh>
              <mesh position={[-0.1035, 0.2705, 0.012]} renderOrder={10}>
                <planeGeometry args={[0.46, 0.139]} />
                <meshBasicMaterial map={qwordLogo} transparent alphaTest={0.1} depthWrite={false} />
              </mesh>
              <Text position={[-0.3108, 0.197, 0.012]} fontSize={0.0375} color="white" anchorX="left" anchorY="top">
                Prep. Apply. Secure.
              </Text>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </RigidBody>

          <mesh ref={band}>
            <meshLineGeometry />
            <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
          </mesh>
        </group>
      </group>
    </>
  )
}
