"use client";

import { useEffect, useRef, useState } from "react";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function CountUpNumber({
  value,
  formatter,
  duration = 700,
}: {
  value: number;
  formatter: (n: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    let raf: number;
    let settled = false;

    function finish() {
      if (settled) return;
      settled = true;
      fromRef.current = to;
      setDisplay(to);
    }

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(t);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }

    raf = requestAnimationFrame(tick);
    // rAF가 비활성 탭 등에서 지연/중단되더라도 최종값은 항상 반영되도록 하는 안전장치
    const fallback = setTimeout(finish, duration + 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return <>{formatter(display)}</>;
}
