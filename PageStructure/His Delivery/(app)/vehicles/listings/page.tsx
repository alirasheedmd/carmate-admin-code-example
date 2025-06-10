import ClientPage from '@/components/vehicles/listings/ClientPage'
import { getCarListings } from '@/lib/listings/api'
import React, { use } from 'react'

interface Props {}

async function getCarListingData() {
  const listing = await getCarListings()

  return { listing }
}

export type ListingDataType = Awaited<ReturnType<typeof getCarListingData>>

function ListingPage(props: Props) {
  const { listing } = use(getCarListingData())

  const listingData = { listing }

  return <ClientPage data={listingData} />
}

export default ListingPage
