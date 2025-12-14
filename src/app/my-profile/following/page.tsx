"use client";

import React from "react";
import { MINE_FOLLOWS } from "@/lib/urls";
import Followers from "@/Components/common/followers";

const Page = () => {
  return <Followers type="follow" url={MINE_FOLLOWS} />;
};

export default Page;
