import Layout from "@/components/my-profile/layout";
// import UserAvatar from "@/components/my-profile/user-avatar";
// import EditableUsername from "@/components/my-profile/editable-username";
import { ContactsList } from "@/components/my-profile/contacts-list";
import AccountsList from "@/components/my-profile/accounts-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UserProfile() {
  // This data would typically come from your backend
  const initialData = {
    avatar: "/placeholder.svg?height=128&width=128",
    username: "johndoe",
    contacts: [
      { id: "1", type: "email", value: "john@example.com", confirmed: true },
      { id: "2", type: "phone", value: "+1234567890", confirmed: false },
      { id: "3", type: "telegram", value: "@johndoe", confirmed: true },
    ],
    accounts: [
      { id: "1", name: "Project A", ownerUsername: "alice", role: "editor" },
      { id: "2", name: "Project B", ownerUsername: "bob", role: "viewer" },
    ],
  };

  return (
    <Layout>
      <div className="container max-w-[1080px] px-5 md:px-0 mx-auto">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          {/* <UserAvatar initialAvatar={initialData.avatar} /> */}
          {/* <EditableUsername initialUsername={initialData.username} /> */}
          <AccountsList />
          <ContactsList initialContacts={initialData.contacts} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="font-bold">
                Remove Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
