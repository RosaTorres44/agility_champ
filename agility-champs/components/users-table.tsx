'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
}

export function UsersTable({ users }: { users: User[] }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB]">
            <TableHead className="w-[50px] font-medium">Active</TableHead>
            <TableHead className="font-medium">Nombre</TableHead>
            <TableHead className="font-medium">Email</TableHead>
            <TableHead className="font-medium">Role</TableHead>
            <TableHead className="w-[80px] font-medium">Actualizar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={user.active}
                  onCheckedChange={() => {}}
                  className="border-[#D1D5DB] checked:border-[#6366F1] checked:bg-[#6366F1]"
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-[#6B7280]">{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">
                Actualizar
              </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

