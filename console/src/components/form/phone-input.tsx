"use client";

import { type FC } from "react";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { Input } from "@/components/ui/input";

const options = maskitoPhoneOptionsGenerator({
  countryIsoCode: "RU",
  metadata,
});

export const PhoneInput: FC<{
  id: string;
  type: "tel";
  name: string;
  defaultValue: string;
  placeholder: string;
  required?: boolean;
}> = ({ id, type, name, placeholder, defaultValue, required }) => {
  const maskedInputRef = useMaskito({ options });

  return (
    <Input
      ref={maskedInputRef}
      id={id}
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
    />
  );
};
