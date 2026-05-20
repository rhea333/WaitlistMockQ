import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}) {
  const id = useId()
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setDimensions({ width: rect.width, height: rect.height })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const columns = Math.max(1, Math.ceil(dimensions.width / width))
  const rows = Math.max(1, Math.ceil(dimensions.height / height))
  const dots = Array.from({ length: columns * rows }, (_, i) => {
    const col = i % columns
    const row = Math.floor(i / columns)
    return {
      x: col * width + cx,
      y: row * height + cy,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }
  })

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-white/20', className)}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x}, ${y})`}>
        {dots.map((dot) => (
          <motion.circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={cr}
            fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
            initial={glow ? { opacity: 0.4, scale: 1 } : {}}
            animate={glow ? { opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] } : {}}
            transition={
              glow
                ? {
                    duration: dot.duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: dot.delay,
                    ease: 'easeInOut'
                  }
                : {}
            }
          />
        ))}
      </g>
    </svg>
  )
}
