"use client"

import { buttonVariants } from "@/components/ui/button-variants";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import Image from "next/image";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FileText, ListFilter, Monitor, Smartphone, Settings, Check, BarChart, User } from "lucide-react";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

const Hero = () => {
  return (
    <section className="pt-[4.5rem] pb-20 md:pt-40 md:pb-32 lg:pt-28 lg:pb-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-gitdocs-blue/10 via-gitdocs-purple/5 to-gitdocs-orange/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full hero-image-glow" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-20 lg:flex">
        <div className="text-center lg:text-left max-w-3xl mx-auto lg:w-[55%]">
            <div className="inline-flex items-center px-3 py-1 mb-6 border border-gitdocs-blue/30 rounded-full bg-gitdocs-blue/5 text-gitdocs-blue text-xs font-medium opacity-0 animate-fade-in">
              Introducing GitDocs AI
            </div>
          
          <h1 className="text-4xl text-center lg:text-left lg:text-5xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 opacity-0 animate-fade-in-delay-1">
            Transform Your <span className="text-gitdocs-blue">Documentation</span> with AI
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 opacity-0 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Automatically generate, update, and maintain documentation from your codebase. 
            Save time and keep your docs in sync with your code.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-6 opacity-0 animate-fade-in-delay-3">
            <SignUpButton>
              <p 
                className={`cursor-pointer ${buttonVariants({ variant: "gradient", size: "lg" })}`}
              >
                Get Started Free
              </p>
            </SignUpButton>
            <Link 
              href="/#how-it-works" 
              className={buttonVariants({ variant: "outline-gradient", size: "lg" })}
            >
              How It Works
            </Link>
          </div>

          <div className="flex flex-col md:flex-row lg:flex-col items-center lg:items-start  md:gap-5 lg:gap-0 justify-center lg:justify-start">
            <div className="flex md:flex-row flex-col item-center md:gap-8 justify-center lg:justify-start">
              <div className="flex flex-row items-center justify-start mx-auto lg:mx-0 mt-6 md:my-9 lg:my-7 w-fit">
                <AnimatedTooltip items={people} />
              </div>
              <div className="flex flex-col mt-4 md:mt-10 mx-auto lg:mx-0 lg:mt-8 justify-start items-center md:items-start my-9 lg:my-7 w-fit">
                <div className="flex flex-row items-center gap-1">
                  <FaStar className="text-[#EAB308] h-4 w-4 lg:h-5 lg:w-5" />
                  <FaStar className="text-[#EAB308] h-4 w-4 lg:h-5 lg:w-5" />
                  <FaStar className="text-[#EAB308] h-4 w-4 lg:h-5 lg:w-5" />
                  <FaStar className="text-[#EAB308] h-4 w-4 lg:h-5 lg:w-5" />
                  <FaStarHalfAlt className="text-[#EAB308] h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <p className="text-sm text-muted-foreground mt-1"> <span className="font-bold text-gitdocs-blue text-base">10,000+</span> Readmes Generated</p>
              </div>
            </div>

            <a
              href="https://www.producthunt.com/posts/gitdocs-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gitdocs&#0045;ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=934881&theme=light&t=1741433558669"
                alt="Gitdocs AI - Gitdocs AI: Smarter Documentation, Simplified. | Product Hunt"
                style={{ width: "200px", height: "56px" }}
                className="mx-auto w-full lg:mx-0"
                width="200"
                height="54"
              />
            </a>
          </div>
          <div className="mt-12 md:mt-16 opacity-0 animate-fade-in-delay-4">
            <p className="text-sm text-muted-foreground mb-4">Trusted by developers from</p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 md:gap-12">
              {['Google', 'Microsoft', 'Airbnb', 'Uber', 'Spotify'].map((company) => (
                <div key={company} className="text-muted-foreground/70 font-semibold">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-20 opacity-0 animate-fade-in-delay-4 md:w-[45%]">
          {/* Right content - Custom Laptop and Mobile mockup */}
          <div className="mt-8 lg:mt-0 relative">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Laptop mockup */}
              <div className="relative z-10 bg-white rounded-lg shadow-xl transform transition-transform hover:scale-105 duration-300 w-full mx-auto">
                <div className="bg-gray-800 rounded-t-lg p-2 flex items-center">
                  <div className="flex space-x-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-white text-xs">GitDocs Dashboard</div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-b-lg">
                  <div className="flex gap-3">
                    {/* Left sidebar */}
                    <div className="w-1/4 bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center mb-4 text-gitdocs-blue text-xs font-medium">
                        <FileText size={14} className="mr-2" />
                        <span>My Projects</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-gitdocs-blue/10 text-gitdocs-blue text-xs p-2 rounded flex items-center">
                          <ListFilter size={12} className="mr-1.5" />
                          <span>Overview</span>
                        </div>
                        <div className="text-gray-700 text-xs p-2 rounded flex items-center">
                          <ListFilter size={12} className="mr-1.5" />
                          <span>User Guide</span>
                        </div>
                        <div className="text-gray-700 text-xs p-2 rounded flex items-center">
                          <ListFilter size={12} className="mr-1.5" />
                          <span>Release Notes</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main content */}
                    <div className="w-3/4 bg-white rounded-lg shadow-sm p-3">
                      <div className="flex justify-between items-center border-b pb-2 mb-3">
                        <div className="text-sm font-medium">Documentation Overview</div>
                        <Settings size={14} className="text-gray-500" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="h-2 bg-gitdocs-blue/20 rounded-full w-full mb-2"></div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gitdocs-blue">Progress: 75%</span>
                          <span className="text-gray-500">37 files</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {['Introduction', 'API Reference', 'Authentication'].map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-gitdocs-blue'} mr-2`}></div>
                              <span>{item}</span>
                            </div>
                            <Check size={12} className={`${i !== 2 ? 'text-green-500' : 'text-gray-300'}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile mockup */}
              <div className="absolute -right-4 -bottom-16 z-20 w-[180px] bg-white rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-300 border-4 border-gray-800">
                <div className="rounded-t-xl bg-gray-800 h-6 flex justify-center items-center">
                  <div className="w-16 h-2 bg-gray-600 rounded-full"></div>
                </div>
                
                <div className="p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[10px] font-medium">GitDocs Mobile</div>
                    <User size={10} className="text-gitdocs-blue" />
                  </div>
                  
                  <div className="bg-gitdocs-blue/5 p-2 rounded-lg mb-3">
                    <div className="text-[8px] font-medium text-gitdocs-blue mb-1">What type of project?</div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-1.5 rounded flex flex-col items-center justify-center border border-gitdocs-blue">
                        <Monitor size={10} className="text-gitdocs-blue mb-1" />
                        <span className="text-[6px]">Web app</span>
                      </div>
                      <div className="bg-white p-1.5 rounded flex flex-col items-center justify-center">
                        <BarChart size={10} className="text-gray-400 mb-1" />
                        <span className="text-[6px] text-gray-500">UI/UX Design</span>
                      </div>
                      <div className="bg-white p-1.5 rounded flex flex-col items-center justify-center">
                        <Smartphone size={10} className="text-gray-400 mb-1" />
                        <span className="text-[6px] text-gray-500">Mobile App</span>
                      </div>
                      <div className="bg-white p-1.5 rounded flex flex-col items-center justify-center">
                        <FileText size={10} className="text-gray-400 mb-1" />
                        <span className="text-[6px] text-gray-500">Documentation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
                
                <div className="rounded-b-xl bg-gray-800 h-4"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 w-24 h-24 text-gitdocs-orange/20 animate-float z-0 hidden md:block">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M45.3,-75.3C58.4,-69.8,68.9,-56.5,75.2,-41.9C81.5,-27.2,83.6,-11.2,81.1,3.4C78.6,18.1,71.5,31.5,62.7,43.9C53.9,56.3,43.5,67.7,30.4,73.1C17.3,78.5,1.6,77.9,-12.4,74C-26.4,70.1,-38.8,62.8,-47.2,52.3C-55.6,41.8,-60.1,28.2,-65.6,13.8C-71.1,-0.6,-77.6,-15.7,-76.2,-30.9C-74.8,-46.1,-65.4,-61.3,-52.2,-66.8C-39,-72.4,-22.1,-68.3,-6.2,-68.5C9.7,-68.6,32.1,-80.9,45.3,-75.3Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="absolute -left-6 bottom-4 w-20 h-20 text-gitdocs-purple/20 animate-float" style={{ animationDelay: "1s" }}>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M47.7,-79.1C62.3,-71.9,75.2,-58.7,81.7,-42.7C88.2,-26.7,88.4,-7.8,84.6,9.6C80.9,27.1,73.1,43.1,61.5,56.3C49.9,69.5,34.4,79.8,17.1,82.9C-0.3,86.1,-19.5,82,-35.7,73.4C-51.9,64.8,-65.1,51.6,-73.2,35.8C-81.4,19.9,-84.6,1.3,-81.9,-16.2C-79.2,-33.6,-70.7,-49.9,-57.9,-58.2C-45.1,-66.6,-28,-67.1,-12.6,-70.1C2.9,-73.1,33.1,-86.4,47.7,-79.1Z" transform="translate(100 100)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;