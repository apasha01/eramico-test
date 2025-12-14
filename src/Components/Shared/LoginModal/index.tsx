"use client";

import React, { useEffect, useState, MouseEvent, Suspense } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { BiUser } from "react-icons/bi";
import Link from "next/link";
import MainProcess from "./MainLoginProcess";
import { Avatar, Popover, Skeleton, Typography } from "@mui/material";
import { IoIosLogOut } from "react-icons/io";
import useLogoutApi from "@/Helpers/CustomHooks/auth/useLogoutApi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useUserState } from "@/Hooks/useUserState";
import TheAvatar from "@/Components/common/the-avatar";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  COMPANIES_OWNER,
  COMPANIES_USERS,
  COMPANY_USER_MY_COMPANIES,
} from "@/lib/urls";
import { CompanyUser } from "@/Helpers/Interfaces/MyCompanyInterface";
import { IAPIResult } from "@/Helpers/IAPIResult";

export default function LoginRegisterModal() {
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { postData_Logout } = useLogoutApi();
  const { user: currentUser, isUserLoaded, isAuthenticated } = useUserState();
  const [companies, setCompanies] = useState<CompanyUser[]>([]);
  const getModalStyle = () => ({
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: isClient && window.innerWidth <= 460 ? "100%" : 640,
    minHeight: isClient && window.innerWidth <= 460 ? "100%" : 600,
    bgcolor: "#FDFDFD",
    border: "1px solid #E0E0E0",
    p: 3,
  });

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "auth-popover" : undefined;

  useEffect(() => {
    setIsClient(true);
    const fetchMyCompanies = async () => {
      if (isAuthenticated) {
        axiosInstance
          .get<IAPIResult<CompanyUser[]>>(COMPANY_USER_MY_COMPANIES)
          .then((response) => {
            if (response.data.success && response.data.data) {
              setCompanies(response.data.data);
            } else setCompanies([]);
          })
          .catch((error) => {
            console.error("Error fetching companies:", error);
          });
      }
    };
    fetchMyCompanies();
  }, [isAuthenticated]);

  return isClient ? (
    <>
      {!isUserLoaded && (
        <Skeleton animation="wave" variant="circular" width={44} height={44} />
      )}
      {isUserLoaded && isAuthenticated && (
        <>
          <div
            className="clickable d-flex gap-1 align-items-center"
            onClick={handleClick}
          >
            <Button
              variant="outlined"
              style={{
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                minWidth: 0,
                padding: 0,
                border: "1px solid #E0E0E0",
              }}
            >
              <TheAvatar
                name={currentUser?.firstName || currentUser?.fullName}
                src={currentUser?.avatar || ""}
                height={44}
                width={44}
                variant="circular"
              />
              <span className="visually-hidden">Open user menu</span>
            </Button>
            <Typography className="d-none d-lg-block fs-14 fw-600">
              {currentUser?.firstName || currentUser?.fullName}
            </Typography>

            {open ? (
              <IoChevronUp className="d-none d-lg-block" />
            ) : (
              <IoChevronDown className="d-none d-lg-block" />
            )}
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{ marginTop: "10px" }}
            disableScrollLock
          >
            <div className="popover">
              <Button
                LinkComponent={Link}
                href="/my-profile"
                className="d-flex gap-3 align-items-center w-100 justify-content-end"
                variant="text"
                size="small"
                onClick={() => handleClose()}
                endIcon={
                  <TheAvatar
                    name={currentUser?.fullName}
                    src={currentUser?.avatar || ""}
                    height={44}
                    width={44}
                    isSafe={false}
                    isVerified={false}
                    subscriptionAvatar={null}
                    variant="circular"
                  />
                }
              >
                پروفایل شخصی من
              </Button>
              {companies.map((company, index) => (
                <Button
                  key={index}
                  LinkComponent={Link}
                  href={`/companies/${company.companyCode}`}
                  className="d-flex gap-3 align-items-center w-100 justify-content-end"
                  variant="text"
                  size="small"
                  onClick={() => handleClose()}
                  endIcon={
                    <TheAvatar
                      name={company.companyTitle}
                      src={company?.companyAvatar || ""}
                      height={44}
                      width={44}
                      isSafe={false}
                      isVerified={false}
                      subscriptionAvatar={null}
                      variant="circular"
                    />
                  }
                >
                  شرکت: {company.companyTitle}
                </Button>
              ))}
              <Button
                className="d-flex gap-3 align-items-center w-100 justify-content-end"
                variant="text"
                size="small"
                onClick={() => {
                  postData_Logout();
                  handleClose();
                }}
                endIcon={
                  <IoIosLogOut
                    style={{
                      border: "1px solid #E0E0E0",
                      borderRadius: "50%",
                      height: "44px",
                      width: "44px",
                      padding: "10px",
                    }}
                  />
                }
              >
                خروج از حساب
              </Button>
            </div>
          </Popover>
        </>
      )}
      {isUserLoaded && !isAuthenticated && (
        <Button
          onClick={() => setOpenModal(true)}
          id="login-register-main-button"
          style={{
            borderRadius: "100px",
            border: " 1px solid #E0E0E0",
            padding: "10px 12px",
            minWidth: "110px",
            margin: "8px auto",
          }}
          className={openModal ? "opened" : ""}
        >
          ورود / عضویت
        </Button>
      )}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "scroll" }}
        className="modal-box"
      >
        <Box className="rounded-4" sx={getModalStyle()} dir="rtl">
          <CloseIcon
            style={{ color: "#757575", cursor: "pointer" }}
            onClick={() => setOpenModal(false)}
          />
          <MainProcess setOpenModal={setOpenModal} />
        </Box>
      </Modal>
    </>
  ) : null;
}
