"use client";

import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import LinkIcon from "@/Components/Icons/LinkIcon";
import AtSignIcon from "@/Components/Icons/AtSignIcon";
import LoaderComponent from "@/Components/LoaderComponent";
import { toast } from "react-toastify";
import styles from "./styles.module.css";
import { baseUrl, mainUrl } from "@/Helpers/axiosInstance/constants";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { SAVE_MULTIPLE_SOCIAL_MEDIA } from "@/lib/urls";

interface SocialMediaItem {
  id: number;
  socialMediaTypeId: number;
  link: string | null;
  socialMediaTitle: string;
  socialMediaCode: string;
  socialMediaIcon: string | null;
}

const SocialInfoGrid = () => {
  const user = useAppSelector((state) => state.user);
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([]);
  const [newSocialMediaData, setNewSocialMediaData] = useState<
    SocialMediaItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchSocialMediaData();
  }, [user.userId]);

  const fetchSocialMediaData = async () => {
    try {
      const allMedia = await axiosInstance.get<any>(
        `${baseUrl}/UserSocialMedia/mine?allSocialMedia=true`
      );
      const mineMedia = await axiosInstance.get<any>(
        `${baseUrl}/UserSocialMedia/mine`
      );
      if (allMedia?.data.success && mineMedia?.data.success) {
        const mergedSocialMediaData = allMedia?.data.data.map(
          (option: SocialMediaItem) => {
            const backendItem = mineMedia.data.data.find(
              (item: SocialMediaItem) =>
                item.socialMediaTypeId === option.socialMediaTypeId
            );
            return backendItem ? { ...option, link: backendItem.link } : option;
          }
        );
        setSocialMediaData(mergedSocialMediaData);
        setNewSocialMediaData(mergedSocialMediaData);
      }
    } catch (error) {
      console.error(error);
      toast.warning("متاسفانه خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedData = newSocialMediaData.map((item) =>
      item.socialMediaCode === name ? { ...item, link: value } : item
    );

    setNewSocialMediaData(updatedData);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const updatedSocialMediaData = newSocialMediaData
      .filter((newItem, index) => {
        const originalItem = socialMediaData[index];
        return originalItem.link !== newItem.link;
      })
      .map((item) => ({
        id: item.id,
        socialMediaTypeId: item.socialMediaTypeId,
        link: item.link,
      }));

    if (updatedSocialMediaData.length === 0) {
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("models", JSON.stringify(updatedSocialMediaData));
    try {
      const response = await axiosInstance.post(
        SAVE_MULTIPLE_SOCIAL_MEDIA,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSocialMediaData(newSocialMediaData);
      } else {
        toast.error(response.data.message);
        setNewSocialMediaData(socialMediaData);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className={styles.mainSocialDiv}>
      <div className={styles.SocialGrid}>
        {newSocialMediaData.map((item, index) => (
          <div key={item.socialMediaTypeId} className={styles.column}>
            <Typography className="fs-14 fw-500">
              {item.socialMediaTitle}
            </Typography>
            <div className={styles.rowSpaceBetween}>
              <Image
                alt=""
                src={item.socialMediaIcon || ""}
                width={24}
                height={24}
                 loading="lazy"
              />
              <input
                type="text"
                className="fs-16 fw-500 w-100"
                autoComplete="off"
                name={item.socialMediaCode}
                value={item.link || ""}
                onChange={(e) => handleChange(e, index)}
                style={{
                  outline: "none",
                  border: "none",
                  padding: "8px",
                  textAlign: "left",
                }}
                placeholder={`لینک ${item.socialMediaTitle}`}
              />
              {item.socialMediaCode === "Telegram" ||
              item.socialMediaCode === "Instagram" ||
              item.socialMediaCode === "Twitter" ? (
                <AtSignIcon />
              ) : (
                <LinkIcon />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button
          variant="contained"
          style={{ width: "160px" }}
          onClick={handleSaveChanges}
          disabled={saving}
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}{" "}
        </Button>
      </div>
    </div>
  );
};

export default SocialInfoGrid;
