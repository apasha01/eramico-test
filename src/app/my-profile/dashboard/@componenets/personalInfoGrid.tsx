"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, IconButton, Typography, Modal } from "@mui/material";
import { HiOutlinePencil } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateUserProfile } from "@/lib/features/user/userSlice";
import styles from "./styles.module.css";

import dynamic from "next/dynamic";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

const DatePicker: any = dynamic(() => import("react-multi-date-picker"), {
  ssr: false,
});

interface Data {
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: string; // ISO: YYYY-MM-DD (EN digits)
  gender: string;
  nationalCode: string;
}

const LabelMap: Record<keyof Data, string> = {
  firstName: "نام",
  lastName: "نام خانوادگی",
  userName: "نام کاربری",
  birthDate: "تاریخ تولد",
  gender: "جنسیت",
  nationalCode: "کد ملی",
};

const toEnDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

const toPersianText = (iso: string) => {
  if (!iso) return "";
  return new DateObject({ date: iso, format: "YYYY-MM-DD", calendar: gregorian })
    .convert(persian)
    .setLocale(persian_fa)
    .format("YYYY/MM/DD");
};

const toPickerValue = (iso: string) => {
  if (!iso) return undefined;
  return new DateObject({ date: iso, format: "YYYY-MM-DD", calendar: gregorian })
    .convert(persian)
    .setLocale(persian_fa);
};

const toIsoFromPicker = (date: any) => {
  if (!date) return "";
  const iso = (date instanceof DateObject ? date : new DateObject(date))
    .convert(gregorian)
    .format("YYYY-MM-DD");
  return toEnDigits(iso);
};

const PersonalInfoGrid: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [editingField, setEditingField] = useState<keyof Data | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [values, setValues] = useState<Data>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userName: user.userName || "",
    birthDate: user.birthDate || "",
    gender: user.gender === true ? "مرد" : "زن",
    nationalCode: user.nationalCode || "",
  });

  // جلوگیری از overwrite شدن مقدارهای درحال ادیت با useEffect(user)
  useEffect(() => {
    if (editingField || isDatePickerOpen) return;

    setValues((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
      birthDate: user.birthDate || "",
      gender: user.gender === true ? "مرد" : "زن",
      nationalCode: user.nationalCode ?? "",
    }));
  }, [user, editingField, isDatePickerOpen]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const saveProfileDebounced = (next?: Partial<Data>) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const payloadValues = { ...values, ...(next || {}) };

    timerRef.current = setTimeout(() => {
      dispatch(
        updateUserProfile({
          firstName: payloadValues.firstName,
          lastName: payloadValues.lastName,
          userName: payloadValues.userName,
          birthDate: toEnDigits(payloadValues.birthDate || ""),
          gender: payloadValues.gender === "مرد",
          nationalCode: payloadValues.nationalCode,
        })
      );
    }, 300);
  };

  const handleEditClick = (field: keyof Data) => {
    if (field === "birthDate") {
      setIsDatePickerOpen(true);
      return;
    }
    setEditingField(field);
  };

  const handleSaveClick = () => {
    setEditingField(null);
    saveProfileDebounced();
  };

  const handleChange = (field: keyof Data, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: any) => {
    const iso = toIsoFromPicker(date);

    // 1) اول state رو عوض کن
    setValues((prev) => ({ ...prev, birthDate: iso }));

    // 2) مثل قبل: انتخاب شد -> مودال بسته -> آپدیت
    setIsDatePickerOpen(false);
    saveProfileDebounced({ birthDate: iso });
  };

  const birthDatePersianText = useMemo(
    () => toPersianText(values.birthDate),
    [values.birthDate]
  );

  const pickerValue = useMemo(
    () => toPickerValue(values.birthDate),
    [values.birthDate]
  );

  const renderField = (field: keyof Data) => {
    const isEditing = editingField === field;

    if (field === "gender") {
      return isEditing ? (
        <select
          value={values.gender}
          onChange={(e) => handleChange(field, e.target.value)}
          style={{
            width: "100%",
            background: "#fff",
            border: "none",
            outline: "none",
            padding: "4px",
            textAlign: "right",
            direction: "rtl",
          }}
          title="جنسیت"
        >
          <option value="مرد">مرد</option>
          <option value="زن">زن</option>
        </select>
      ) : (
        <Typography className="fs-16 fw-500">
          {values.gender === "مرد" ? "مرد" : "زن"}
        </Typography>
      );
    }

    return isEditing ? (
      <input
        type="text"
        className="fs-16 fw-500 w-100"
        autoComplete="off"
        value={values[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{
          outline: "none",
          border: "none",
          marginLeft: "8px",
          padding: "4px",
          textAlign: "right",
        }}
        placeholder={`لطفا ${LabelMap[field]} را وارد کنید`}
      />
    ) : (
      <Typography className="fs-16 fw-500">
        {field === "birthDate"
          ? birthDatePersianText || "تاریخ تولد را انتخاب کنید"
          : values[field] || `${LabelMap[field]} خود را اضافه کنید`}
      </Typography>
    );
  };

  const renderIcon = (field: keyof Data) => {
    const isEditing = editingField === field;

    return isEditing ? (
      <IconButton
        style={{
          borderRadius: "8px",
          width: "32px",
          height: "32px",
          backgroundColor: "#5caf4c",
        }}
        onClick={handleSaveClick}
      >
        <FaCheck color="#fff" />
      </IconButton>
    ) : (
      <IconButton
        style={{
          borderRadius: "8px",
          width: "32px",
          height: "32px",
          backgroundColor: "#e9f2fe",
        }}
        onClick={() => handleEditClick(field)}
      >
        {values[field] ? <HiOutlinePencil color="#0068ff" /> : <FiPlus color="#0068ff" />}
      </IconButton>
    );
  };

  return (
    <div className={styles.personalGrid}>
      {Object.keys(values).map((key) => {
        const field = key as keyof Data;
        return (
          <div className={styles.column} key={field}>
            <Typography className="fs-14 fw-500 labelColor">{LabelMap[field]}</Typography>
            <div
              className={styles.rowSpaceBetween}
              style={{ border: editingField === field ? "1px solid #0068ff" : "" }}
            >
              {renderField(field)}
              {renderIcon(field)}
            </div>
          </div>
        );
      })}

      <Modal open={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} className="modal-box">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            width: 420,
            padding: "20px",
          }}
        >
          <div className="flex flex-column gap-3 justify-content-center align-items-center">
            <Typography style={{ textAlign: "right" }} className="mb-2 text-right">
              تاریخ تولد را انتخاب کنید
            </Typography>

            <DatePicker
              value={pickerValue}
              onChange={handleDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              editable={false}
              portal
              portalTarget={typeof document !== "undefined" ? document.body : undefined}
              zIndex={20000}
              fixMainPosition
              calendarPosition="bottom-right"
              containerStyle={{ width: "100%" }}
              style={{
                width: "100%",
                height: "58px",
                borderRadius: "12px",
                border: "1px solid #d0d7de",
                padding: "0 14px",
                fontSize: "16px",
                fontWeight: 700,
                outline: "none",
                textAlign: "right",
                direction: "rtl",
              }}
              placeholder="تاریخ تولد را انتخاب کنید"
            />

            <Button variant="contained" className="mt-3 w-100" onClick={() => setIsDatePickerOpen(false)}>
              بستن
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PersonalInfoGrid;
