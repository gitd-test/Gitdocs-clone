import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileSearch } from "lucide-react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import Navbar from "@/components/LandingPage/Navbar"

export default function NotFound() {
  return (
        <div className="min-h-screen flex flex-col bg-[#f8f6ff]">

        <Navbar />

        <main className="flex-1 container mx-auto mt-36 px-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-2xl mx-auto mb-8">
            <div className="absolute -z-10 w-full aspect-square max-w-md mx-auto rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 blur-3xl"></div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-orange-400/30 blur-xl"></div>
                <div className="relative bg-white p-6 rounded-full shadow-lg">
                    <FileSearch size={64} className="text-indigo-500" />
                </div>
                </div>
            </div>

            <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 text-transparent bg-clip-text">
                404
            </h1>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                The documentation you're looking for seems to be missing. Let's help you find your way back.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 text-white hover:opacity-90 transition-opacity"
                >
                <ArrowLeft size={20} />
                Back to Home
                </Link>
                <Link
                href="/#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                Contact Support
                </Link>
            </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Documentation</h3>
                <p className="text-gray-600 mb-4">Explore our comprehensive guides and tutorials.</p>
                <Link href="/#docs" className="text-blue-500 hover:text-blue-700 font-medium">
                Browse Docs
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Features</h3>
                <p className="text-gray-600 mb-4">Discover what GitDocs AI can do for your team.</p>
                <Link href="/#features" className="text-blue-500 hover:text-blue-700 font-medium">
                Explore Features
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Get Started</h3>
                <p className="text-gray-600 mb-4">Ready to transform your documentation?</p>
                <Link href="/#get-started" className="text-blue-500 hover:text-blue-700 font-medium">
                Start Now
                </Link>
            </div>
            </div>
        </main>

        <footer className="container mx-auto px-4 py-8 mt-auto text-center text-gray-600">
            <p>© {new Date().getFullYear()} GitDocs AI. All rights reserved.</p>
        </footer>
        </div>
    )
}

export const metadata = {
    title: {
      absolute : "404 Page Not Found | Gitdocs AI",
      default : "404 Page Not Found | Gitdocs AI",
      template : "%s | Gitdocs AI"
    },
    description: "404 Page Not Found | Gitdocs AI",
  }
