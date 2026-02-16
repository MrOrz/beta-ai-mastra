"use client";

import type { ChatMessage } from "@/lib/types";

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content:
      '這則訊息是真的嗎？「政府宣佈下個月起補助電動機車，最高可領 2 萬元。請點擊下方 Line 連結申請。」',
  },
  {
    id: "2",
    role: "ai",
    content: "",
    toolCalls: [
      { name: "getOfficialSubsidyPolicy", icon: "search" },
      { name: "checkMaliciousLinks", icon: "shield" },
    ],
  },
];

// Pre-built AI response paragraphs for the mock
const AI_PARAGRAPHS = [
  {
    type: "text" as const,
    html: '您好，感謝您的提問。關於「政府宣佈下個月起補助電動機車，最高可領 2 萬元」這則訊息，其中混合了部分真實政策與常見的詐騙手法，<strong class="font-medium text-red-600">極有可能是釣魚訊息</strong>。',
  },
  {
    type: "text" as const,
    html: "真實的狀況是，經濟部確實有電動機車補助計畫，但金額依縣市與車型而異，且官方申請絕不會透過 Line 連結進行。為了進一步查證，我將先搜尋目前的官方補助公告，並檢查該連結是否為已知的惡意網域。",
  },
  {
    type: "tool" as const,
    name: "getOfficialSubsidyPolicy",
    icon: "search",
  },
  {
    type: "text" as const,
    html: "好的，我已經取得了經濟部最新的補助公告資料。目前的補助方案中，對於重型等級電動機車，中央補助金額約為 7,000 元，即使加上地方政府加碼，通常也難以達到「齊頭式 2 萬元」的金額，這是一個明顯的疑點。",
  },
  {
    type: "text" as const,
    html: '接下來，我需要確認訊息中提到的「Line 申請連結」是否在我們的惡意連結資料庫中。',
  },
  {
    type: "tool" as const,
    name: "checkMaliciousLinks",
    icon: "shield",
  },
  {
    type: "text" as const,
    html: "檢查結果顯示，該連結指向一個近期被通報多次的釣魚網站，並非政府官方的 .gov.tw 網域。這證實了此訊息為詐騙企圖。",
  },
  {
    type: "text" as const,
    html: "綜合以上查核結果：<br/>1. <strong>金額不符：</strong> 官方補助並非齊頭式 2 萬元。<br/>2. <strong>申請管道錯誤：</strong> 政府不會透過 Line 連結受理申請。",
  },
];

function ToolBadge({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 pl-1">
      <span className="material-symbols-outlined text-gray-300 text-xs">
        subdirectory_arrow_right
      </span>
      <div className="tool-badge">
        <span className="material-symbols-outlined text-[14px] text-gray-500">
          {icon}
        </span>
        <span>{name}</span>
      </div>
    </div>
  );
}

export function ChatArea() {
  return (
    <section className="flex-1 flex flex-col bg-white min-w-0 relative overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 chat-container pb-0">
        {/* Timestamp */}
        <div className="flex justify-center">
          <span className="text-xs text-text-muted bg-gray-100 px-3 py-1 rounded-full">
            今天 10:23 AM
          </span>
        </div>

        {/* User message */}
        <div className="flex flex-col items-end">
          <div className="bg-bubble-user p-4 rounded-2xl rounded-tr-none md:rounded-tr-2xl max-w-[90%] md:max-w-[85%] text-text-main border border-gray-100 shadow-sm md:shadow-none">
            <p className="leading-relaxed">
              這則訊息是真的嗎？「政府宣佈下個月起補助電動機車，最高可領 2
              萬元。請點擊下方 Line 連結申請。」
            </p>
          </div>
          <span className="text-xs text-text-muted mt-1 mr-1">使用者輸入</span>
        </div>

        {/* AI message */}
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-yellow-700">
                smart_toy
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Cofacts AI Agent
            </span>
          </div>
          <div className="w-full text-text-main leading-7 text-sm max-w-none space-y-4">
            {AI_PARAGRAPHS.map((item, idx) => {
              if (item.type === "tool") {
                return (
                  <ToolBadge
                    key={idx}
                    name={item.name!}
                    icon={item.icon!}
                  />
                );
              }
              return (
                <p
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: item.html! }}
                />
              );
            })}

            {/* Feedback buttons */}
            <div className="flex items-center gap-3 pt-2 mt-4 border-t border-gray-100">
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
                <span className="material-symbols-outlined text-[18px]">
                  thumb_up
                </span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
                <span className="material-symbols-outlined text-[18px]">
                  thumb_down
                </span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100 ml-auto">
                <span className="material-symbols-outlined text-[18px]">
                  content_copy
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 bg-white shrink-0 z-10">
        <div className="relative rounded-xl shadow-sm border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 p-3 pr-12 min-h-[50px] max-h-32 resize-none text-sm"
            placeholder="詢問後續問題或要求修改..."
          />
          <button className="absolute right-2 bottom-2 p-1.5 bg-primary text-black rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400">
            AI 可能會犯錯，請務必查核事實。
          </span>
        </div>
      </div>
    </section>
  );
}
