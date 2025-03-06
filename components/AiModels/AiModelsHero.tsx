"use client";

import { Button } from "@/components/ui/button";
import AnimatedCards from "./AnimatedCards";
import { Info } from "lucide-react";
 
const cards = [
  {
    description: "Lana Del Rey",
    title: "Summertime Sadness",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style.
        </p>
      );
    },
  },
  {
    description: "Babbu Maan",
    title: "Mitran Di Chhatri",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience.
        </p>
      );
    },
  },
 
  {
    description: "Metallica",
    title: "For Whom The Bell Tolls",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances.
        </p>
      );
    },
  },
  {
    description: "Lord Himesh",
    title: "Aap Ka Suroor",
    src: "https://assets.aceternity.com/demos/aap-ka-suroor.jpeg",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Himesh Reshammiya, a renowned Indian music composer, singer, and
          actor.
        </p>
      );
    },
  },
];

const AiModelsHero = () => {
 
  return (
    <div className="mx-auto py-6 px-10 w-full min-h-[calc(100vh-64px)]">
      <h2 className="text-3xl font-bold text-white">Models</h2>
      <p className="text-sm mt-2 -mb-1 text-[#999]">Explore the list of Generative AI models currently supported, along with upcoming additions. Stay updated on new releases and request support for models you’d like to see added. Help shape the future of AI by letting us know what matters most to you!</p>
      <h3 className="text-2xl mt-10 mb-3 text-white">Gemini Models</h3>
      <AnimatedCards cards={cards} />
      <h3 className="text-2xl mt-10 mb-3 text-white">OpenAI Models</h3>
      <AnimatedCards cards={cards} />
      <h3 className="text-2xl mt-10 mb-3 text-white">Claude Models</h3>
      <AnimatedCards cards={cards} />
      <h3 className="text-2xl mt-10 mb-3 text-white">DeepSeek Models</h3>
      <AnimatedCards cards={cards} />

      <div className="bg-gradient-to-r from-[#7F58E4]/20 to-[#1496D8]/20 rounded-lg p-6 mt-14 mb-4 border border-white/10">
          <div className="flex items-start gap-4">
            <Info size={24} className="text-[#1496D8] mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Request a new model?</h3>
              <p className="text-grayText mb-4">
              Do you have a specific model you'd like to see on our platform? Let us know your suggestion, and we'll consider adding it to enhance your experience and meet your needs.
              </p>
              <Button className="bg-gradient-to-r from-[#7F58E4] to-[#1496D8] hover:opacity-90">
                Request Model
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default AiModelsHero