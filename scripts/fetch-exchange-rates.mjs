// 한국수출입은행 Open API로 매매기준율을 가져와 Supabase에 저장한다.
// 필요 환경변수: EXIM_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// 실행: node scripts/fetch-exchange-rates.mjs
import { createClient } from "@supabase/supabase-js";

const EXIM_API_KEY = process.env.EXIM_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!EXIM_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "환경변수 누락: EXIM_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 모두 필요합니다."
  );
  process.exit(1);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function fetchRatesForDate(date) {
  const searchDate = formatDate(date);
  const url = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${EXIM_API_KEY}&searchdate=${searchDate}&data=AP01`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`환율 API 응답 실패: ${res.status}`);
  const rows = await res.json();
  return { searchDate, rows };
}

async function findLatestBusinessDayRates() {
  const today = new Date();
  for (let daysBack = 0; daysBack < 7; daysBack++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysBack);
    const { searchDate, rows } = await fetchRatesForDate(date);
    const validRows = rows.filter((r) => r.result === 1 && r.cur_unit !== "KRW");
    if (validRows.length > 0) {
      return { searchDate, rows: validRows };
    }
  }
  throw new Error("최근 7일 내 유효한 환율 데이터를 찾지 못했습니다.");
}

function toBaseDate(searchDate) {
  return `${searchDate.slice(0, 4)}-${searchDate.slice(4, 6)}-${searchDate.slice(6, 8)}`;
}

async function main() {
  const { searchDate, rows } = await findLatestBusinessDayRates();
  const baseDate = toBaseDate(searchDate);

  const records = rows.map((r) => ({
    currency_code: r.cur_unit,
    currency_name: r.cur_nm,
    deal_base_rate: Number(String(r.deal_bas_r).replace(/,/g, "")),
    base_date: baseDate,
  }));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase
    .from("exchange_rates")
    .upsert(records, { onConflict: "currency_code,base_date" });

  if (error) {
    console.error("Supabase 저장 실패:", error.message);
    process.exit(1);
  }

  console.log(`${baseDate} 기준 환율 ${records.length}건 저장 완료`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
