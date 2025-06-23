"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
      <div className="w-3/4 max-w-sm bg-white shadow-md p-6">
        <button onClick={onClose} className="text-gray-600 mb-4 flex items-center gap-2">
          <X size={20} /> Cerrar
        </button>
        <SidebarNav onSelect={onClose} />
      </div>
    </div>
  );
}
