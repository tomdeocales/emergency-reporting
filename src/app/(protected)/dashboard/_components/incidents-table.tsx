"use client";

import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IncidentRecord } from "@/types/incidents";

export function IncidentsTable({ incidents }: { incidents: IncidentRecord[] }) {
  const formatted = useMemo(
    () =>
      incidents.map((incident) => ({
        ...incident,
        reportedLabel: new Date(incident.reportedAt).toLocaleString(undefined, {
          hour12: false,
        }),
      })),
    [incidents],
  );

  return (
    <div className="rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Reported</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formatted.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell className="font-medium">{incident.id}</TableCell>
              <TableCell>{incident.reportedLabel}</TableCell>
              <TableCell>{incident.type}</TableCell>
              <TableCell>{incident.status}</TableCell>
              <TableCell className="text-right">{incident.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
