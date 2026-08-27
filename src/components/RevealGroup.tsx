"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}

/**
 * 자식 요소들을 화면(뷰포트)에 스크롤로 들어올 때 순서대로 살짝
 * 떠오르며 나타나게 하는 래퍼. 접근성·안정성을 위해:
 * - 이미 화면 안에 있는 콘텐츠(로드 시 바로 보이는 영역)는 애니메이션 없이
 *   즉시 보임 처리 — 아래로 스크롤해야 보이는 콘텐츠만 살짝 숨겼다가 등장시킴
 * - prefers-reduced-motion이면 애니메이션 없이 항상 보임
 * - 자바스크립트가 늦게 실행되거나 실패해도 기본 상태는 "보임"이라
 *   콘텐츠가 영구히 사라지는 일은 없음
 */
export function RevealGroup({
  children,
  className,
  staggerMs = 70,
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "pending" | "revealed">(
    "visible"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.9;
    if (alreadyInView) return;

    setState("pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = state === "pending";

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{
          className?: string;
          style?: CSSProperties;
        }>;
        return cloneElement(el, {
          className: [
            el.props.className,
            "transition-all duration-700 ease-out",
            hidden ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0",
          ]
            .filter(Boolean)
            .join(" "),
          style: {
            ...el.props.style,
            transitionDelay: hidden ? "0ms" : `${index * staggerMs}ms`,
          },
        });
      })}
    </div>
  );
}
