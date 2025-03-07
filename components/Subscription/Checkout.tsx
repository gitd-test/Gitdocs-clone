"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LoadingAnimation from "../common/LoadingAnimation"
import { Lock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { countries } from "countries-list"

export default function Checkout({ plan, activePlanId, isLoading, handleCreateOrder, billingAddress }: { plan: any, activePlanId: number, isLoading: boolean, handleCreateOrder: () => void, billingAddress: any }) {
  
    const [showCountryList, setShowCountryList] = useState(false);
    const [country, setCountry] = useState(billingAddress?.country || "United States");

    const countriesWithFlags = Object.entries(countries)
    .map(([key, country]) => ({
      name: country.name || "Unknown", // Fallback for missing name
      flag: key
        ? `https://flagcdn.com/${key.toLowerCase()}.svg`
        : "https://via.placeholder.com/150",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

    const data = countriesWithFlags.map((country) => (
    <div  className="flex items-center gap-4 appearance-none bg-[#343333] text-white py-2 px-4 hover:bg-[#474646] cursor-pointer" key={country.name}>
        <Image src={country.flag} alt={country.name} width={25} height={25} className="rounded-[2.5px]" />
        <p>{country.name}</p>
    </div>
    ));

    const defaultCountry = countriesWithFlags.find((AllCountry) => AllCountry.name === (country || "United States"));

    return (
    <Sheet>
      <SheetTrigger asChild>
        <Button disabled={plan.isActive || isLoading || plan.id < activePlanId} 
                variant="outline" 
                className={`w-full my-6 px-4 py-2 border-none rounded-lg transition-all duration-150 ${plan.isActive ? "bg-[#ededed]/50 text-black" : "bg-gradient-to-r from-[#8D61F6] to-[#1FABEB] text-[#ededed] hover:from-[#8D61F6]/80 hover:to-[#1FABEB]/80"}`}
        >{isLoading ? 
            <span className="flex items-center gap-3 justify-center w-full"> 
                <LoadingAnimation /> Processing...
            </span>  
            : plan.isActive ? "Current Plan" : plan.id > activePlanId ? "Upgrade" : "Downgrade"}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[100vw]">
        <SheetHeader className="bg-[#131313] pt-24 pb-10 px-36">
          <SheetTitle className="font-semibold text-[0.9rem] text-[#ededed] ">Subscribe to {plan.tagline}</SheetTitle>
          <SheetDescription className="text-4xl text-[#ededed]">
            US$ {plan.price}.00 <span className="text-[#ededed]/60 text-sm"> per month</span>
          </SheetDescription>
          <span className="text-[#ededed]/60 font-bold text-sm"> Then starting at US$ {plan.price} per month.</span>
        </SheetHeader>
        <div className="px-36">
            <div className="flex w-[53%] h-[calc(100vh-14.7rem)] flex-col">
                <div className="flex items-start py-5 justify-between gap-2 border-b border-[#ededed]/10">
                    <div className="flex flex-col gap-2">
                        <p>Gitdocs AI &nbsp; <span className="text-[#ededed]/60 text-xs bg-[#ededed]/10 px-2 py-1 rounded-lg">{plan.name}</span></p>
                        <p className="text-[#ededed]/60 text-xs -mt-1">Billed monthly</p>
                    </div>
                    <p>US$ {plan.price}.00</p>
                </div>
                <div className="flex items-start py-5 justify-between gap-2 border-b border-[#ededed]/10">
                    <div className="flex flex-col gap-2">
                        <p>Platform Fee</p>
                        <p className="text-[#ededed]/60 text-xs -mt-1">We charge a platform fee to cover the cost of processing your payments.</p>
                    </div>
                    <p>US$ 0.25</p>
                </div>
                <div className="flex w-[60%] ms-auto h-[calc(100vh-14.7rem)] flex-col">
                    <div className="flex flex-wrap items-start py-5 justify-between gap-2 border-b border-[#ededed]/10">
                        <div className="w-full flex items-center justify-between">
                                <p className="text-[#ededed]/60">Subtotal</p>
                                <p>US$ {plan.price + 0.25}</p>
                        </div>
                        <div className="w-full flex items-center justify-between">
                                <p className="text-[#ededed]/60">Promotional Offer</p>
                                <p>-US$ 0.25</p>
                        </div>
                    </div>
                    <div className="w-full mt-4 flex items-center justify-between">
                        <p className="text-[#ededed]">Total to pay</p>
                        <p>US$ {plan.price}.00</p>
                    </div>
                </div>
            </div>
        </div>

        <SheetFooter className="h-[26rem] flex flex-wrap rounded-xl p-5 w-96 border border-[#ededed]/10 bg-[#131313] shadow-lg absolute top-32 right-36">
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <input type="text" id="email" name="email" placeholder="abc@gmail.com" className={`w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]`} />

                <label htmlFor="contact" className="text-sm mt-2 font-semibold">Phone Number</label>
                <input type="text" id="contact" name="contact" placeholder="9876543210" className={`w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]`} />

                <p className="text-sm font-semibold">Country</p>
                <button onClick={(e) => {
                        e.stopPropagation();
                        setShowCountryList(!showCountryList);
                    }} type="button" className="w-full text-start max-h-[10rem] relative cursor-pointer text-sm py-2 px-4 bg-transparent rounded-md border border-[#353535] focus:outline-2">
                    <div className="flex items-center gap-4 text-white">
                        <Image src={defaultCountry?.flag || ""} alt={defaultCountry?.name || ""} width={25} height={25} className="rounded-[2.5px]" />
                        <p>{defaultCountry?.name}</p>
                    </div>

                    {showCountryList && <div className="w-full z-50 absolute top-10 left-0 max-h-60 overflow-y-auto cursor-pointer text-sm bg-transparent rounded-md border border-[#353535]">
                        {data}
                    </div>}

                </button>
            </div>
          <SheetClose asChild>
            <Button type="button" onClick={handleCreateOrder} className="bg-gradient-to-b w-[90%] font-semibold absolute bottom-5 left-[47.5%] -translate-x-1/2 from-[#70c8f5] to-[#4CB9EE] hover:from-[#70c8f5]/80 hover:to-[#4CB9EE]/80 text-black">Pay ${plan.price}.00 & Continue</Button>
          </SheetClose>

        <p className="absolute z-30 -bottom-[26.5rem] h-full left-0 w-full text-xs text-[#ededed]/60">
            <div className="flex gap-2 w-fit mx-auto"><Lock className="w-3 h-3 mt-0.5 -ms-5" /> Secured by Razorpay</div>
        </p>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}
