"use client";

import React from "react";
import Button from "@mui/material/Button";
import styles from "./styles.module.css";
import { FaRegHeart } from "react-icons/fa";
import { LuShare } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";

type OptionsMenuProps = {
  shareNumber?: number;
  recommendNumber?: number;
  likeNumber?: number;
  reportNumber?: number;
};

const newsOptions: React.FC<OptionsMenuProps> = ({
  recommendNumber,
  likeNumber,
}) => {
  return (
    <div className={styles.newsCard}>
      <Button
        className="d-flex gap-2 align-items-center greyColor justify-content-start"
        variant="text"
        size="small"
        startIcon={<AiOutlineRetweet />}
      >
        {recommendNumber}
      </Button>
      <Button
        className="d-flex gap-2 align-items-center greyColor justify-content-start"
        variant="text"
        size="small"
        startIcon={<FaRegHeart />}
      >
        {likeNumber}
      </Button>
      <Button
        className="d-flex gap-2 align-items-center greyColor justify-content-start"
        variant="text"
        size="small"
        startIcon={<LuShare />}
      />
    </div>
  );
};

export default newsOptions;
