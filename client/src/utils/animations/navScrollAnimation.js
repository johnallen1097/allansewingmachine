import { useEffect } from 'react'

const NavScrollAnimation = (tl) => {
  useEffect(() => {
    tl.from('.header', {
      duration: 0.5,
      css: { top: '-4rem' },
    })
    // eslint-disable-next-line
  }, [])
}

export default NavScrollAnimation
