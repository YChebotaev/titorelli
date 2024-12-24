import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { SigninForm } from "@/components/authorization/signin-form";
import { signin } from "@/server-actions/authorization/signin";

export default async function SigninPage() {
  return (
    <AuthorizationLayout coverImageVariant="signin">
      <SigninForm action={signin} />
    </AuthorizationLayout>
  );
}