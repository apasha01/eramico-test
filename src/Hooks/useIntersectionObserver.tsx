import { useEffect, useRef } from "react";

const useIntersectionObserver = (callback: () => void, options: IntersectionObserverInit = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasMarkedRef = useRef(false); // 👈 فقط یکبار اجرا شود

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasMarkedRef.current) {
          hasMarkedRef.current = true; // 👈 جلوگیری از دوبار فراخوانی
          callback();
          observer.disconnect(); // 👈 بعد از اولین اجرا observer قطع شود
        }
      });
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return ref;
};

export default useIntersectionObserver;
