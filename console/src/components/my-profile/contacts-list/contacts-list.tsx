import { ContactItem } from "./contact-item";
import { AddContactForm } from "./add-contact-form";

export type ContactType = "email" | "phone" | "telegram";

interface Contact {
  id: string;
  type: ContactType;
  value: string;
  confirmed: boolean;
}

export function ContactsList({
  initialContacts,
}: {
  initialContacts: Contact[];
}) {
  const contacts = initialContacts;

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
          <ContactItem
            key={contact.id}
            contact={contact}
            canRemove={canRemoveContact(
              contact.id,
              contacts.filter((c) => c.id !== contact.id),
            )}
          />
        ))}
      </div>
      <AddContactForm />
    </div>
  );
}
