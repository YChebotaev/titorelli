import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { cancelAccountDeletion } from '@/app/actions/accountActions'

export default async function CancelDeleteAccount({
  params,
}: {
  params: { token: string };
}) {
  // const result = await cancelAccountDeletion(params.token)

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Deletion Cancelled</CardTitle>
          <CardDescription>
            Your account deletion request has been cancelled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {true ? (
            <p>
              Your account is safe and will not be deleted. You can continue
              using our services as usual.
            </p>
          ) : (
            <p>
              An error occurred while cancelling your account deletion. Please
              contact support if you need assistance.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button>Return to Home</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
