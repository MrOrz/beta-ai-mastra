"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopilotKit } from "@copilotkit/react-core";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { DrawerPanel } from "@/components/drawer/DrawerPanel";
import { BottomSheet } from "@/components/drawer/BottomSheet";

interface MainLayoutProps {
  threadId?: string;
}

export function MainLayout({ threadId }: MainLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Bump this to force Sidebar to re-fetch threads after a new message
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewThread = () => {
    router.push("/");
    setRefreshKey((k) => k + 1);
  };

  const handleSelectThread = (id: string) => {
    router.push(`/c/${id}`);
    setSidebarOpen(false);
  };

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="cofactsWriter"
      threadId={threadId}
    >
      <div className="h-screen flex flex-col overflow-hidden bg-bg-warm text-text-main font-body">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeThreadId={threadId}
            onSelectThread={handleSelectThread}
            onNewThread={handleNewThread}
            refreshKey={refreshKey}
          />
          <ChatArea />
          <DrawerPanel />
        </main>

        {/* Mobile bottom sheet */}
        <BottomSheet />
      </div>
    </CopilotKit>
  );
}
