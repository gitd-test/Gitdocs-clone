"use client"

import { X } from "lucide-react";
import { countries } from "countries-list";
import Image from "next/image";
import { useState } from "react";

const AddAddressForm = ({ addressData, setAddressData, setShowAddAddressForm }: { addressData: any, setAddressData: (address: any) => void, setShowAddAddressForm: (show: boolean) => void }) => {

    const [showCountryList, setShowCountryList] = useState(false);

    const handleClose = () => {
        if (showCountryList) {
            setShowCountryList(false);
        } else {
            setShowAddAddressForm(false);
        }
    }

    const countriesWithFlags = Object.entries(countries)
    .map(([key, country]) => ({
      name: country.name || "Unknown", // Fallback for missing name
      flag: key
        ? `https://flagcdn.com/${key.toLowerCase()}.svg`
        : "https://via.placeholder.com/150",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

    const data = countriesWithFlags.map((country) => (
    <div className="flex items-center gap-4 appearance-none bg-[#343333] text-white py-2 px-4 hover:bg-[#474646] cursor-pointer" key={country.name}>
        <Image src={country.flag} alt={country.name} width={25} height={25} />
        <p>{country.name}</p>
    </div>
    ));

    const defaultCountry = countriesWithFlags.find((country) => country.name === (addressData?.country || "United States"));
      
    return (

        <div onClick={handleClose} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#1f1f1f] p-4 w-[32rem] h-[37rem] overflow-y-auto rounded-xl">
                <div className="flex justify-between">
                    <h2 className="text-lg">Add a new billing address</h2>
                    <button onClick={handleClose} className="text-sm text-gray-500">
                    <X />
                </button>
                </div>

                <form onClick={() => setShowCountryList(false)} className="mt-5">

                    <p className="text-[#999] border-b-2 border-[#353535] pb-1 text-sm">Personal information</p>

                    <div className="flex flex-col gap-2 mt-3">
                        <label htmlFor="name" className="text-sm font-semibold">Name</label>
                        <input onChange={(e) => setAddressData({...addressData, name: e.target.value})} type="text" id="name" name="name" value={addressData?.name} placeholder="John Doe" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />

                        <label htmlFor="contact" className="text-sm font-semibold">Contact</label>
                        <input onChange={(e) => setAddressData({...addressData, contact: e.target.value})} type="text" id="contact" name="contact" value={addressData?.contact} placeholder="abc@gmail.com" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                    </div>

                    <p className="text-[#999] border-b-2 border-[#353535] pb-1 mt-8 text-sm">Billing address</p>

                    <div className="flex flex-col gap-2 mt-3">
                        <p className="text-sm font-semibold">Country</p>
                        <button type="button" className="w-full text-start max-h-[10rem] relative appearance-none cursor-pointer text-sm py-2 px-4 bg-transparent rounded-md border border-[#353535] focus:outline-2">
                            <div onClick={() => setShowCountryList(!showCountryList)} className="flex items-center gap-4 appearance-none text-white">
                                <Image src={defaultCountry?.flag || ""} alt={defaultCountry?.name || ""} width={25} height={25} />
                                <p>{defaultCountry?.name}</p>
                            </div>

                            {showCountryList && <div  className="w-full absolute top-10 left-0 max-h-60 overflow-y-auto appearance-none cursor-pointer text-sm bg-transparent rounded-md border border-[#353535]">
                                {data}
                            </div>}

                        </button>

                        <label htmlFor="address-1" className="text-sm font-semibold">Address line 1</label>
                        <input onChange={(e) => setAddressData({...addressData, address: e.target.value})} type="text" id="address-1" name="address-1" value={addressData?.address.split(",")[0]} placeholder="123 Main St" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />

                        <label htmlFor="address-2 (optional)" className="text-sm font-semibold">Address line 2 (optional)</label>
                        <input onChange={(e) => setAddressData({...addressData, address: e.target.value})} type="text" id="address-2" name="address-2" value={addressData?.address.split(",")[1]} placeholder="Apt 1" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                        
                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="city" className="text-sm font-semibold">City</label>
                                <input onChange={(e) => setAddressData({...addressData, city: e.target.value})} type="text" id="city" name="city" value={addressData?.city} placeholder="New York" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                            </div>

                            <div className="flex flex-col gap-2">
                            <label htmlFor="state" className="text-sm font-semibold">State</label>
                            <input onChange={(e) => setAddressData({...addressData, state: e.target.value})} type="text" id="state" name="state" value={addressData?.state} placeholder="NY" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                            </div>
                        </div>

                        <label htmlFor="postal-code" className="text-sm font-semibold">Zip code</label>
                        <input onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})} type="text" id="postal-code" name="postal-code" value={addressData?.postalCode} placeholder="12345" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />

                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="taxid-type" className="text-sm font-semibold">Tax ID Type (optional)</label>
                                <input onChange={(e) => setAddressData({...addressData, taxIdType: e.target.value})} type="text" id="taxid-type" name="taxid-type" value={addressData?.taxIdType} className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                            </div>

                            <div className="flex flex-col gap-2">
                            <label htmlFor="tax-number" className="text-sm font-semibold">Tax Number (optional)</label>
                            <input onChange={(e) => setAddressData({...addressData, taxIdNumber: e.target.value})} type="text" id="tax-number" name="tax-number" value={addressData?.taxIdNumber} placeholder="1234567890" className="w-full text-sm py-1.5 px-4 bg-transparent rounded-md border border-[#353535]" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-3">
                            <button onClick={handleClose} type="button" className="text-sm py-2 px-4 ms-auto rounded-lg border border-[#353535] text-[#ededed]">Cancel</button>
                            <button type="button" className="text-sm py-2 px-4 rounded-lg bg-[#ededed] text-black">Save</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddAddressForm