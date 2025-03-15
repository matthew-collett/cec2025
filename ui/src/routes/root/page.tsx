import { Navigate } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { useAuth } from '@/context'

const RootPage = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

export default RootPage
