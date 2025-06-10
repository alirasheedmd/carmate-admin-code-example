import ClientPage from '@/components/dashboard/ClientPage'
import { getCarListingsPopular } from '@/lib/listings/api'
import { getCarPromotions } from '@/lib/promotions/api'
import React, { use } from 'react'

interface Props {}

async function getDashboardData() {
  const listing = await getCarListingsPopular()
  const promotions = await getCarPromotions()

  return { listing, promotions }
}

export type DashboardDataType = Awaited<ReturnType<typeof getDashboardData>>
function AdminDashboardPage(props: Props) {
  const {} = props

  const { listing, promotions } = use(getDashboardData())

  const dashboardData = { listing, promotions }

  return <ClientPage data={dashboardData} />
}

export default AdminDashboardPage
