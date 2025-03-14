"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface User {
  id: number;
  name: string;
  active: boolean;
}

interface TableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export function AdminMaestroTabla({ users, onEdit }: TableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB]">
            <TableHead className="w-[50px] font-medium">Activo</TableHead>
            <TableHead className="font-medium">Nombre</TableHead>
            <TableHead className="w-[80px] font-medium">Actualizar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox checked={user.active} className="border-[#D1D5DB]" />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Button className="bg-[#6366F1] hover:bg-[#4F46E5]" onClick={() => onEdit(user)}>
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                No hay escuelas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
