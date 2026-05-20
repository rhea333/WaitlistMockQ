import { motion } from 'motion/react'

export function ScrollAnimation({ children, direction = 'down', className = '' }) {
  const offset = direction === 'up' ? -40 : direction === 'left' ? -40 : direction === 'right' ? 40 : 40
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'

  return (
    <motion.div
      initial={{ opacity: 0, [axis]: offset }}
      whileInView={{ opacity: 1, [axis]: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
