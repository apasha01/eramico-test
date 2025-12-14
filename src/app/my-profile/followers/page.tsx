"use client";

import React from "react";
import { USER_FOLLOWERS } from "@/lib/urls";
import { useAppSelector } from "@/lib/hooks";
import Followers from "@/Components/common/followers";

const Page = () => {
  const user = useAppSelector((state) => state.user);

  return <Followers type="follower" url={`${USER_FOLLOWERS}/${user.userId}`} />;
};

export default Page;
