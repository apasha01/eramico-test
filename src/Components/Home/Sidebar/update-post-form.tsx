import { axiosInstance } from "@/Helpers/axiosInstance";
import { SUBMIT_POST } from "@/lib/urls";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Modal,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import { SubmitPost, submitPostSchema } from "@/Helpers/schemas/submit-social";
import { useEffect, useRef, useState } from "react";
import { base64ToFile } from "@/lib/utils";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { IAPIResult } from "@/Helpers/IAPIResult";
import MultiOnlineSearch from "@/Components/common/multi-online-serach";

interface UpdatePostFormProps {
  onModalClose: () => void;
  id: number;
  data:any
  // postData: SubmitPost; // دیتا رو به عنوان props می‌گیریم
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

const UpdatePostForm = ({ onModalClose, data,id }: UpdatePostFormProps) => {
  console.error(data);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<SubmitPost>({
    resolver: zodResolver(submitPostSchema),
    defaultValues: {
      companyId: data.companyId || 0,
      productIds: data.productIds || [],
      context: data.context || "",
    },
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

  const updatePost = async (data: any) => {
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
    formData.append("Id", id.toString()); // اضافه کردن id پست به فرم دیتا
    try {
      const response = await axiosInstance.post<IAPIResult<any[]>>(
        `${SUBMIT_POST}/`, // اینجا با id پست، درخواست PUT می‌زنیم
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
      console.error("Error updating data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );

    updatePost({ ...cleanObject });
  };

  return (
    <Modal
      open={true}
      onClose={onModalClose}
      aria-labelledby="update-modal-name"
      dir="rtl"
      className="modal-box"
    >
      <Box sx={{ ...modalStyle, width: { xs: "90%", sm: "80%", md: 700 } }}>
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onModalClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">ویرایش پست</h3>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <SelectInput
              id="companyId"
              control={form.control}
              options={[]} // اگه لازم باشه مثل قبلی شرکت‌ها رو fetch کن
              label="شرکت"
              placeholder="شرکت را انتخاب کنید"
            />

            <Grid item xs={12} sm={6}>
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

            <TextInput
              name="context"
              control={form.control}
              label="متن پست"
              placeholder="متن پست را وارد کنید"
              multiline={true}
              hasError={!!form.formState.errors.context}
              type="text"
            />

            <MultiOnlineSearch
              name="productIds"
              control={form.control}
              label="محصولات"
              placeholder="محصولات را انتخاب کنید"
            />
          </Grid>
          <div className="d-flex mt-5 justify-content-center">
            <Button variant="contained" className="mt-5 w-100" type="submit">
              ویرایش پست
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdatePostForm;
