import LandingPage from "@/components/LandingPage/LandingPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitDocs AI",
  description: "GitDocs AI is a tool that helps you write documentation for your code.",
}

const LandingpageRoute = () => {
  return (
    <LandingPage />
  )
}
export default LandingpageRoute;