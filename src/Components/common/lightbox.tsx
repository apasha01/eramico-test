"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Lightbox({ ...all }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <>
      <Image
        src={"ss"}
        alt={all.alt}
        loading="lazy"
        {...all}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className={`lightbox-overlay ${open ? "open" : ""}`}
          onClick={() => setOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close lightbox"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="relative w-full h-full flex items-center justify-center p-8"
          >
            <Image
              src={all.src}
              alt={all.alt}
              loading="lazy"
              {...all}
              className="lightbox-image "
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
