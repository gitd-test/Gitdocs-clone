import Sidebar from "@/components/Dashboard/Sidebar"
import NavBar from "@/components/Dashboard/NavBar"
import HeroSection from "@/components/Dashboard/HeroSection"
const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <NavBar />
        <HeroSection />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Dashboard | Gitdocs AI",
  description: "Gitdocs AI",
}

export default Dashboard