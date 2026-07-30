import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

export interface ExchangeRate {
  currency_code: string;
  currency_name: string;
  deal_base_rate: number;
  base_date: string;
}

// 주요 통화만 상단에 노출
const MAJOR_CURRENCIES = ["USD", "JPY(100)", "EUR", "CNH", "GBP"];

export async function getLatestExchangeRates(): Promise<{
  baseDate: string | null;
  rates: ExchangeRate[];
}> {
  if (!isSupabaseConfigured) {
    return { baseDate: null, rates: [] };
  }

  const supabase = createPublicClient();

  const { data: latest } = await supabase
    .from("exchange_rates")
    .select("base_date")
    .order("base_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) return { baseDate: null, rates: [] };

  const { data: rates } = await supabase
    .from("exchange_rates")
    .select("currency_code, currency_name, deal_base_rate, base_date")
    .eq("base_date", latest.base_date)
    .order("currency_code");

  const sorted = (rates ?? []).sort((a, b) => {
    const ai = MAJOR_CURRENCIES.indexOf(a.currency_code);
    const bi = MAJOR_CURRENCIES.indexOf(b.currency_code);
    if (ai === -1 && bi === -1) return a.currency_code.localeCompare(b.currency_code);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return { baseDate: latest.base_date, rates: sorted };
}
