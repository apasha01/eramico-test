"use client";

import { Avatar, Box, Button, Modal, Radio, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { ACCESS_LOOKUP, EDIT_USER_ACCESS } from "@/lib/urls";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import { toast } from "react-toastify";
import styles from "./styles.module.css";
import LoaderComponent from "@/Components/LoaderComponent";
import { IAPIResult } from "@/Helpers/IAPIResult";

interface Save_access_res extends IAPIResult<any> {}

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 576,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface EditAccessModalProps {
  userId: number;
  companyId: number;
  show: boolean;
  name: string;
  avatar: string | null;
  phoneNumber: string | null;
  onClose: () => void;
}

const EditAccessModal = ({
  userId,
  companyId,
  show,
  name,
  avatar,
  phoneNumber,
  onClose,
}: EditAccessModalProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(
        `${ACCESS_LOOKUP}?CompanyId=${companyId}&userId=${userId}`
      );
      var d = response.data.data || [];
      setData(d);
      setSelectedValues([...d.filter((item: any) => item.isSelected).map((item: any) => item.accessId)]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    const params = selectedValues.map((id) => `AccessIds=${id}`).join("&");
    const response = await axiosInstance.post<Save_access_res>(
      `${EDIT_USER_ACCESS}?CompanyId=${companyId}&UserId=${userId}&${params}`
    );

    if (!response.data.success) {
      toast.warning(response.data.message);
      fetchData();
    } else {
      onClose();
      toast.success(response.data.message);
    }
  };

  const handleChange = (id: number) => {
    const newSelectedValues = selectedValues.includes(id)
      ? selectedValues.filter((item) => item !== id)
      : [...selectedValues, id];

    setSelectedValues(newSelectedValues);
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      dir="rtl"
      className="modal-box"
    >
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">مدیریت دسترسی‌ها</h3>
        </div>
        <span className="text-center w-100 d-block">
          از این بخش می‌توانید دسترسی کاربر زیر را مدیریت کنید
        </span>
        <div
          className="d-flex mt-4 radius-12 p-3"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          {avatar ? (
            <Image
              className="radius-50"
              alt="لوگو شرکت"
               loading="lazy"
              src={avatar}
              width={42}
              height={42}
            />
          ) : (
            <Avatar
              variant="circular"
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "#fff ",
                color: "#212121",
                border: "1px solid #F5F5F5",
              }}
              alt="profile picture"
            >
              <BiUser size={28} style={{ color: "#212121" }} />
            </Avatar>
          )}
          <div className="pe-3">
            <div className="d-flex gap-2 align-items-center mx-0 mt-0">
              <Typography className="fs-16 fw-500">{name}</Typography>
            </div>
            {phoneNumber && (
              <div>
                <Typography className="fs-13 fw-500 greyColor2 mt-0">
                  {phoneNumber}
                </Typography>
              </div>
            )}
          </div>
        </div>
        <div
          className="d-grid mt-4"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {loading ? (
            <LoaderComponent />
          ) : (
            data.map((val: any) => (
              <div key={val.accessId}>
                <Button
                  variant="outlined"
                  className={`border-0 p-0 ${
                    selectedValues.includes(val.accessId) || val.isSelected
                      ? styles.followActivityButtonActive
                      : styles.followActivityButton
                  }`}
                  sx={{
                    transition: "background 200ms",
                    marginInline: "0px",
                    padding: "0px",
                    position: "relative",
                    textAlign: "right",
                    justifyContent: "right",
                    gap: "5px",
                    color: "#212121",
                  }}
                  onClick={() => handleChange(val.accessId)}
                  startIcon={
                    <Radio
                      checked={selectedValues.includes(val.accessId)}
                      checkedIcon={
                        <CheckBoxOutlinedIcon style={{ color: "#FB8C00" }} />
                      }
                      style={{ color: "#E0E0E0" }}
                      icon={
                        <CheckBoxOutlineBlankOutlinedIcon
                          style={{ border: "1px solid #E0E0E0" }}
                          className="text-white radius-5"
                        />
                      }
                    />
                  }
                >
                  {val.accessTitle}
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="pt-3 d-flex gap-4">
          <Button
            variant="contained"
            style={{ background: "#FB8C00", paddingInline: "24px" }}
            onClick={onSubmit}
            className="w-100"
          >
            ثبت تغییرات
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditAccessModal;
