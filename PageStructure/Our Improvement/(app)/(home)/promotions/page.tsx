import ClientPage from "@/components/promotions/ClientPage";
import { getCarPromotions } from '@/lib/promotions/api'
import React, { use } from 'react'

interface Props {}

async function getCarPromotionData() {
  const promotion = await getCarPromotions()

  return {
    promotions: promotion.promotions,
    staticCounts: promotion.staticCounts,
  }
}

export type PromotionDataType = Awaited<ReturnType<typeof getCarPromotionData>>

function Page(props: Props) {
  const { promotions, staticCounts } = use(getCarPromotionData())

  const promotionData = { promotions, staticCounts }

  return <ClientPage data={promotionData} />
}

export default Page; 