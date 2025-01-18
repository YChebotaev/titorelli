import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { SigninForm } from "@/components/authorization/signin-form";
import { signin } from "@/server-actions/authorization/signin";

export default async function SigninPage() {
  return (
    <AuthorizationLayout coverImageVariant="signin">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SigninForm action={signin as any} />
    </AuthorizationLayout>
  );
}
