"use client";

import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Radio, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import useSave_Category_MultipleApi from "@/Helpers/CustomHooks/follow/useSave_Category_MultipleApi";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ImRadioUnchecked } from "react-icons/im";

export default function RegisterStep4(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
  setOpenModal: (value: boolean) => void;
}) {
  //follow category
  const { loading_Save_Category_Multiple, postData_Save_Category_Multiple } =
    useSave_Category_MultipleApi();

  const [fieldOfActivity, setFieldOfActivity] = useState([
    { id: 1, name: "ارز" },
    { id: 2, name: "راه و ساختمان" },
    { id: 3, name: "لاستیک" },
    { id: 4, name: "سکه و فلزات گرانبها" },
    { id: 5, name: "غذایی و کشاورزی" },
    { id: 6, name: "پلیمر و پلاستیک" },
    { id: 7, name: "نفت، گاز و پتروشیمی" },
    { id: 8, name: "راه و ساختمان" },
    { id: 9, name: "نساجی و پوشاک" },
    { id: 10, name: "شیمیایی و حلال‌ها" },
    { id: 11, name: "فلزات و معادن" },
    { id: 12, name: "سلولوزی و بسته‌بندی" },
  ]);

  const HandleSendFollowCategory = async () => {
    props.ChangeState({
      ...props.State,
      isLoading: true,
    });
    if (props.State.fieldOfActivity.length === 0) {
      toast.warning("لطفا یک مورد را انتخاب کنید.");
      props.ChangeState({
        ...props.State,
        isLoading: false,
      });
      return "";
    }
    const data = await postData_Save_Category_Multiple({
      entityIds: props.State.fieldOfActivity,
    });
    if (!data?.success) {
      toast.warning("اطلاعات وارد شده اشتباه است.");
      props.ChangeState({
        ...props.State,
        isLoading: false,
      });
    } else {
      toast.success(" ثبت نام تکمیل شد.");
      props.ChangeState({
        ...props.State,
        isLoading: false,
      });
      props.setOpenModal(false);
    }
  };

  const handleChange = (id: number) => {
    if (props?.State?.fieldOfActivity.includes(id)) {
      const newArr = props.State.fieldOfActivity.filter((x) => x != id);
      props.ChangeState({
        ...props.State,
        fieldOfActivity: newArr,
      });
    } else {
      props.State.fieldOfActivity.push(id);
      props.ChangeState({
        ...props.State,
        fieldOfActivity: props.State.fieldOfActivity,
      });
    }
  };

  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 mb-3 border  ">
      <Typography
       
        variant="h6"
        component="h2"
        className="text-center mt-0"
      >
        <Image alt="LOGO" src={logo} />
      </Typography>

      <Typography className="col-12 text-center mt-5 fs-19 fw-500">
        {" "}
        علاقه مندی ها و زمینه فعالیت
      </Typography>
      <div
        className="row gx-3 gy-4 mt-2 "
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        {fieldOfActivity.map((val) => {
          return (
            <div key={val.id} style={{
              paddingRight: "10px",
              paddingLeft: "10px"
            }}>
              <Button
                variant="outlined"
                className={
                  props?.State?.fieldOfActivity.includes(val.id)
                    ? "col-12 followActivityButtonActive "
                    : "col-12 followActivityButton"
                }
                sx={{

                  borderRadius: "8px",
                  border: "1px solid #E0E0E0",
                  transition: "background 200ms",
                  marginInline: "0px",
                  padding: "16px",
                  position: "relative",
                  textAlign: "left",
                  justifyContent: "start",
                  gap: "5px",
                  color: "#212121",
                }}
                onClick={() => {
                  handleChange(val.id);
                }}
                startIcon={
                  <Radio
                    checked={props?.State?.fieldOfActivity.includes(val.id)}
                    checkedIcon={
                      <CheckCircleIcon style={{ color: "#FB8C00" }} />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImRadioUnchecked
                        size={24}
                        style={{ border: "1px solid #E0E0E0" }}
                        className="text-white rounded-5"
                      />
                    }
                  />
                }
              >
                {val.name}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="col-12 mt-5 ">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={props.State.isLoading}
          onClick={HandleSendFollowCategory}
        >
          تایید
        </LoadingButton>
      </div>
    </div>
  );
}
