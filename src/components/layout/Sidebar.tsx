"use client";

import type { Session } from "@/lib/types";

const MOCK_SESSIONS: { label: string; items: Session[] }[] = [
  {
    label: "進行中",
    items: [
      {
        id: "1",
        title: "Line: 免費 iPhone 詐騙",
        subtitle: "剛剛編輯 • 協作中",
        active: true,
      },
      {
        id: "2",
        title: "謠言：選舉日期變更",
        subtitle: "2 小時前",
      },
    ],
  },
  {
    label: "近期紀錄",
    items: [
      {
        id: "3",
        title: "健康：檸檬水療法",
        subtitle: "昨天",
      },
    ],
  },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
          <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-primary font-medium py-2.5 px-4 rounded-lg transition-colors border border-primary">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>新查核任務</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {MOCK_SESSIONS.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
                {group.label}
              </div>
              {group.items.map((session) => (
                <a
                  key={session.id}
                  className={`flex flex-col p-3 rounded-lg group transition-colors cursor-pointer ${session.active
                      ? "bg-primary/10 text-text-main"
                      : "hover:bg-gray-50 text-text-muted"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium truncate text-left ${!session.active && "group-hover:text-text-main"
                        }`}
                    >
                      {session.title}
                    </div>
                    <div className="text-xs text-text-muted truncate mt-0.5 text-left">
                      {session.subtitle}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ))}
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
