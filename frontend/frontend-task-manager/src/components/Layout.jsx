import Navbar from "./Navbar";


export default function Layout({children}){
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar/>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4-sm:p-6 lg:p-8">
                {children} 
            </main>
        </div>
    )
}