import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'

const ChartsPage = () => {
  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
    </>
  )
}

export default ChartsPage
