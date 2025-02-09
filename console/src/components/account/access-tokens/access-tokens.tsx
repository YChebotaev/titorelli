"use client";

import { useState, type FC } from "react";
import { ContentActions } from "../content-actions";
import { Button } from "@/components/ui/button";
import { TokenList } from "./tokens-list";
import { AddTokenModal } from "./add-token-modal";
import { TokenDisplayModal } from "./token-display-modal";
import { useGetTokens } from "@/hooks/use-get-tokens";
import { useParams } from "next/navigation";
import { useAddToken } from "@/hooks/use-add-token";
import { useRegenerateToken } from "@/hooks/use-regenerate-token";
import { useRevokeToken } from "@/hooks/use-revoke-token";

export const AccessTokens: FC = () => {
  const { accountId } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: tokens } = useGetTokens(String(accountId));
  const { mutateAsync: addTokenAsyncMutation } = useAddToken(String(accountId));
  const { mutate: revokeTokenMutation } = useRevokeToken(String(accountId));
  const { mutateAsync: regenerateTokenAsyncMutation } = useRegenerateToken(
    String(accountId),
  );

  const [displayedToken, setDisplayedToken] = useState<string | null>(null);

  const handleAddToken = async (name: string, description: string) => {
    const { token } = await addTokenAsyncMutation({ name, description });

    setDisplayedToken(token);
  };

  const handleRegenerateToken = async (tokenId: string) => {
    const { token } = await regenerateTokenAsyncMutation({ tokenId });

    setDisplayedToken(token);
  };

  const handleRevokeToken = (tokenId: string) => {
    revokeTokenMutation({ tokenId });
  };

  return (
    <div>
      <TokenList
        tokens={tokens}
        onRegenerateToken={handleRegenerateToken}
        onRevokeToken={handleRevokeToken}
      />
      <AddTokenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddToken={handleAddToken}
      />
      <TokenDisplayModal
        token={displayedToken}
        onClose={() => setDisplayedToken(null)}
      />
      <ContentActions>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Token</Button>
      </ContentActions>
    </div>
  );
};
