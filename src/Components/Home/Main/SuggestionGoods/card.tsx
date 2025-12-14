import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import styles from "../styles.module.css";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { FOLLOW_PRODUCT, UNFOLLOW_PRODUCT } from "@/lib/urls";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { PRODUCT } from "@/lib/internal-urls";
interface Follow_res {
  success: boolean;
  message: string | null;
  data: any;
}

export function Cards({
  index,
  id,
  faTitle,
  itemId,
  enTitle,
  image,
  code,
  isFollowed,
  handleClick,
}: {
  id: number;
  index: number;
  faTitle: string;
  itemId: string;
  enTitle: string;
  image: any;
  code: string;
  isFollowed: boolean;
  handleClick: any;
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    setIsFollowing(isFollowed);
  }, [isFollowed]);

  const handleFollow = async () => {
    if (!checkAuth("برای دنبال کردن این محصول ابتدا وارد شوید.")) {
      return;
    }

    const url = isFollowing
      ? `${UNFOLLOW_PRODUCT}/${itemId}`
      : `${FOLLOW_PRODUCT}?id=${itemId}`;

    try {
      const response = await axiosInstance.post<Follow_res>(url);
      if (response.data.success) {
        toast.success(response.data.message);
        setIsFollowing(!isFollowing);
        handleClick();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error handling follow/unfollow:", error);
    }
  };

  const getAvatarContent = () => {
    if (image) {
      return (
        <Image
          src={image}
          alt="product logo"
          loading="lazy"
          style={{ width: "48px", height: "48px", borderRadius: "12px" }}
        />
      );
    }

    const fallbackText = enTitle ? enTitle[0] : code ? code[0] : faTitle[0];
    return (
      <div
        className="d-flex align-items-center justify-content-center fw-bold fs-16 clickable radius-12"
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: index % 2 === 0 ? "#002664" : "#D80621",
          color: "#fff",
        }}
        onClick={handleClick}
      >
        {fallbackText}
      </div>
    );
  };

  return (
    <Card className={styles.cardContainer} key={itemId}>
      {getAvatarContent()}
      <CardContent className={styles.CardContent}>
        <Link href={PRODUCT(id.toString(), faTitle)} onClick={handleClick}>
          <Typography variant="body2" style={{ color: "#212121" }}>
            {faTitle}
          </Typography>
          {enTitle && (
            <Typography
              variant="body2"
              style={{ color: "#616161", marginTop: "5px" }}
            >
              ({enTitle})
            </Typography>
          )}
        </Link>
        <Button
          variant="outlined"
          className={
            isFollowing ? "wantToFollowButtonStyle" : "followButtonStyle"
          }
          onClick={handleFollow}
        >
          {isFollowing ? "دنبال شده" : "دنبال کردن"}
        </Button>
      </CardContent>
    </Card>
  );
}
