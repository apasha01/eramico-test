"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ShareFacebookIcon,
  ShareInstagramIcon,
  ShareWhatsappIcon,
  ShareTelegramIcon,
  ShareXIcon,
  ShareGmailIcon,
} from "@/Components/Icons/ShareIcons";
import CloseIcon from "@mui/icons-material/Close";
import { ContentCopy } from "@mui/icons-material";
import { APP_NAME } from "@/lib/metadata";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareLink?: string;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: { xs: "80%", md: "auto" },
  transform: "translate(-50%, -50%)",
  bgcolor: "#FDFDFD",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ShareModal = ({ open, onClose, shareLink }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const getCleanUrl = () => {
    if (shareLink && shareLink.length > 0) return shareLink;
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    return url.toString();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCleanUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareByGmail = () => {
    const url = getCleanUrl();
    const subject = encodeURIComponent("به اشتراک گذاری لینک از " + APP_NAME);
    const body = encodeURIComponent(
      `سلام،\nاین لینک را در ${APP_NAME} دیدم و خواستم با شما به اشتراک بگذارم:\n${url}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  const shareByFacebook = () => {
    const url = encodeURIComponent(getCleanUrl());
    const facebookShareLink = `https://www.facebook.com/dialog/share?app_id=YOUR_APP_ID&display=popup&href=${url}&redirect_uri=${url}`;
    window.open(facebookShareLink, "_blank", "width=600,height=400");
  };

  const shareByX = () => {
    const url = encodeURIComponent(getCleanUrl());
    const text = encodeURIComponent("به اشتراک گذاری از " + APP_NAME);
    const xShareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(xShareLink, "_blank", "width=550,height=420");
  };

  const shareByInstagram = () => {
    const url = encodeURIComponent(getCleanUrl());
    const text = encodeURIComponent("به اشتراک گذاری از " + APP_NAME);

    // Try mobile app first
    const instagramShareLink = `instagram://share?text=${text}&url=${url}`;

    // Fallback to web
    const webShareLink = `https://www.instagram.com/share?url=${url}`;

    try {
      window.location.href = instagramShareLink;
      // If mobile app doesn't open within 2 seconds, try web
      setTimeout(() => {
        window.open(webShareLink, "_blank");
      }, 2000);
    } catch (e) {
      window.open(webShareLink, "_blank");
    }
  };

  const shareByWhatsapp = () => {
    const url = getCleanUrl();
    const whatsappShareLink = `https://wa.me/?text=${url}`;
    window.open(whatsappShareLink, "_blank");
  };

  const shareByTelegram = () => {
    const url = getCleanUrl();
    const telegramShareLink = `https://t.me/share/url?url=${url}`;
    window.open(telegramShareLink, "_blank");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="share-modal-title"
      dir="rtl"
      className="modal-box"
    >
      <Box sx={modalStyle}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
            <Typography variant="h6" align="center">
              اشتراک‌گذاری از طریق
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={(theme) => ({
                position: "absolute",
                left: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Box
            className="d-flex gap-2 justify-content-between align-items-center"
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: { xs: 1, md: 2 },
              justifyContent: { xs: "center" },
            }}
          >
            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByGmail}
            >
              <ShareGmailIcon />
            </Button>
            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByX}
            >
              <ShareXIcon />
            </Button>

            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByFacebook}
            >
              <ShareFacebookIcon />
            </Button>

            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByWhatsapp}
            >
              <ShareWhatsappIcon />
            </Button>

            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByInstagram}
            >
              <ShareInstagramIcon />
            </Button>

            <Button
              disableRipple={true}
              disableFocusRipple={true}
              onClick={shareByTelegram}
            >
              <ShareTelegramIcon />
            </Button>
          </Box>
          <div className="link-share-container d-flex flex-column gap-2 w-100">
            <Typography variant="body2" align="right">
              لینک اشتراک‌گذاری
            </Typography>
            <TextField
              fullWidth
              value={getCleanUrl()}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={copied ? "کپی شد" : "کپی لینک"}
                      placement="top"
                    >
                      <IconButton
                        onClick={handleCopy}
                        sx={{ color: "#FB8C00" }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ShareModal;
