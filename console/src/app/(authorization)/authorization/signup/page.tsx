import { SignupForm } from "@/components/authorization/signup-form";
import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { signup } from "@/server-actions/authorization/signup";

export default function SignupPage() {
  return (
    <AuthorizationLayout coverImageVariant="signup">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SignupForm action={signup as any} />
    </AuthorizationLayout>
  );
}
