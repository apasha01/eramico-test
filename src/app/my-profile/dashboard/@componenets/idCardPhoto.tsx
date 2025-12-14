import React, { useRef, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import Image from "next/image";
import styles from "./styles.module.css";
import useUpdateIdentityApi from "@/Helpers/CustomHooks/user/useUpdateIdentity";
import LoaderComponent from "@/Components/LoaderComponent";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import { updateUser } from "@/lib/features/user/userSlice";
import { base64ToFile } from "@/lib/utils";

const IdCardPhoto = () => {
  const dispatch = useAppDispatch();
  const [idCard, setIdCard] = useState("");
  const { loadingUpdateIdentity, updateIdentity } = useUpdateIdentityApi();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64 = reader.result as string;
        setIdCard(base64);

        try {
          const croppedFile = base64ToFile(base64, "identityImage.jpg");
          const result = await updateIdentity(croppedFile);

          if (result?.success) {
            dispatch(updateUser({ identityImage: base64 }));
          } else {
            toast.error(result?.message);
          }
        } catch (error) {
          console.error(error);
        }
      };

      reader.onerror = () => {
        console.error("File reading failed.");
        toast.error("Failed to read the file.");
      };
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return loadingUpdateIdentity ? (
    <div className={styles.personalGrid}>
      <LoaderComponent />
    </div>
  ) : (
    <div className={styles.personalGrid}>
      <div className={styles.column}>
        <Typography className="fs-14 fw-500 labelColor">
          تصویر کارت ملی
        </Typography>
        <div className="position-relative d-inline-block">
          <Avatar
            alt="User Avatar"
            sx={{
              width: "100%",
              backgroundColor: "#F5F5F5 ",
              color: "#212121",
              border: "1px solid #F5F5F5",
              cursor: "pointer",
              borderRadius: "12px",
              height: 180,
            }}
            onClick={handleClick}
          >
            {idCard ? (
              <Image
               loading="lazy"
                className="col-12"
                alt="لوگو شرکت"
                src={idCard}
                width={400}
                height={180}
              />
            ) : (
              <></>
            )}
            <div
              className={`${
                idCard ? "d-none" : "d-flex"
              } flex-column align-items-center w-100 pt-4`}
            >
              <span className="fs-12" style={{ color: "#757575" }}>
                عکس کارت ملی خود را انتخاب کنید
              </span>
              <span className="fs-9 pt-2" style={{ color: "#BDBDBD" }}>
                حداکثر سایز تصویر ۲ مگابایت می‌باشد
              </span>
            </div>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            placeholder="ارسال عکس کارت ملی"
          />
          <Image
            src="/images/ic_upload.png"
            alt="تعداد بازدید"
             loading="lazy"
            width={24}
            height={24}
            style={{ position: "absolute", top: "31%", right: "45%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default IdCardPhoto;
