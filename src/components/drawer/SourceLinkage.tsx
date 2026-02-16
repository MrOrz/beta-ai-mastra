"use client";

import type { SourceItem } from "@/lib/types";

const MOCK_SOURCES: SourceItem[] = [
  {
    id: "1",
    domain: "tfc-taiwan.org.tw",
    title: "【錯誤】網傳政府補助電動機車2萬元？",
    snippet:
      "經查核，網傳訊息引用的數據過時，且混淆了地方政府與中央單位的補助方案。目前並無單筆2萬元的現金...",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs4eQIGJTfwkAqMld9vmbasQXZZt77dBzr06Vt6HuVH95rhiU5WPkNC7WiI8kTu_Ajgfuv7pyse3biTrqThRfXgzqV0EY2hXCztP4BWQwLEZn1YNnbj7BJqG8S2MnZASV1XwDrZxapF2Hh0Vh_Wskbny2hFgZr1Bar3Ayz2HA7iaoHvrK_QxxKI-YsFL2pQujck1VpNdjsabeSI4tXMZDO9KPT8rmR0odZkuHx0rx6qBKm-hzMWzmISIig7J3rK8z1RDRloPyJTvI",
    url: "https://tfc-taiwan.org.tw/articles/1234",
    adopted: true,
  },
  {
    id: "2",
    domain: "mygopen.com",
    title: "【詐騙】LINE 轉傳補助連結？小心個資外流",
    snippet:
      "近期詐騙集團利用補助名義發送釣魚簡訊與LINE訊息，連結網址並非政府gov.tw結尾，請民眾務必...",
    thumbnailIcon: "warning",
    url: "https://mygopen.com/2023/12/scam-link.html",
    adopted: false,
  },
  {
    id: "3",
    domain: "ida.gov.tw",
    title: "經濟部工業局電動機車補助說明",
    snippet:
      "112年度電動機車產業補助實施要點公告，針對重型、輕型等級不同，補助金額分別為7000元...",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZNhPXf_W3Nj0jfkmkCEKBjm1-_vCiVtlgkJLBWXYm--Q4mya6QhDk_MnC15fIMpvXq57ezhDHyA4KaMcQ4QKLPjhvMiZu0R6cJTWj1zjo9qs7jvgokEUZraHbWf1DLfOCYW1VSPOxxC3TMnUQj1xKKyqLjcMRtFiu81luD_qlGATF-1MSAGdqSRaK6GQu-BkpBXuSbSPbbA_i-8OnmLAIMc-ttwzecWYMH2v0eGoYd5dCBhZpc_x4uxsSO_Tzfp7GFs1cw7hybOU",
    url: "https://ida.gov.tw/subsidy/ev-2024",
    adopted: true,
  },
  {
    id: "4",
    domain: "news.com.tw",
    title: "最新補助政策報導：今年度申請人數創新高",
    snippet:
      "記者張小明／台北報導。隨環保意識抬頭，今年度電動機車申請補助案件數已突破...",
    thumbnailIcon: "newspaper",
    url: "https://news.com.tw/article/20240101",
    adopted: false,
  },
];

function SourceCard({ source }: { source: SourceItem }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer block"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-sm bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 shrink-0">
              {source.domain.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide truncate">
              {source.domain}
            </span>
          </div>
          <h4 className="font-bold text-gray-900 text-[13px] mb-2 leading-snug">
            {source.title}
          </h4>
          <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">
            {source.snippet}
          </p>
        </div>
        <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
          {source.thumbnailUrl ? (
            <img
              alt="Thumbnail"
              className="w-full h-full object-cover"
              src={source.thumbnailUrl}
            />
          ) : source.thumbnailIcon ? (
            <span className="material-symbols-outlined text-gray-300">
              {source.thumbnailIcon}
            </span>
          ) : (
            <span className="material-symbols-outlined text-gray-300">
              article
            </span>
          )}
        </div>
      </div>
      {source.adopted && (
        <div className="mt-3 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100">
            <span className="material-symbols-outlined text-[12px] mr-1">
              check_circle
            </span>
            已採用
          </span>
        </div>
      )}
    </a>
  );
}

export function SourceLinkage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-warm">
      <div className="flex justify-between items-center mb-1 px-1">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          相關來源 ({MOCK_SOURCES.length})
        </h3>
        <button className="text-[11px] text-primary hover:text-primary-hover font-bold tracking-tight">
          重新搜尋
        </button>
      </div>
      {MOCK_SOURCES.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </div>
  );
}
