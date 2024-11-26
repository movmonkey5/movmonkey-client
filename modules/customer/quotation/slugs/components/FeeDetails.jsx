import React, { useEffect, useState } from 'react';
import useStore from "@/store";

const FeeDetails = ({ job }) => {

    const [currency, setCurrency] = useState("$");

    // Get user from store using the hook directly
    const user = useStore((state) => state.user);

    useEffect(() => {
        if (user?.currencySymbol) {
            setCurrency(user.currencySymbol);
        }
    }, [user]);

    return (
        <div className="w-full hover:scale-95 bg-primary/10 rounded-lg shadow-md transition-all duration-300 ease-in-out">
            <h1 className="text-lg font-semibold rounded-t-lg bg-primary/60 p-4">Detail Fee Fields</h1>
            <div className="flex flex-col bg-primary/10 px-4 py-2">
                <div className="flex justify-between py-2">
                    <p className="text-[16px] md:text-lg max-w-[70%]">Quotation Validity</p>
                    <p className="text-lg font-medium md:font-semibold">{job.quotation_validity} days</p>
                </div>
                <hr />
                <div className="flex justify-between py-2">
                    <p className="text-[16px] md:text-lg max-w-[70%]">Subtotal</p>
                    <p className="text-lg font-medium md:font-semibold">
                        <small> {currency}</small> {job.subtotal}
                    </p>
                </div>
                <hr />
                <div className="flex justify-between py-2">
                    <p className="text-[16px] md:text-lg max-w-[70%]">Extra Services Charge</p>
                    <p className="text-lg font-medium md:font-semibold">
                        <small> {currency}</small> {job.extra_services_charge}
                    </p>
                </div>
                <hr />
                <div className="flex justify-between py-2">
                    <p className="text-[16px] md:text-lg max-w-[70%]">Total VAT</p>
                    <p className="text-lg font-medium md:font-semibold">
                        <small> {currency}</small> {job.total_vat}
                    </p>
                </div>
                <hr />
                <div className="flex justify-between py-2">
                    <p className="text-[16px] md:text-lg max-w-[70%]">Total Amount</p>
                    <p className="text-lg font-medium md:font-semibold">
                        <small> {currency}</small> {job.total_amount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeeDetails;