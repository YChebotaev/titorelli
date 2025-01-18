"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { confirmAccountDeletion, cancelAccountDeletion } from '@/app/actions/accountActions'

export default function DeleteAccountConfirmation({
  params: {},
}: {
  params: Promise<{ token: string }>;
}) {
  const [isConfirming/*, setIsConfirming*/] = useState(false);
  const [isDeleted/*, setIsDeleted*/] = useState(false);
  const [error/*, setError*/] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirmDeletion = async () => {
    // setIsConfirming(true)
    // try {
    //   await confirmAccountDeletion(params.token)
    //   setIsDeleted(true)
    // } catch (err) {
    //   setError('An error occurred while deleting your account. Please try again.')
    // } finally {
    //   setIsConfirming(false)
    // }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    );
  }

  if (isDeleted) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Account Deleted</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Your account has been successfully deleted. We&apos;re sorry to see you
            go.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm Account Deletion</CardTitle>
          <CardDescription>
            Are you sure you want to delete your account?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This action cannot be undone. All your data will be permanently
            deleted.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Confirm Deletion</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDeletion}
                  disabled={isConfirming}
                >
                  {isConfirming ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
