"use client"
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { useState, useEffect } from "react";
import Link  from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import Image from "next/image";
import logo from "@/app/favicon.ico";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
          <Image
                src={logo || "/default-logo.png"}
                width={33}
                height={33}
                alt="logo"
            />
            <span className="text-lg font-semibold">GitDocs AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-gitdocs-blue transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-gitdocs-blue transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-gitdocs-blue transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-gitdocs-blue transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignInButton>
              <p className={`cursor-pointer ${buttonVariants({ variant: "outline-gradient" })}`}>
                Log In
              </p>
            </SignInButton>
            <SignUpButton>
              <p className={`cursor-pointer ${buttonVariants({ variant: "gradient" })}`}>
                Get Started
              </p>
            </SignUpButton>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 animate-fade-in bg-white/90 backdrop-blur-md rounded-lg shadow-md">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-sm font-medium p-2 hover:bg-gitdocs-blue/10 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium p-2 hover:bg-gitdocs-blue/10 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium p-2 hover:bg-gitdocs-blue/10 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className="text-sm font-medium p-2 hover:bg-gitdocs-blue/10 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex space-x-4 pt-2">
                <a href="#" className={buttonVariants({ variant: "outline-gradient", size: "sm" })}>
                  Log In
                </a>
                <a href="#" className={buttonVariants({ variant: "gradient", size: "sm" })}>
                  Get Started
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
