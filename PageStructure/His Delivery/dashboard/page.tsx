import ClientPage from '@/components/dashboard/ClientPage'
import { getCarListingsPopular } from '@/lib/listings/api'
import React, { use } from 'react'

interface Props {}

async function getDashboardData() {
  const listing = await getCarListingsPopular()

  return { listing }
}

export type DashboardDataType = Awaited<ReturnType<typeof getDashboardData>>
function AdminDashboardPage(props: Props) {
  const {} = props

  const { listing } = use(getDashboardData())

  const dashboardData = { listing }

  return <ClientPage data={dashboardData} />
}

export default AdminDashboardPage
