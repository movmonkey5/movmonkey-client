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
        <div className="flex justify-between py-2">
            <div className="text-[16px] md:text-lg max-w-[70%]">{title}</div>
            <div className="text-lg font-medium md:font-semibold">{content}</div>
        </div>
    );
};

export default OverviewItem;