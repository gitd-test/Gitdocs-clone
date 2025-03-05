import { useContext, useState } from "react";
import { AppContext, AppContextType } from "../../contexts/AppContext";
import AddAddressForm from "./AddAddressForm";
import { Star, Mail, MapPin, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
interface AddressData {
    name: string;
    contact: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

const SubPaymentMethods = () => {

    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [addressData, setAddressData] = useState<AddressData>({
        name: "",
        contact: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: 0,
        country: "",
    });

    const { billingAddress, setBillingAddress } = useContext(AppContext) as AppContextType;

    const savedBillingAddresses = [
        {
            id: 1,
            name: "John Doe",
            contact: "abc@gmail.com",
            address1: "123 Main St",
            address2: "",
            city: "Anytown",
            state: "CA",
            zip: 12345,
            country: "United States",
            isDefault: true,
            isActive: billingAddress?.id === 1,
        },
        {
            id: 2,
            name: "Jane Doe",
            contact: "abc@gmail.com",
            address1: "456 Main St",
            address2: "",
            city: "Anytown",
            state: "CA",
            zip: 12345,
            country: "United States",
            isDefault: false,
            isActive: billingAddress?.id === 2,
        }
    ]

    const handleAddBillingAddress = () => {
        setAddressData({
            name: "",
            contact: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: 0,
            country: "",
        });
        setShowAddAddressForm(true);
    }

    const handleEditAddress = (address: any) => {
        setAddressData(address);
        setShowAddAddressForm(true);
    }

    return (
    <>
        {showAddAddressForm && <AddAddressForm addressData={addressData} setAddressData={setAddressData} setShowAddAddressForm={setShowAddAddressForm} />}
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Billing Address</h1>
                <p className="text-sm mt-1 text-[#999]">Manage your billing address.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={() => handleAddBillingAddress()} variant="outline" className="text-[#000000]">
                    <Plus className="w-4 h-4" />
                    Add Address
                </Button>
            </div>
        </div>

        <div className="w-full mt-5 gap-4 grid grid-cols-3 ">
            {savedBillingAddresses.length === 0 && <div onClick={() => handleAddBillingAddress()} className="p-6 bg-[#1A1A1A] rounded-lg text-[#999] h-60 col-span-1 cursor-pointer hover:border-[#414141] border border-[#262626] flex item-center justify-center">
                Add a new billing address
            </div>}
            {savedBillingAddresses.map((address) => (
                <div key={address.id} onClick={() => setBillingAddress(address)} className={`p-4 relative bg-[#1A1A1A] rounded-lg h-60 col-span-1 border cursor-pointer ${address.isActive ? "text-[#ededed]" : "border-[#262626] hover:border-[#414141] text-[#999]"}`}>
                    {address.isDefault && <div className="absolute text-sm top-0 right-0 flex items-center gap-2 bg-[#3B82F6] rounded-bl-lg rounded-tr-lg px-2 py-1 text-[#ededed]">
                        <Star className="w-3 h-3" />
                        <span>Primary</span>
                    </div>}
                    <h2 className="text-lg font-semibold mb-1">{address.name}</h2>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <p className="text-sm">{address.contact}</p>
                    </div>
                    <div className="flex items-start gap-3 mt-4 bg-[#262626] rounded-lg py-2 px-3">
                        <MapPin className="w-5 h-5" />
                        <div>
                            <p className="">{address.address1}</p>
                            <p className="">{address.address2}</p>
                            <p className="">{address.city}, {address.state} {address.zip}</p>
                            <p className="">{address.country}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <Button onClick={() => handleEditAddress(address)} variant="outline" size="sm" className="text-[#000000] bg-[#ededed] hover:bg-[#ededed]/80 ms-auto">Edit</Button>
                        <Button variant="outline" size="sm" className="text-[#ededed] bg-[#dc5353] hover:bg-[#dc5353]/80 hover:text-[#ededed] border-none">Delete</Button>
                    </div>
                </div>
            ))}
        </div>
    </>
    )
}
export default SubPaymentMethods