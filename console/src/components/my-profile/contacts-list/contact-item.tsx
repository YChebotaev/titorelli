import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { type FC } from "react";
import { ContactType } from "./contacts-list";

type Contact = {
  id: string;
  type: ContactType;
  value: string;
  confirmed: boolean;
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

export const ContactItem: FC<{
  contact: Contact;
  canRemove: boolean;
  // onRemove(id: string): void;
}> = ({ contact, canRemove /*, onRemove*/ }) => {
  return (
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
            // onClick={() => onRemove(contact.id)}
            disabled={!canRemove}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};
