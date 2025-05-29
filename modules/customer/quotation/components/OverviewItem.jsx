import React from "react";

const formatPreferredDay = (value) => {
    if (!value) return "N/A";
    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];
    return days.filter((day) => value.toLowerCase().includes(day)).join(", ");
};

const OverviewItem = ({ title, value, extraValue }) => {
    let content = value;

    if (title === "Preferred Day") {
        content = formatPreferredDay(value);
    } else if (typeof value === "boolean") {
        content = value ? "Yes" : "No";
    } else if (typeof value === "string") {
        content = value.split("_").join(" ").toUpperCase();
    } else if (value === undefined || value === null) {
        content = "";
    }

    if (extraValue) {
        content += ` ${extraValue.toUpperCase()}`;
    }

    return (
        <div className="flex justify-between items-center py-2 px-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 rounded-md group">
            <div className="text-sm font-medium text-gray-700 max-w-[55%] leading-tight">
                {title}
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-3 py-1.5 rounded-md border border-gray-200 group-hover:border-green-300 transition-all duration-300 min-w-fit max-w-[40%]">
                <div className="text-sm font-semibold text-gray-900 text-center leading-tight break-words">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default OverviewItem;