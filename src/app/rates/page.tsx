import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import { getLatestExchangeRates } from "@/lib/rates/exchange";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// 하루 1회 수집되는 환율 데이터를 재배포 없이 반영하기 위한 주기적 재검증
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "오늘의 환율 | Reko",
  description:
    "한국수출입은행 매매기준율을 매일 자동으로 갱신하는 실시간 환율 정보.",
};

export default async function RatesPage() {
  const { baseDate, rates } = await getLatestExchangeRates();

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <RefreshCw className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">오늘의 환율</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        한국수출입은행 매매기준율을 매일 자동으로 갱신합니다.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase 연동이 아직 설정되지 않았습니다. 환경변수(NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY)를 설정하면 이 페이지에 데이터가 표시됩니다.
        </div>
      )}

      {isSupabaseConfigured && rates.length === 0 && (
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
          아직 저장된 환율 데이터가 없습니다. <code>npm run fetch:rates</code> 를
          실행해 최초 데이터를 수집하세요.
        </div>
      )}

      {rates.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-800 bg-zinc-950 px-5 py-3 text-xs font-medium text-amber-400">
            {baseDate} 기준
          </div>
          <table className="w-full text-sm">
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.currency_code} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50">
                  <td className="px-5 py-3 text-zinc-500">{rate.currency_name}</td>
                  <td className="px-5 py-3 text-right font-mono text-zinc-900">
                    {rate.deal_base_rate.toLocaleString("ko-KR", {
                      minimumFractionDigits: 2,
                    })}
                    원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          매매기준율이란?
        </h2>
        <p>
          매매기준율은 외국환은행이 전날 거래한 미국 달러 환율을 가중평균해
          한국은행이 매일 고시하는 기준 환율입니다. 실제 은행 창구에서
          환전할 때는 이 기준율에 각 은행의 스프레드(수수료)가 더해지거나
          빠져 실제 적용 환율이 달라집니다.
        </p>
      </section>
    </div>
  );
}
