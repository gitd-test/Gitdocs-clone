import { useContext, useState } from "react";
import { AppContext, AppContextType } from "../../contexts/AppContext";
import AddAddressForm from "./AddAddressForm";

interface AddressData {
    name: string;
    contact: string;
    address: string;
    country: string;
}

const SubPaymentMethods = () => {

    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [addressData, setAddressData] = useState<AddressData>({
        name: "",
        contact: "",
        address: "",
        country: "",
    });

    const { billingAddress, setBillingAddress } = useContext(AppContext) as AppContextType;

    const savedBillingAddresses = [
        {
            id: 1,
            name: "John Doe",
            contact: "abc@gmail.com",
            address: "123 Main St, Anytown",
            country: "United States",
            isDefault: true,
            isActive: billingAddress?.id === 1,
        },
        {
            id: 2,
            name: "Jane Doe",
            contact: "abc@gmail.com",
            address: "456 Main St, Anytown",
            country: "United States",
            isDefault: false,
            isActive: billingAddress?.id === 2,
        }
    ]

    const handleAddBillingAddress = () => {
        setAddressData({
            name: "",
            contact: "",
            address: "",
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
        <h1 className="text-lg font-semibold">Billing Address</h1>
        <p className="text-sm mt-1 text-[#999]">Manage your billing address.</p>

        <div className="w-full mt-5 gap-4 grid grid-cols-3 ">
            <div onClick={() => handleAddBillingAddress()} className="p-6 bg-[#1A1A1A] rounded-lg text-[#999] h-48 col-span-1 cursor-pointer hover:border-[#414141] border border-[#262626] flex item-center justify-center">
                Add a new billing address
            </div>
            {savedBillingAddresses.map((address) => (
                <div key={address.id} onClick={() => setBillingAddress(address)} className={`p-6 bg-[#1A1A1A] rounded-lg h-48 col-span-1 border flex flex-col gap-2 cursor-pointer ${address.isActive ? "text-[#ededed]" : "border-[#262626] hover:border-[#414141] text-[#999]"}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold mb-1">{address.isDefault ? "Primary Address" : "Secondary Address"}</h2>
                        <button onClick={() => handleEditAddress(address)} className="text-sm text-[#999] underline hover:text-[#ededed]">Edit</button>
                    </div>
                    <p className="text-sm w-full flex justify-between">
                        <span>Name:</span> 
                        <span className="font-normal">{address.name}</span>
                    </p>
                    <p className="text-sm w-full flex justify-between">
                        <span>Contact:</span> 
                        <span className="font-normal">{address.contact}</span>
                    </p>
                    <p className="text-sm w-full flex justify-between">
                        <span>Address:</span> 
                        <span className="font-normal">{address.address}</span>
                    </p>
                    <p className="text-sm w-full flex justify-between">
                        <span>Country:</span> 
                        <span className="font-normal">{address.country}</span>
                    </p>
                </div>
            ))}
        </div>
    </>
    )
}
export default SubPaymentMethods