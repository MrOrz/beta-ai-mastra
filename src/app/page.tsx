"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { DrawerPanel } from "@/components/drawer/DrawerPanel";
import { BottomSheet } from "@/components/drawer/BottomSheet";

export default function CofactsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-warm text-text-main font-body">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ChatArea />
        <DrawerPanel />
      </main>

      {/* Mobile bottom sheet */}
      <BottomSheet />
    </div>
  );
}
