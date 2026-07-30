-- fin-hub: 환율 데이터 테이블
-- Supabase 대시보드 SQL Editor에서 1회 실행하세요.

create table if not exists exchange_rates (
  id bigserial primary key,
  currency_code text not null,
  currency_name text not null,
  deal_base_rate numeric not null,
  base_date date not null,
  fetched_at timestamptz not null default now(),
  unique (currency_code, base_date)
);

create index if not exists exchange_rates_base_date_idx
  on exchange_rates (base_date desc);

alter table exchange_rates enable row level security;

-- 누구나 조회 가능 (공개 데이터)
create policy "Public read access" on exchange_rates
  for select using (true);

-- 쓰기는 service_role 키로만 (RLS를 우회하므로 별도 정책 불필요)
