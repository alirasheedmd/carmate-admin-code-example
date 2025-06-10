import React from 'react'
import ContentShimmer from '@/components/ui/ContentShimmer'
import PageHeaderShimmer from '@/components/ui/PageHeaderShimmer'

const Loading = () => {
  return (
    <div className="pt-[61.35px]">
      <PageHeaderShimmer />
      <ContentShimmer />
    </div>
  )
}

export default Loading
