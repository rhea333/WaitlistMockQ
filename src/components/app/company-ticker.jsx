import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const companyGroups = [
  ['Netflix', 'Apple', 'Google', 'Meta', 'Amazon'],
  ['Bloomberg', 'Microsoft', 'Shopify', 'IBM', 'Intuit']
]

const companyLogos = {
  Netflix: '/companies/netflix.png',
  Apple: '/companies/apple.png',
  Google: '/companies/google.png',
  Meta: '/companies/meta.png',
  Amazon: '/companies/amazon.png',
  Bloomberg: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Bloomberg_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
  Microsoft: '/companies/microsoft.png',
  Shopify: '/companies/shopify.png',
  IBM: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  Intuit: '/companies/intuit.png'
}

function LogoRow({ companies }) {
  return (
    <>
      {companies.map((company) => (
        <div key={company} className="flex h-full flex-1 items-center justify-center px-8">
          <img src={companyLogos[company]} alt={company} className="h-6 w-auto opacity-70 brightness-0 invert transition-opacity hover:opacity-100" />
        </div>
      ))}
    </>
  )
}

export function CompanyTicker() {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % companyGroups.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    hasAnimated.current = true
  }, [])

  return (
    <div className="glass-ticker relative z-10 mt-0 w-full rounded-sm border border-white/10">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="flex h-[72px] shrink-0 items-center border-r border-white/10 px-6 md:px-8">
          <p className="max-w-[180px] text-sm font-semibold leading-snug text-gray-400">
            Questions sourced from real interviews at:
          </p>
        </div>
        <div className="relative h-[72px] flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-20 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-white/10 last:border-r-0" />
            ))}
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              className="absolute inset-0 flex h-[72px] items-stretch"
              initial={hasAnimated.current ? { y: '100%' } : false}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <LogoRow companies={companyGroups[activeIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
