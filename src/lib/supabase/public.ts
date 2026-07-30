import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// 로그인/쿠키가 필요 없는 공개 데이터 조회 전용 클라이언트 (환율·금리 등)
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
