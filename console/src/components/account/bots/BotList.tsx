"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BotListItem from "./BotListItem";
import { AddBotModal } from "./AddBotModal";
import { ContentActions } from "../content-actions";
import { useGetBots } from "@/hooks/use-get-bots";
import { useParams } from "next/navigation";

export function BotList() {
  const { accountId } = useParams();
  const { data: bots } = useGetBots(String(accountId), {
    initialData: undefined,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (bots.length === 0) {
    return (
      <>
        <NoBots onAddBot={() => setIsAddModalOpen(true)} />
        <AddBotModal
          isOpen={isAddModalOpen}
          accountId={String(accountId)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="">
      <ContentActions>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Bot
        </Button>
      </ContentActions>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    State
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    Telemetry
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bots.map((bot) => (
                  <BotListItem key={bot.id} bot={bot} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddBotModal
        isOpen={isAddModalOpen}
        accountId={String(accountId)}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

function NoBots({ onAddBot }: { onAddBot: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-xl font-semibold mb-4">
        Не зарегистрировано ни одного бота
      </h2>
      <p className="text-gray-600 mb-6">
        Начните, добавив своего первого бота.
      </p>
      <Button onClick={onAddBot}>
        <PlusCircle className="mr-2 h-4 w-4" /> Добавить бота
      </Button>
    </div>
  );
}
