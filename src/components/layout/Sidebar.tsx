"use client";

import { useEffect, useState } from "react";

type Thread = {
  id: string;
  title?: string;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "剛剛";
  if (diffMin < 60) return `${diffMin} 分鐘前`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小時前`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} 天前`;

  return date.toLocaleDateString("zh-TW");
}

export function Sidebar({
  isOpen,
  onClose,
  activeThreadId,
  onSelectThread,
  onNewThread,
  refreshKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeThreadId?: string;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  refreshKey: number;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchThreads() {
      setLoading(true);
      try {
        const res = await fetch("/api/threads");
        const data = await res.json();
        if (!cancelled) {
          setThreads(data.threads ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchThreads();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-border-subtle flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* New task button */}
        <div className="p-4">
          <button
            onClick={onNewThread}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-primary font-medium py-2.5 px-4 rounded-lg transition-colors border border-primary"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>新查核任務</span>
          </button>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {loading ? (
            <div className="px-3 py-4 text-sm text-text-muted text-center">
              載入中…
            </div>
          ) : threads.length === 0 ? (
            <div className="px-3 py-4 text-sm text-text-muted text-center">
              尚無對話紀錄
            </div>
          ) : (
            <>
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
                對話紀錄
              </div>
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <a
                    key={thread.id}
                    className={`flex flex-col p-3 rounded-lg group transition-colors cursor-pointer ${isActive
                        ? "bg-primary/10 text-text-main"
                        : "hover:bg-gray-50 text-text-muted"
                      }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectThread(thread.id);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium truncate text-left ${!isActive && "group-hover:text-text-main"
                          }`}
                      >
                        {thread.title || thread.id.slice(0, 8) + "…"}
                      </div>
                      <div className="text-xs text-text-muted truncate mt-0.5 text-left">
                        {formatRelativeTime(thread.updatedAt)}
                      </div>
                    </div>
                  </a>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-gray-50">
          <div className="flex items-center gap-3 text-sm text-text-muted hover:text-text-main cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span>使用教學與支援</span>
          </div>
        </div>
      </aside>
    </>
  );
}
