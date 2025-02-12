"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetModels } from "@/hooks/use-get-models";
import { useParams } from "next/navigation";
import { ModelsEmpty } from "./models-empty";

export function ModelsList() {
  const { accountId } = useParams();
  const { data: models } = useGetModels(String(accountId), {
    initialData: undefined,
  });
  const isEmpty = models.length === 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isEmpty ? (
          <ModelsEmpty />
        ) : (
          models.map((model) => (
            <TableRow key={model.name}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {model.description}
              </TableCell>
              <TableCell>{model.createdAt}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
