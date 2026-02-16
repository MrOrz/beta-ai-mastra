"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ResponseEditor } from "./ResponseEditor";
import { SourceLinkage } from "./SourceLinkage";

type Tab = "editor" | "sources";
type SheetState = "closed" | "half" | "full";

export function BottomSheet() {
  const [state, setState] = useState<SheetState>("closed");
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const isOpen = state !== "closed";

  const open = useCallback(() => setState("full"), []);
  const close = useCallback(() => setState("closed"), []);

  // Handle drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragStartY === null) return;
      setDragCurrentY(e.touches[0].clientY);
    },
    [dragStartY]
  );

  const handleTouchEnd = useCallback(() => {
    if (dragStartY === null || dragCurrentY === null) {
      setDragStartY(null);
      setDragCurrentY(null);
      return;
    }

    const diff = dragCurrentY - dragStartY;

    if (diff > 100) {
      // Dragged down significantly
      if (state === "full") {
        setState("half");
      } else {
        setState("closed");
      }
    } else if (diff < -100) {
      // Dragged up significantly
      if (state === "half") {
        setState("full");
      }
    }

    setDragStartY(null);
    setDragCurrentY(null);
  }, [dragStartY, dragCurrentY, state]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const heightClass =
    state === "full" ? "h-[85vh]" : state === "half" ? "h-[50vh]" : "h-0";

  return (
    <>
      {/* Floating button — only visible on mobile */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button
            onClick={open}
            className="bg-primary text-black font-medium py-3 px-6 rounded-full shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              edit_note
            </span>
            <span>編輯回應草稿</span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-[1px]"
          onClick={close}
        />
      )}

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 w-full z-50 md:hidden flex flex-col bg-[#F5F5F5] rounded-t-2xl bottom-sheet-shadow transition-all duration-300 ease-out ${heightClass} ${isOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center pt-3 pb-1 cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex w-full border-b border-gray-200 bg-[#F5F5F5] rounded-t-2xl">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-4 text-center font-bold relative ${activeTab === "editor"
                ? "text-gray-900"
                : "text-gray-400 font-medium"
              }`}
          >
            回應編輯器
            {activeTab === "editor" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[3px] bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`flex-1 py-4 text-center relative ${activeTab === "sources"
                ? "text-gray-900 font-bold"
                : "text-gray-400 font-medium"
              }`}
          >
            資料關聯
            {activeTab === "sources" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[3px] bg-primary rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {activeTab === "editor" ? <ResponseEditor /> : <SourceLinkage />}
        </div>
      </div>
    </>
  );
}
