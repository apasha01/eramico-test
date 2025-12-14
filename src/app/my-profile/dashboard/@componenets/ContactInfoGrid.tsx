"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { HiOutlinePencil } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateUserContact } from "@/lib/features/user/userSlice";
import styles from "./styles.module.css";

interface Data {
  phoneNumber: string;
  email: string;
  telephone: string;
  address: string;
}

const LabelMap: Record<keyof Data, string> = {
  phoneNumber: "شماره همراه",
  email: "ایمیل",
  telephone: "شماره تماس",
  address: "آدرس",
};

const ContactInfoGrid: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [editingField, setEditingField] = useState<keyof Data | null>(null);
  const [values, setValues] = useState<Data>({
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
    telephone: user?.telephone ?? "",
    address: user?.address ?? "",
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    setValues({
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      telephone: user?.telephone ?? "",
      address: user?.address ?? "",
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      reqIdRef.current++;
    };
  }, []);

  const scheduleUpdate = () => {
    reqIdRef.current++;
    const reqId = reqIdRef.current;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (reqId !== reqIdRef.current) return;

      dispatch(
        updateUserContact({
          telephone: values.telephone,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
        })
      );
    }, 1000);
  };

  const handleEditClick = (field: keyof Data) => {
    setEditingField(field);
  };

  const handleSaveClick = (_field: keyof Data) => {
    setEditingField(null);
    scheduleUpdate();
  };

  const handleChange = (field: keyof Data, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (field: keyof Data) => {
    const isEditing = editingField === field;

    return isEditing ? (
      <input
        type="text"
        className="fs-16 fw-500 w-100"
        autoComplete="off"
        value={values[field] ?? ""}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{
          outline: "none",
          border: "none",
          padding: "4px",
          textAlign: "right",
          color: "#757575",
          background: "transparent",
          width: "100%",
        }}
        placeholder={`لطفا ${LabelMap[field]} را وارد کنید`}
      />
    ) : (
      <Typography className="fs-16 fw-500" style={{ color: "#757575" }}>
        {values[field]?.trim()
          ? values[field]
          : `${LabelMap[field]} خود را اضافه کنید`}
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
        onClick={() => handleSaveClick(field)}
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
        {values[field]?.trim() ? (
          <HiOutlinePencil color="#0068ff" />
        ) : (
          <FiPlus color="#0068ff" />
        )}
      </IconButton>
    );
  };

  return (
    <div className={styles.personalContactGrid}>
      {Object.keys(values).map((key) => {
        const field = key as keyof Data;
        return (
          <div className={styles.column} key={field}>
            <Typography className="fs-14 fw-500 labelColor">
              {LabelMap[field]}
            </Typography>
            <div
              className={styles.rowSpaceBetween}
              style={{
                border: editingField === field ? "1px solid #0068ff" : "",
              }}
            >
              {renderField(field)}
              {renderIcon(field)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactInfoGrid;
