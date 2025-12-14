"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import RTLChatBox from "@/Components/Shared/Chats";
import { GetMetadata } from "@/lib/metadata";

export default function Page() {
  var md = GetMetadata("پیام‌ها");
  document.title = md.title;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    entityId: undefined as string | undefined,
    user: undefined as string | undefined,
    company: undefined as string | undefined,
  });

  useEffect(() => {
    const i = searchParams.get("i");
    const u = searchParams.get("u");
    const c = searchParams.get("c");

    if (i || u || c) {
      setParams({
        entityId: i || undefined,
        user: u || undefined,
        company: c || undefined,
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("i");
      url.searchParams.delete("u");
      url.searchParams.delete("c");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className={`mainStyle main-chat-container`}>
        <RTLChatBox
          entityId={params.entityId}
          user={params.user}
          company={params.company}
        />
      </div>
    </Suspense>
  );
}
