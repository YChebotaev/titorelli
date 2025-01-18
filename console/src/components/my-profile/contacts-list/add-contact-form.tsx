"use client";

import { useActionState, useState, type FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/form/phone-input";
import { addContact } from "@/server-actions/profile/contacts/add-contact";
import { ContactType } from "./contacts-list";
import { FieldError } from "@/components/form/field-error";
import { addContactFormInitialState } from "@/constants";

export type AddConcactFormState = {
  success: boolean | null;
  defaultValues: {
    type: string;
    value: string;
  };
  errors: {
    type?: string;
    value?: string;
  };
};

export const AddContactForm: FC = () => {
  const [{ defaultValues, errors }, formAction] =
    useActionState<AddConcactFormState>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addContact as any,
      addContactFormInitialState,
    );
  const [newContactType, setNewContactType] = useState<ContactType>("email");
  // const [newContactValue, setNewContactValue] = useState("");

  const renderInput = () => {
    switch (newContactType) {
      case "email":
        return (
          <Input
            type="email"
            name="value"
            defaultValue={defaultValues.value}
            // onChange={(e) => setNewContactValue(e.target.value)}
            placeholder="Введите email для связи"
          />
        );
      case "phone":
        return (
          <PhoneInput
            defaultValue={defaultValues.value}
            name="value"
            placeholder="Введите номер телефона для связи"
            // onChange={(e) => {
            //   setNewContactValue((e.target as HTMLInputElement).value);
            // }}
          />
        );
      case "telegram":
        return (
          <Input
            value={defaultValues.value}
            name="value"
            // onChange={(e) => setNewContactValue(e.target.value)}
            placeholder="Введите telegram username для связи"
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      action={formAction}
      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
    >
      <div>
        <Select
          name="type"
          value={newContactType}
          onValueChange={(value: ContactType) => setNewContactType(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Выберите тип контакта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Телефон</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
          </SelectContent>
        </Select>
        <FieldError field="type" errors={errors} />
      </div>

      <div className="flex-grow">
        {renderInput()}
        <FieldError field="value" errors={errors} />
      </div>

      <Button
        type="submit"
        variant="outline"
        // disabled={newContactValue.trim() === ""}
        // onClick={() => {
        //   onAdd(newContactType, newContactValue);

        //   setNewContactValue("");
        // }}
      >
        Добавить контакт
      </Button>
    </form>
  );
};
