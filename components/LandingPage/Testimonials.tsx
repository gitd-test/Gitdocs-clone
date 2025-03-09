"use client"

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    content: "GitDocs AI has completely transformed our documentation workflow. What used to take days now happens automatically, and the quality is actually better!",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    bgColor: "bg-gitdocs-blue/90",
  },
  {
    content: "The AI-powered insights have helped us identify gaps in our documentation we didn't even know existed. Now our onboarding time for new developers has been cut in half.",
    author: "Michael Chen",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    bgColor: "bg-gitdocs-purple/90",
  },
  {
    content: "I was skeptical about AI-generated documentation, but GitDocs AI impressed me with its accuracy and context-awareness. It actually understands our codebase.",
    author: "Emma Rodriguez",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 4,
    bgColor: "bg-gitdocs-orange/90",
  },
  {
    content: "As a startup with limited resources, having our documentation automatically generated and maintained has been a game-changer. One less thing to worry about!",
    author: "Alex Thompson",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    bgColor: "bg-gitdocs-green/90",
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      if (!isDragging) {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 6000);

    // Set up intersection observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearInterval(interval);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isDragging]);

  // Handle touch/mouse events for manual sliding
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) { // Threshold for swipe detection
      if (diff > 0) {
        // Swipe left, go to next
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      } else {
        // Swipe right, go to previous
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
    
    setIsDragging(false);
  };

  // Generate star rating display
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={i < rating ? "currentColor" : "none"} 
            stroke="currentColor" 
            className={`w-4 h-4 ${i < rating ? 'text-gitdocs-orange' : 'text-gray-300'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef} 
      id="testimonials" 
      className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-gitdocs-blue/5 to-white"
    >
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gitdocs-blue/10 blur-3xl"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-gitdocs-orange/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-gitdocs-purple/10 blur-3xl"></div>
      
      {/* Animated patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-gitdocs-blue/20 rounded-full"></div>
        <div className="absolute top-60 right-20 w-20 h-20 border-2 border-gitdocs-purple/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-30 h-30 border-2 border-gitdocs-orange/20 rounded-full"></div>
        
        <div className="absolute top-1/4 left-1/4 rotate-45 transform bg-gradient-to-r from-gitdocs-blue/5 to-transparent h-[1px] w-64"></div>
        <div className="absolute top-3/4 right-1/4 -rotate-45 transform bg-gradient-to-r from-gitdocs-purple/5 to-transparent h-[1px] w-64"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-3 py-1 mb-4 border border-gitdocs-purple/30 rounded-full bg-gitdocs-purple/5 text-gitdocs-purple text-xs font-medium">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Loved by Developers <span className="text-gitdocs-blue relative">
              Worldwide
              <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C32 2.5 62.5 8 93.5 9.5C124.5 11 156 6.5 187 4.5C218 2.5 249 5.5 280 8.5C311 11.5 330.5 5.83333 342 3" 
                    stroke="currentColor" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
              </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who have transformed their documentation process with GitDocs AI.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div 
            className="relative" 
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {/* Testimonials slider */}
            <div 
              ref={sliderRef}
              className="relative overflow-hidden h-[350px] md:h-[300px] px-4 cursor-grab active:cursor-grabbing"
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 flex flex-col md:flex-row items-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                  ${
                    activeIndex === index 
                      ? 'translate-x-0 scale-100 z-20' 
                      : activeIndex === (index + 1) % testimonials.length
                        ? 'translate-x-[105%] scale-95 z-10' 
                        : activeIndex === (index - 1 + testimonials.length) % testimonials.length
                          ? 'translate-x-[-105%] scale-95 z-10'
                          : 'translate-x-0 scale-90 opacity-0 z-0'
                  }`}
                >
                  <div className="flex-shrink-0 w-full md:w-1/3 mb-6 md:mb-0 flex justify-center">
                    <div className="relative">
                      <div className={`w-24 h-24 text-4xl font-bold flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-500 hover:scale-105 ${testimonial.bgColor}`}>
                        {testimonial.author.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Rating badge */}
                      <div className="absolute -top-3 -left-3 bg-white rounded-full border-2 border-gitdocs-blue/20 px-2 py-1 shadow-md">
                        {renderRating(testimonial.rating)}
                      </div>
                      
                      {/* Video call icon */}
                      <div className="absolute -bottom-3 -right-3 bg-gitdocs-blue text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transform transition-transform duration-500 hover:rotate-12">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 6.1H3v9.5h14v-9.5Z"></path>
                          <path d="m21 15.6-4-2.3V8.4l4-2.3v9.5Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow md:pl-8">
                    <div className="mb-4">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gitdocs-blue/20">
                        <path d="M9.33333 21.3333C7.86 21.3333 6.63333 20.8133 5.65333 19.7733C4.67333 18.7333 4.18 17.4533 4.17333 15.9333C4.17333 14.0667 4.70667 12.4533 5.77333 11.0933C6.84 9.73333 8.46 8.4 10.6333 7.09333L12.9333 9.02667C11.3733 9.90667 10.24 10.7067 9.53333 11.4267C8.82667 12.1467 8.47333 12.84 8.47333 13.5067C8.47333 13.88 8.53333 14.2133 8.65333 14.5067C8.77333 14.8 9.00667 15.0267 9.35333 15.1867C9.74667 15.36 10.1333 15.4467 10.5133 15.4467C11.64 15.4467 12.5533 15.0867 13.2533 14.3667C13.9533 13.6467 14.3067 12.6933 14.3133 11.5067C14.3133 10.2 13.92 9.12 13.1333 8.26667C12.3467 7.41333 11.3067 6.98667 10.0133 6.98667V2.66667C12.5467 2.66667 14.64 3.48 16.2933 5.10667C17.9467 6.73333 18.7733 8.76 18.7733 11.1867C18.7733 13.8533 17.9267 16 16.2333 17.62C14.54 19.24 12.2733 20.0533 9.33333 20.06V21.3333ZM22.6667 21.3333C21.1933 21.3333 19.9667 20.8133 18.9867 19.7733C18.0067 18.7333 17.5133 17.4533 17.5067 15.9333C17.5067 14.0667 18.04 12.4533 19.1067 11.0933C20.1733 9.73333 21.7933 8.4 23.9667 7.09333L26.2667 9.02667C24.7067 9.90667 23.5733 10.7067 22.8667 11.4267C22.16 12.1467 21.8067 12.84 21.8067 13.5067C21.8067 13.88 21.8667 14.2133 21.9867 14.5067C22.1067 14.8 22.34 15.0267 22.6867 15.1867C23.08 15.36 23.4667 15.4467 23.8467 15.4467C24.9733 15.4467 25.8867 15.0867 26.5867 14.3667C27.2867 13.6467 27.64 12.6933 27.6467 11.5067C27.6467 10.2 27.2533 9.12 26.4667 8.26667C25.68 7.41333 24.64 6.98667 23.3467 6.98667V2.66667C25.88 2.66667 27.9733 3.48 29.6267 5.10667C31.28 6.73333 32.1067 8.76 32.1067 11.1867C32.1067 13.8533 31.26 16 29.5667 17.62C27.8733 19.24 25.6067 20.0533 22.6667 20.06V21.3333Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <p className="text-lg italic mb-6 text-gray-800">{testimonial.content}</p>
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-300 hover:shadow-lg ml-2 lg:ml-0"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gitdocs-blue">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-300 hover:shadow-lg mr-2 lg:mr-0"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gitdocs-blue">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 mx-1 rounded-full transition-all duration-300
                    ${activeIndex === index ? 'bg-gitdocs-blue w-6 scale-100' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Stats band */}
          <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: "10,000+", label: "Developers", icon: "👩‍💻" },
              { value: "5,000+", label: "Repositories", icon: "📦" },
              { value: "99.9%", label: "Satisfaction", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mr-4">{stat.icon}</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gitdocs-blue">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
