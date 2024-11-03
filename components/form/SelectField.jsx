"use client";

import Select from "react-select";

export default function SelectField({
  name,
  isDisabled = false,
  isSearchable = false,
  isClearable = false,
  isMulti = false,
  onChange,
  options,
  placeholder = "Select an option",
  value,
  defaultValue,
  isFocused = true,
}) {
  return (
    <Select
      name={name}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      isClearable={isClearable}
      isMulti={isMulti}
      options={options}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isFocused={isFocused}
      styles={{
        control: (baseStyles, { isFocused }) => ({
          ...baseStyles,
          boxShadow: "none",
          borderRadius: "9999px",
          padding: "1px",
          zIndex: "0",
          fontWeight: "500",
          fontWeight: "400",
          fontSize: "14px",
          borderColor: isFocused ? "#366935" : "#cbd5e1",
          ":hover": {
            borderColor: isFocused ? "#366935" : "#cbd5e1",
          },
        }),
        option: (_baseStyles, { isFocused }) => ({
          backgroundColor: isFocused ? "#366935" : "#fff",
          padding: "8px",
          color: isFocused ? "#fff" : "#366935",
          cursor: "default",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "white",
          zIndex: "9999",
        }),
        input: (baseStyles) => ({
          ...baseStyles,
          "input:focus": {
            boxShadow: "none",
          },
          zIndex: "0",
        }),
      }}
    />
  );
}
