import { axiosInstance } from "@/Helpers/axiosInstance";
import { SUBMIT_POST, SUBMIT_POST_COMPANIES } from "@/lib/urls";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Radio,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import { SubmitPost, submitPostSchema } from "@/Helpers/schemas/submit-social";
import { useEffect, useRef, useState } from "react";
import { base64ToFile } from "@/lib/utils";
import MultiOnlineSearch from "./common/multi-online-serach";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { useAppSelector } from "@/lib/hooks";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

interface SubmitPostFormProps {
  onModalClose: () => void;
}

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SubmitPostForm = ({ onModalClose }: SubmitPostFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [forMe, setForMe] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);

  const [fileName, setFileName] = useState<string>("");
  const [options, setOptions] = useState<any>({
    PostCompanyId: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(SUBMIT_POST_COMPANIES),
        ]);

        results.forEach((result, index) => {
          const optionKeys = ["PostCompanyId"];
          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: result.value.data.success
                ? result.value.data.data
                : [],
            }));

            // بعد از ست شدن options، default value فرم را بروز کن
            const defaultCompanyId =
              result.value.data.data.find((item: any) => item.isOwner)?.id ||
              result.value.data.data[0]?.id ||
              0;

            form.reset({
              ...form.getValues(), // نگه داشتن بقیه فیلدها
              companyId: defaultCompanyId,
            });
          } else {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: [],
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const defaultValues = {
    companyId: 0,
    productIds: [],
    context: "",
  };

  const form = useForm<SubmitPost>({
    resolver: zodResolver(submitPostSchema),
    defaultValues,
  });

  const handleFileInputChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result as string;
        const croppedFile = base64ToFile(base64, "media.jpg");
        setFile(croppedFile);
        setFileName(file.name);
      };

      reader.onerror = () => {
        toast.error("Failed to read the file.");
      };
    }
  };

  const savePost = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]: any) => {
      if (key !== "productIds") {
        formData.append(key, value as string);
      } else {
        value.forEach((id: number) => {
          formData.append("ProductIds[]", id.toString());
        });
      }
    });

    if (file) formData.append("file", file);

    try {
      const response = await axiosInstance.post<IAPIResult<any[]>>(
        SUBMIT_POST,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        document.getElementById("refresh-posts")?.click();
        onModalClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );

    savePost({ ...cleanObject });
  };

  const defaultCompany =
    options["PostCompanyId"]?.find((item: any) => item.isOwner)?.id ||
    options["PostCompanyId"]?.[0]?.id;

  return (
    <Modal
      open={true}
      onClose={onModalClose}
      aria-labelledby="delete-modal-name"
      dir="rtl"
      className="modal-box"
    >
      <Box sx={{ ...modalStyle, width: { xs: "90%", sm: "80%", md: 450 } }}>
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onModalClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">ثبت پست</h3>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {defaultCompany && (
              <Grid item xs={12}>
                <SelectInput
                  id="companyId"
                  control={form.control}
                  options={options["PostCompanyId"]}
                  label="شرکت"
                  sm={12}
                  placeholder="شرکت را انتخاب کنید"
                  disabled={forMe}
                />
              </Grid>
            )}

            <Grid item sm={12}>
              <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                }}
                onClick={() => {
                  setForMe(!forMe);
                  form.setValue("companyId", forMe ? defaultCompany || 0 : 0);
                }}
                startIcon={
                  <Radio
                    checked={forMe === true}
                    checkedIcon={
                      <ImCheckboxChecked
                        size={24}
                        style={{ color: "#FB8C00" }}
                      />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImCheckboxUnchecked
                        size={24}
                        style={{ color: "#E0E0E0" }}
                      />
                    }
                  />
                }
              >
                <Typography fontSize={12} fontWeight={500} color={"black"}>
                  ارسال توسط خودم
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextInput
                name="context"
                control={form.control}
                label="متن پست"
                placeholder="متن پست را وارد کنید"
                multiline={true}
                sm={12}
                hasError={!!form.formState.errors.context}
                type="text"
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel
                className="fs-14 mb-2 fw-400"
                style={{ color: "#9E9E9E99" }}
              >
                فایل
              </InputLabel>
              <div
                className="input-border d-flex align-items-center"
                style={{ position: "relative" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                  placeholder="انتخاب فایل"
                />
                <IconButton
                  className="fs-14 h-100 fw-400 d-flex align-items-center"
                  style={{ color: "#b0b0b0" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AttachFileOutlinedIcon />
                </IconButton>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: fileName ? "#000" : "#b0b0b0",
                    cursor: "pointer",
                  }}
                  className="d-flex text-nowrap align-items-center w-100 clickable fs-13"
                  onClick={() => fileInputRef.current?.click()}
                  title={fileName || "انتخاب فایل"}
                >
                  {fileName || "انتخاب فایل"}
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <MultiOnlineSearch
                name="productIds"
                control={form.control}
                sm={12}
                label="محصولات"
                placeholder="محصولات را انتخاب کنید"
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" className="mt-5 w-100" type="submit">
                ثبت پست
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default SubmitPostForm;
