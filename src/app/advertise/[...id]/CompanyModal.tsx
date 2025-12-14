import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { LuPhone } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import CompanyAvatar from "@/Components/Shared/CompanyAvatar";
import UserAvatar from "@/Components/Shared/UserAvatar";
import { AdvertiseDetail } from "../advertiseInterface";

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
  companyId: any;
  userId: any;
  name: any;
  cellphone: any;
  contactNumber: any;
  email: any;
  address: any;
  avatar: any;
  verified: any;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", md: 576 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const mobileAvatarSize = {
  width: 60,
  height: 60,
};

export default function CompanyModal({
  open,
  onClose,
  companyId,
  userId,
  name,
  cellphone,
  contactNumber,
  email,
  address,
  avatar,
  verified,
}: CompanyModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="company-modal-title"
      dir="rtl"
      className="modal-box"
    >
      <Box sx={modalStyle}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center">
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
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: "20px", md: "26px" } }}
              className="fw-500"
            >
              اطلاعات تماس
            </Typography>
          </div>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              flexDirection: { xs: "column", md: "row-reverse" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                "& > *": { ...mobileAvatarSize },
                flexShrink: 0,
              }}
            >
              {companyId ? (
                <CompanyAvatar
                  companyId={companyId}
                  companyTitle={name}
                  companyAvatar={avatar}
                  companyIsVerified={verified}
                />
              ) : (
                <UserAvatar
                  userId={userId}
                  userFullName={name}
                  userAvatar={avatar}
                  userIsVerified={verified}
                />
              )}
            </Box>

            <div
              className="d-flex gap-1 w-100 flex-column"
              style={{ textAlign: "right" }}
            >
              <Typography
                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                className="fw-500 "
              >
                {companyId && "شرکت "}
                {name}
              </Typography>

              {cellphone && (
                <a
                  href={`tel:${cellphone}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    className="mt-3 fw-500 d-flex gap-2 align-items-center"
                  >
                    <LuPhone />
                    {cellphone}
                  </Typography>
                </a>
              )}

              {contactNumber ? (
                <Typography
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                  className=" mt-3 fw-500 d-flex gap-2 align-items-center"
                >
                  <LuPhone />
                  {contactNumber}
                </Typography>
              ) : null}

              {email ? (
                <Typography
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                  className=" mt-3 fw-500 d-flex gap-2 align-items-center"
                >
                  <FiMail />
                  {email}
                </Typography>
              ) : null}
              {address && (
                <Typography
                  sx={{ fontSize: { xs: "14px", md: "16px" } }}
                  className="mt-3 fw-500 d-flex gap-2 align-items-center"
                >
                  <IoLocationOutline />
                  {address}
                </Typography>
              )}
            </div>
          </Box>
        </div>
      </Box>
    </Modal>
  );
}
