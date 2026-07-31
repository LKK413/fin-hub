import type { Metadata } from "next";
import { Geist, Geist_Mono, Gowun_Batang } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serifKr = Gowun_Batang({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "핀허브 — 재테크 계산기 & 금융 정보",
  description: "연봉 실수령액, 대출이자 등 재테크 계산기와 환율·금리 정보를 한 곳에서.",
  verification: {
    google: "qE0FgXC0k-U_WNA2YFi0U9vm_28JJOjjTMVbOHvQxOM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${serifKr.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8479780852723019"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-200 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
          <p>
            본 사이트의 계산 결과는 추정치이며 법적 효력이 없습니다. 정확한 금액은 국세청·4대보험공단 자료를 참고하세요.
          </p>
          <nav className="mt-3 flex justify-center gap-4">
            <a href="/about" className="transition-colors hover:text-amber-400">사이트 소개</a>
            <a href="/privacy" className="transition-colors hover:text-amber-400">개인정보처리방침</a>
            <a href="/terms" className="transition-colors hover:text-amber-400">이용약관</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
