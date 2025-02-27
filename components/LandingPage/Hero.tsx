"use client"

import { buttonVariants } from "@/components/ui/button-variants";
import { SignUpButton } from "@clerk/nextjs";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 lg:pt-48 lg:pb-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-gitdocs-blue/10 via-gitdocs-purple/5 to-gitdocs-orange/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full hero-image-glow" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 mb-6 border border-gitdocs-blue/30 rounded-full bg-gitdocs-blue/5 text-gitdocs-blue text-xs font-medium opacity-0 animate-fade-in">
            Introducing GitDocs AI
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 opacity-0 animate-fade-in-delay-1">
            Transform Your <span className="text-gitdocs-blue">Documentation</span> with AI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 opacity-0 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Automatically generate, update, and maintain documentation from your codebase. 
            Save time and keep your docs in sync with your code.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-delay-3">
            <SignUpButton>
              <p 
                className={`cursor-pointer ${buttonVariants({ variant: "gradient", size: "xl" })}`}
              >
                Get Started Free
              </p>
            </SignUpButton>
            <a 
              href="#how-it-works" 
              className={buttonVariants({ variant: "outline-gradient", size: "xl" })}
            >
              How It Works
            </a>
          </div>
          
          <div className="mt-12 md:mt-16 opacity-0 animate-fade-in-delay-4">
            <p className="text-sm text-muted-foreground mb-4">Trusted by developers from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {['Google', 'Microsoft', 'Airbnb', 'Uber', 'Spotify'].map((company) => (
                <div key={company} className="text-muted-foreground/70 font-semibold">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
