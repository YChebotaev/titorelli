import { RestoreForm } from "@/components/authorization/restore-form";
import { AuthorizationLayout } from "@/layouts/authorization-layout";
import { restore } from "@/server-actions/authorization/restore";

export default function RestorePage() {
  return (
    <AuthorizationLayout coverImageVariant="restore">
      <RestoreForm action={restore} />
    </AuthorizationLayout>
  )
}
