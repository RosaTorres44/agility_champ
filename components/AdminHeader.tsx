"use client";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  showForm: boolean;
  onToggleForm: () => void;
}

export function AdminHeader({ title, showForm, onToggleForm }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <Button
        className="bg-[#6366F1] hover:bg-[#4F46E5]"
        onClick={onToggleForm}
      >
        {showForm ? "Cancelar" : `Agregar Nueva ${title}`}
      </Button>
    </div>
  );
}