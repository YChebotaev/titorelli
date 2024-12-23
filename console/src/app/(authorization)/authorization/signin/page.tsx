import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { SigninForm } from "@/components/authorization/signin-form";
import { login } from "@/server-actions/authorization/login";

export default async function SigninPage() {
  return (
    <AuthorizationLayout coverImageVariant="signin">
      <SigninForm action={login} />
    </AuthorizationLayout>
  );
}
