import Header from "@/components/ui/Header";




export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen overflow-hidden">
  
      <main className="flex-1 flex flex-col min-h-0 min-w-full">

        <Header/>
        <div className="flex flex-1 min-h-0">
          {/* Desktop Sidebar */}
          
          <div className="flex-1 overflow-auto">
            {children}
            </div>
          </div>

      </main>
    </div>
  );
} 