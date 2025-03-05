"use client";

import { useEffect, useState } from "react";
import AddAddressForm from "./AddAddressForm";
import { Star, Mail, MapPin, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
interface AddressData {
    name: string;
    contact: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: number | undefined;
    country: string;
    taxId: string;
    taxIdType: string;
    isPrimary: boolean;
}

const SubPaymentMethods = () => {

    const { user } = useUser();

    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [addressData, setAddressData] = useState<AddressData>({
        name: "",
        contact: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: undefined,
        country: "",
        taxId: "",
        taxIdType: "",
        isPrimary: false,
    });

    const [savedBillingAddresses, setSavedBillingAddresses] = useState<AddressData[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchBillingAddress = async () => {

            const response = await axios.patch("/api/fetch/subscriptiondata?query=billingAddress", 
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user?.id}`,
                    },
                }
            );
            if (response.data.data) {
                setSavedBillingAddresses(response.data.data.billingAddress);
            } else {
                setSavedBillingAddresses([]);
            }
        }
        fetchBillingAddress();
    }, [user]);

    const handleAddBillingAddress = () => {
        setAddressData({
            name: "",
            contact: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: undefined,
            country: "",
            taxId: "",
            taxIdType: "",
            isPrimary: false,
        });
        setShowAddAddressForm(true);
    }

    const handleEditAddress = (address: any) => {
        setAddressData(address);
        setIsEditing(true);
        setShowAddAddressForm(true);
    }

    const finalAddAddress = async () => {
        if (savedBillingAddresses.length === 0) {
            setAddressData({...addressData, isPrimary: true});
        } else {
            setAddressData({...addressData, isPrimary: false});
        }
    }

    const handleAddAddress = async () => {
        await finalAddAddress();
        const response = await axios.post("/api/fetch/subscriptiondata?query=addBillingAddress", {
            addressData: addressData,
        }, {
            headers: {
                Authorization: `Bearer ${user?.id}`,
            },
        });

        if (savedBillingAddresses.length > 0) {
            setSavedBillingAddresses([...savedBillingAddresses, response.data.data]);
        } else {
            setSavedBillingAddresses([response.data.data]);
        }
    }

    const handleUpdateAddress = async () => {
        const response = await axios.post("/api/fetch/subscriptiondata?query=updateBillingAddress", {
            addressData,
        }, {
            headers: {
                Authorization: `Bearer ${user?.id}`,
            },
        });

        setSavedBillingAddresses(response.data.data);
    }

    return (
    <>
        {showAddAddressForm && <AddAddressForm handleAddAddress={handleAddAddress} handleUpdateAddress={handleUpdateAddress} addressData={addressData} setAddressData={setAddressData} setShowAddAddressForm={setShowAddAddressForm} isEditing={isEditing} setIsEditing={setIsEditing} />}
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
            {(savedBillingAddresses?.length === 0) && <div onClick={() => handleAddBillingAddress()} className="p-6 bg-[#1A1A1A] rounded-lg text-[#999] h-60 col-span-1 cursor-pointer hover:border-[#414141] border border-[#262626] flex item-center justify-center">
                Add a new billing address
            </div>}
            {savedBillingAddresses.map((address: any) => (
                <div key={address.name} className={`p-4 relative bg-[#1A1A1A] rounded-lg h-60 col-span-1 border cursor-pointer ${address.isPrimary ? "border-[#3B82F6]" : "border-[#262626] hover:border-[#414141]"}`}>
                    {address.isPrimary && <div className="absolute text-sm top-0 right-0 flex items-center gap-2 bg-[#3B82F6] rounded-bl-lg rounded-tr-lg px-2 py-1 text-[#ededed]">
                        <Star className="w-3 h-3" />
                        <span>Primary</span>
                    </div>}
                    <h2 className="text-lg font-semibold mb-1">{address.name}</h2>
                    <div className="flex items-center gap-2 text-[#999]">
                        <Mail className="w-4 h-4" />
                        <p className="text-sm">{address.contact}</p>
                    </div>
                    <div className="flex items-start gap-3 mt-4 bg-[#262626] rounded-lg py-2 px-3">
                        <MapPin className="w-5 h-5" />
                        <div>
                            <p>{address.address1}, {address.address2}</p>
                            <p>{address.city}, {address.state} {address.zip}</p>
                            <p className="text-[#999]">{address.country}</p>
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