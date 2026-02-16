"use client";

import { useState } from "react";
import type { ResponseCategory } from "@/lib/types";

const CATEGORIES: {
  key: ResponseCategory;
  label: string;
  icon: string;
  activeClass: string;
  iconColor: string;
}[] = [
    {
      key: "NOT_ARTICLE",
      label: "不在查證範圍",
      icon: "warning",
      activeClass: "bg-white shadow-sm text-yellow-600 border border-gray-200",
      iconColor: "text-yellow-500",
    },
    {
      key: "RUMOR",
      label: "含有不實訊息",
      icon: "cancel",
      activeClass: "bg-white shadow-sm text-red-600 border border-gray-200",
      iconColor: "text-red-500",
    },
    {
      key: "REAL",
      label: "含有正確訊息",
      icon: "check_circle",
      activeClass: "bg-white shadow-sm text-green-600 border border-gray-200",
      iconColor: "text-green-500",
    },
    {
      key: "OPINIONATED",
      label: "含有個人意見",
      icon: "comment",
      activeClass: "bg-white shadow-sm text-blue-600 border border-gray-200",
      iconColor: "text-blue-500",
    },
  ];

const DEFAULT_RESPONSE = `🚫 含有不實訊息
關於「政府補助電動機車2萬元」的訊息，部分內容有誤且連結可疑。
1. 【補助金額不符】經濟部工業局的補助金額並非齊頭式2萬元，需依據車型與縣市加碼而定。
2. 【釣魚連結警示】政府申請平台網址通常為 .gov.tw 結尾。訊息中的 Line 連結並非官方管道，請勿點擊以免個資外洩。`;

const DEFAULT_REFS = `[1] 官方補助專區
https://www.lev.org.tw/subsidy/default.aspx
[2] 查核報告 - 類似詐騙手法
https://www.mygopen.com/2023/12/scam-link.html`;

export function ResponseEditor() {
  const [category, setCategory] = useState<ResponseCategory>("RUMOR");
  const [content, setContent] = useState(DEFAULT_RESPONSE);
  const [refs, setRefs] = useState(DEFAULT_REFS);

  const charCount = content.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-bg-warm">
        {/* Version selector */}
        <div className="flex items-center justify-between mb-2">
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors">
              <span>版本 8 (目前)</span>
              <span className="material-symbols-outlined text-sm">
                arrow_drop_down
              </span>
            </button>
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              cloud_done
            </span>
            已儲存
          </span>
        </div>

        {/* Category buttons — desktop grid, mobile horizontal scroll */}
        <div className="hidden md:flex flex-row gap-1 p-1 bg-gray-100 rounded-lg w-full overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex-1 min-w-[80px] whitespace-nowrap py-2 text-[10px] font-bold text-center rounded transition-all flex flex-col items-center justify-center gap-0.5 ${category === cat.key
                  ? cat.activeClass
                  : "text-gray-500 hover:bg-white/80"
                }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${category === cat.key ? "" : cat.iconColor
                  }`}
              >
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile category pills */}
        <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${isActive
                    ? cat.key === "RUMOR"
                      ? "border-red-500 bg-red-600 text-white font-bold shadow-sm"
                      : cat.key === "REAL"
                        ? "border-teal-500 bg-teal-600 text-white font-bold shadow-sm"
                        : cat.key === "OPINIONATED"
                          ? "border-blue-500 bg-blue-600 text-white font-bold shadow-sm"
                          : "border-yellow-500 bg-yellow-500 text-white font-bold shadow-sm"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Response textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              回應內容
            </label>
            <button className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                auto_fix_high
              </span>
              AI 修飾
            </button>
          </div>
          <textarea
            className="w-full h-44 p-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none leading-relaxed"
            placeholder="在此撰寫您的查核回應..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="text-right">
            <span className="text-xs text-gray-400">{charCount} 字</span>
          </div>
        </div>

        {/* References */}
        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">link</span>
              佐證資料
            </label>
            <button className="text-xs text-blue-600 hover:text-blue-700">
              從對話匯入
            </button>
          </div>
          <textarea
            className="w-full h-32 p-3 text-sm font-mono text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="在此貼上連結或筆記..."
            value={refs}
            onChange={(e) => setRefs(e.target.value)}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 bg-white border-t border-border-subtle shrink-0">
        <button className="w-full py-3 px-4 bg-primary text-black font-bold text-base rounded-lg hover:bg-primary-hover shadow-md transition-colors flex justify-center items-center gap-2">
          <span className="material-symbols-outlined">send</span>
          送進 Cofacts
        </button>
      </div>
    </div>
  );
}
