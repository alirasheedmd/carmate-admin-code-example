import Sidebar from '@/components/navigation/Sidebar'
import Header from '@/components/ui/Header'
import {
  getBrandsList,
  getListingOptions,
  getOBDetail,
  getOBModels,
} from '@/lib/api'
import { getUserDetails } from '@/lib/auth/api'
import { use } from 'react'

async function getHomeLayoutData() {
  const user = await getUserDetails()
  const officialBrand = await getOBDetail()
  const models = await getOBModels()
  const brands = await getBrandsList()
  const options = await getListingOptions()

  return { user, officialBrand, models, brands, options }
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, officialBrand, models, brands, options } = use(
    getHomeLayoutData()
  )

  const data = { user, officialBrand, models, brands, options }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="h-auto md:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col min-h-0 min-w-full">
        <Header data={data} />
        <div className="flex flex-1 min-h-0">
          {/* Desktop Sidebar */}

          <div className="hidden md:block transition-all duration-300">
            <Sidebar isOpen={true} />
          </div>

          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}
