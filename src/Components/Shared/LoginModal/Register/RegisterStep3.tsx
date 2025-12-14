"use client";
import React, { useEffect, useRef, useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import logo from "@/app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import useComplete_RegisterApi from "@/Helpers/CustomHooks/user/useComplete_Register";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import useCompany_LookupApi from "@/Helpers/CustomHooks/company/useCompany_lookup";
import AvatarChanger from "@/Components/Shared/AvatarChanger";

export default function RegisterStep3(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
}) {
  const prevCompanyNameRef = useRef(props.State.companyName);
  const [avatarImage, setAvatarImage] = useState<string>("");
  //complete register
  const { loading_Completed_Register, postData_Completed_Register } =
    useComplete_RegisterApi();
  //lookup company
  const {
    data_Company_Lookup,
    loading_Company_Lookup,
    error_Company_Lookup,
    postData_Company_Lookup,
  } = useCompany_LookupApi();

  useEffect(() => {
    // Check if companyName has at least 3 characters before making the API call
    if (
      !loading_Company_Lookup &&
      props.State.companyName !== prevCompanyNameRef.current &&
      props?.State?.companyName &&
      props.State.companyName.length >= 3
    ) {
      postData_Company_Lookup({
        type: 2, // set 2 to fetch it
        text: props.State.companyName,
      });
      prevCompanyNameRef.current = props.State.companyName;
    }
  }, [
    props.State.companyName,
    loading_Company_Lookup,
    postData_Company_Lookup,
  ]);

  const HandleRegisterStep3 = async () => {
    props.ChangeState({
      ...props.State,
      isLoading: true,
    });
    if (!loading_Completed_Register) {
      if (
        !props.State.name ||
        !props.State.family ||
        !props.State.userName ||
        !props.State.passWord ||
        (props.State.IsCompany &&
          (!props.State.CompanyId || !props.State.positionId))
      ) {
        toast.warning("اطلاعات کامل کنید .");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
        return;
      }

      const data = await postData_Completed_Register({
        FirstName: props.State.name,
        LastName: props.State.family,
        Username: props.State.userName,
        Password: props.State.passWord,
        CompanyId: props.State.IsCompany ? props.State.CompanyId : undefined,
        Post: props.State.IsCompany ? props.State.positionId : undefined,
      });

      if (!data?.success) {
        toast.warning("اطلاعات وارد شده اشتباه است.");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
      } else {
        props.ChangeState({
          ...props.State,
          mode: "Register",
          step: 4,
          isLoading: false,
        });
      }
    }
  };

  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 mb-4">
      <Typography variant="h6" component="h2" className="text-center mt-0">
        <Image alt="LOGO" src={logo} />
      </Typography>
      <div className="col-12 text-center mt-4">
        <AvatarChanger image={avatarImage} setImage={setAvatarImage} />
      </div>
      <h6 className="col-12 text-center mt-3 fs-19 fw-bold">تکمیل ثبت‌نام</h6>
      <div className="d-flex gap-3 mt-4">
        <div className="w-100 mt-3">
          <Typography className=" fs-14 fw-500">نام</Typography>
          <TextField
            className="col-12 text-center  pt-2"
            variant="outlined"
            autoComplete="off"
            value={props.State.name}
            onChange={(e) =>
              props.ChangeState({
                ...props.State,
                name: e.target.value,
              })
            }
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "16px",
                height: "14px",
                borderRadius: "8px",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "48px",
              },
            }}
          />
        </div>
        <div className="w-100  mt-3">
          <Typography className=" fs-14 fw-500">نام خانوادگی</Typography>
          <TextField
            className="col-12 text-center  pt-2"
            variant="outlined"
            value={props.State.family}
            autoComplete="off"
            onChange={(e) =>
              props.ChangeState({
                ...props.State,
                family: e.target.value,
              })
            }
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "16px",
                height: "14px",
                borderRadius: "8px",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "48px",
              },
            }}
          />
        </div>
      </div>
      <div className="col-12 mt-5">
        <Typography className=" fs-14 fw-500">
          یک نام کاربری برای خود انتخاب کنید
        </Typography>
        <div dir="ltr">
          <TextField
            className="col-12 text-center  pt-2"
            variant="outlined"
            value={props.State.userName}
            autoComplete="off"
            onChange={(e) =>
              props.ChangeState({
                ...props.State,
                userName: e.target.value,
              })
            }
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "16px",
                height: "14px",
                borderRadius: "8px",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "48px",
              },
            }}
          />
        </div>
      </div>
      {props.State.mode_message === "new-phone" && (
        <div className="col-12 mt-5">
          <Typography className=" fs-14 fw-500">
            یک رمز عبور برای خود تعیین کنید
          </Typography>
          <div className="col-12" style={{ marginTop: "-26px" }}>
            <div dir="ltr">
              <TextField
                className="col-12 text-center"
                variant="outlined"
                type={props.State.ShowPass ? "text" : "password"}
                value={props.State.passWord}
                autoComplete="off"
                onChange={(e) =>
                  props.ChangeState({
                    ...props.State,
                    passWord: e.target.value,
                  })
                }
                inputProps={{
                  style: {
                    textAlign: "center",
                    fontSize: "16px",
                    height: "14px",
                    borderRadius: "8px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "48px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          props.ChangeState({
                            ...props.State,
                            ShowPass: !props.State.ShowPass,
                          })
                        }
                        edge="end"
                      >
                        {props.State.ShowPass ? (
                          <MdVisibility size={20} />
                        ) : (
                          <MdVisibilityOff size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className=" mx-0 col-12 my-5 d-flex flex-column justify-content-between align-items-center"
        style={{
          background: "#f6f6f6",
          padding: "12px 16px",
          borderRadius: "12px",
        }}
      >
        <div className="d-flex justify-content-between w-100 align-items-center">
          <Typography className=" fs-14 fw-500">
            آیا شما زیرمجموعه یک شرکت ثبت‌ شده‌اید؟
          </Typography>
          <Switch
            //className="col-1"
            id="checkbox-iscompany"
            checked={props.State.IsCompany}
            onChange={(e) =>
              props.ChangeState({
                ...props.State,
                IsCompany: e.target.checked,
              })
            }
            sx={{
              "& .Mui-checked": {
                color: "#548FED",
              },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#548FED",
              },
            }}
          />
        </div>
        {/* <FormControlLabel
          control={
            <Switch
              className="col-1"
              id="checkbox-iscompany"
              checked={props.State.IsCompany}
              onChange={(e) =>
                props.ChangeState({
                  ...props.State,
                  IsCompany: e.target.checked,
                })
              }
            />
          }
          //label="آیا شما زیرمجموعه یک شرکت ثبت‌ شده‌اید؟"
        /> */}
        <div className="col-12 rtl">
          {props.State.IsCompany && (
            <React.Fragment>
              <div className="col-12 mt-4 rtl">
                <Typography className=" fs-14 fw-500 mb-2">
                  انتخاب شرکت
                </Typography>

                <Autocomplete
                  disableClearable
                  disablePortal
                  disableListWrap
                  disabledItemsFocusable
                  options={
                    Array.isArray(data_Company_Lookup.data)
                      ? data_Company_Lookup.data
                      : []
                  }
                  getOptionLabel={(option) => option.title || ""}
                  loading={
                    (props.State.companyName &&
                      props.State.companyName.length <= 3) ||
                    loading_Company_Lookup
                  }
                  loadingText={
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {"...در حال جستجو"}
                    </div>
                  }
                  noOptionsText={
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {"...در حال جستجو"}
                    </div>
                  }
                  onChange={(event, newValue) => {
                    props.ChangeState({
                      ...props.State,
                      CompanyId: newValue?.id || 1,
                      companyName: newValue?.title || "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      value={props.State.companyName}
                      autoComplete="off"
                      onChange={(e) =>
                        props.ChangeState({
                          ...props.State,
                          companyName: e.target.value, // Update companyName in the state
                        })
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          height: "48px",
                          background: "#fff",
                          borderColor: "#e0e0e0",
                        },
                      }}
                    />
                  )}
                />

                {/* Display error message */}
                {error_Company_Lookup && <p>Error: {error_Company_Lookup}</p>}
              </div>
              <div className="col-12 my-4 mt-5">
                <Typography className=" fs-14 fw-500 mb-2">
                  سمت سازمانی{" "}
                </Typography>

                <TextField
                  className="col-12 text-center pt-2"
                  variant="outlined"
                  value={props.State.positionId}
                  autoComplete="off"
                  onChange={(e) =>
                    props.ChangeState({
                      ...props.State,
                      positionId: e.target.value,
                    })
                  }
                  inputProps={{
                    style: {
                      height: "12px",
                      borderRadius: "12px",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: "48px",
                      background: "#fff",
                      borderColor: "#e0e0e0",
                    },
                  }}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="col-12 mt-3">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={props.State.isLoading}
          onClick={HandleRegisterStep3}
        >
          ادامه
        </LoadingButton>
      </div>
    </div>
  );
}
