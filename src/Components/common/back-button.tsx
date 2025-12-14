"use client";

import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import { usePathname, useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("show")) {
      searchParams.delete("show");
      router.push(
        pathname + (searchParams.toString() ? `?${searchParams}` : "")
      );
      return;
    }

    if (pathname === "/my-profile/my-companies") {
      router.push("/my-profile");
      return;
    }

    router.back();
  };

  return (
    <IconButton className="border black" onClick={handleClick}>
      <BsArrowRightShort size={24} />
    </IconButton>
  );
};

export default BackButton;
