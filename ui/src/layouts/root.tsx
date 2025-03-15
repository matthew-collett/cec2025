import { Outlet, useLocation } from 'react-router-dom'

import { getTitle } from '@/config'

export const RootLayout = () => {
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <>
      <title>{`IntelliCure | ${title}`}</title>
      <Outlet />
    </>
  )
}
