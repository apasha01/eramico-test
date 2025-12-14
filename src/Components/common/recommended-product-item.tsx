import { List, ListItem, ListItemButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { FOLLOW_PRODUCT, UNFOLLOW_PRODUCT } from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast } from "react-toastify";
import { useAuthCheck } from "@/Hooks/useAuthCheck";

interface RecommendedProductItemProps {
  id: number;
  faTitle: string;
  enTitle: string;
  avatar?: string;
  code: string;
  isFollowed: boolean;
}
interface Follow_res extends IAPIResult<any> {}

export default function RecommendedProductItem({
  id,
  faTitle,
  enTitle,
  avatar,
  code,
  isFollowed,
}: RecommendedProductItemProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const firstCharacter = code ? code.charAt(0) : "";
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    setIsSubscribed(isFollowed);
  }, [isFollowed]);

  const followProduct = async () => {
    if (!checkAuth('برای دنبال کردن این محصول ابتدا وارد شوید.')) {
      return;
    }

    const url = isSubscribed
      ? `${UNFOLLOW_PRODUCT}/${id}`
      : `${FOLLOW_PRODUCT}?id=${id}`;

    const response = await axiosInstance.post<Follow_res>(url);

    if (response.data.success) {
      toast.success(response.data.message);
      setIsSubscribed(!isSubscribed);
    } else {
      console.error(response.data.message);
    }
  };

  return (
    <nav>
      <List>
        <ListItem disablePadding>
          <ListItemButton className="row px-0 mx-0 bg-transparent">
            <div className="d-flex align-items-center justify-content-center px-3 mx-0 rtl py-1">
              <Link
                className="col-11 d-flex align-items-center justify-content-start"
                href={`products/${id?.toString()}`}
              >
                {avatar ? (
                  <Image
                    className="col-12"
                    alt="لوگوی محصول"
                    loading="lazy"
                    src={avatar}
                    width={70}
                    height={70}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      className="defaultIcon"
                      style={{
                        backgroundColor: id % 2 === 0 ? "#002664" : "#D80621",
                        padding: "10px",
                      }}
                    >
                      <span className="fs-22" style={{ color: "white" }}>
                        {firstCharacter}
                      </span>
                    </div>
                  </div>
                )}
                <div className="text-end mx-0 px-0 pe-3">
                  <Typography variant="body1" className="col-12 text-end">
                    {faTitle}
                  </Typography>
                  {enTitle && (
                    <Typography
                      variant="body2"
                      className="col-12 mt-2 text-end"
                    >
                      ({enTitle})
                    </Typography>
                  )}
                </div>
              </Link>

              <div
                className="col-1 align-self-center text-center px-1"
                onClick={followProduct}
              >
                {isSubscribed ? (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 28, color: "black" }}
                  />
                ) : (
                  <AddCircleIcon sx={{ fontSize: 28, color: "black" }} />
                )}
              </div>
            </div>
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
}
