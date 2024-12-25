"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import { useMaskito } from "@maskito/react";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
} from "lucide-react";
import metadata from "libphonenumber-js/min/metadata";

type ContactType = "email" | "phone" | "telegram";

interface Contact {
  id: string;
  type: ContactType;
  value: string;
  confirmed: boolean;
}

export default function ContactsList({
  initialContacts,
}: {
  initialContacts: Contact[];
}) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [newContactType, setNewContactType] = useState<ContactType>("email");
  const [newContactValue, setNewContactValue] = useState("");

  const phoneMaskOptions = maskitoPhoneOptionsGenerator({
    countryIsoCode: "US",
    metadata,
  });

  const inputRef = useMaskito({
    options: newContactType === "phone" ? phoneMaskOptions : undefined,
  });

  const addContact = () => {
    if (newContactValue) {
      setContacts([
        ...contacts,
        {
          id: Date.now().toString(),
          type: newContactType,
          value: newContactValue,
          confirmed: false,
        },
      ]);
      setNewContactValue("");
    }
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    if (canRemoveContact(id, updatedContacts)) {
      setContacts(updatedContacts);
    }
  };

  const canRemoveContact = (id: string, updatedContacts: Contact[]) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return false;

    const remainingContacts = updatedContacts.filter(
      (c) => c.type === contact.type,
    );

    if (!contact.confirmed) return true;
    if (contact.type === "telegram") return true;
    if (remainingContacts.length === 0) return false;
    if (remainingContacts.length === 1 && !remainingContacts[0].confirmed)
      return false;

    return true;
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "phone":
        return <Phone className="w-5 h-5" />;
      case "telegram":
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-muted p-6 rounded-lg space-y-6">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="hidden md:grid md:grid-cols-[1fr_3fr_1fr_1fr] gap-4 font-medium text-sm text-muted-foreground mb-2">
        <div>Method</div>
        <div>Details</div>
        <div>Verification</div>
        <div>Actions</div>
      </div>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-background p-4 rounded-md">
            <div className="md:grid md:grid-cols-[1fr_3fr_1fr_1fr] md:gap-4 md:items-center">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                {getContactIcon(contact.type)}
                <span className="capitalize md:hidden font-medium text-sm text-muted-foreground">
                  Method:
                </span>
                <span className="capitalize">{contact.type}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span className="md:hidden font-medium text-sm text-muted-foreground">
                  Details:{" "}
                </span>
                <span className="break-all">{contact.value}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span className="md:hidden font-medium text-sm text-muted-foreground">
                  Verification:{" "}
                </span>
                {contact.confirmed ? (
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="w-4 h-4 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-500">
                    <XCircle className="w-4 h-4 mr-1" /> Unverified
                  </span>
                )}
              </div>
              <div>
                <span className="md:hidden font-medium text-sm text-muted-foreground">
                  Actions:{" "}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  disabled={
                    !canRemoveContact(
                      contact.id,
                      contacts.filter((c) => c.id !== contact.id),
                    )
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Select
          value={newContactType}
          onValueChange={(value: ContactType) => setNewContactType(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
          </SelectContent>
        </Select>
        <Input
          ref={inputRef}
          value={newContactValue}
          onChange={(e) => setNewContactValue(e.target.value)}
          placeholder={`Enter ${newContactType}`}
          className="flex-grow"
        />
        <Button onClick={addContact}>Add Contact</Button>
      </div>
    </div>
  );
}
