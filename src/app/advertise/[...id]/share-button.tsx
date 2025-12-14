"use client";

import ShareModal from "@/Components/common/share-modal";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";

interface ShareButtonProps {
  link: string;
  size?: string | null;
}

const ShareButton = ({ link, size = "48px" }: ShareButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Tooltip title={<div dir="rtl">اشتراک‌گذاری</div>}>
        <IconButton
          className="border black"
          sx={{ width: size, height: size }}
          onClick={() => setShowModal(true)}
        >
          <IoShareSocialOutline />
        </IconButton>
      </Tooltip>
      <ShareModal
        open={showModal}
        onClose={() => setShowModal(false)}
        shareLink={link}
      />
    </>
  );
};

export default ShareButton;
