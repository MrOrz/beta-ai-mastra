"use client";

import { useState } from "react";
import { ResponseEditor } from "./ResponseEditor";
import { SourceLinkage } from "./SourceLinkage";

type Tab = "editor" | "sources";

export function DrawerPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");

  return (
    <aside className="hidden md:flex w-[380px] bg-white border-l border-border-subtle flex-col shrink-0 shadow-lg z-10">
      {/* Tabs */}
      <div className="flex border-b border-border-subtle bg-white">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "editor"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-text-muted hover:text-text-main hover:bg-gray-50"
            }`}
        >
          回應編輯器
        </button>
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "sources"
              ? "text-gray-900 font-bold"
              : "text-text-muted hover:text-text-main hover:bg-gray-50"
            }`}
        >
          資料關聯
          {activeTab === "sources" && (
            <span className="absolute bottom-0 left-1/4 w-1/2 h-[3px] bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "editor" ? <ResponseEditor /> : <SourceLinkage />}
    </aside>
  );
}
