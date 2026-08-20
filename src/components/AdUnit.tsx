"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdUnit({ slot }: { slot: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function tryPush() {
      if (cancelled) return;
      const width = wrapperRef.current?.offsetWidth ?? 0;
      // 레이아웃이 아직 안 잡혀서 너비가 0이면 광고 요청이 실패하므로,
      // 다음 프레임에 다시 시도 (최대 20회 = 약 1/3초)
      if (width === 0 && attempts < 20) {
        attempts += 1;
        requestAnimationFrame(tryPush);
        return;
      }
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
      }
    }

    requestAnimationFrame(tryPush);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={wrapperRef} className="mt-10">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8479780852723019"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
