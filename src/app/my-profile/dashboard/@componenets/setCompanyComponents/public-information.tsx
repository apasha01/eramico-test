import TextInput from "@/Components/common/text-input";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  PublicInformationForm,
  publicInformationFormSchema,
} from "@/Helpers/schemas/new-company";
import { SAVE_COMPANY } from "@/lib/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActivityContext from "./activity-context";

interface PublicInformationProps {
  submitPublicInformation: any;
  onClose: any;
}

const PublicInformation = ({
  submitPublicInformation,
  onClose,
}: PublicInformationProps) => {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const defaultValues = {
    Title: "",
    Code: "",
    RegistrationCode: "",
    NationalCode: "",
    EconomyCode: "",
    Email: "",
    Address: "",
    Telephone: "",
    Fax: "",
    Webpage: "",
    CEOName: "",
    CEOPhone: "",
    CEOEmail: "",
    ShortIntroduction: "",
  };

  const form = useForm<PublicInformationForm>({
    resolver: zodResolver(publicInformationFormSchema),
    defaultValues,
  });
  const saveCompany = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    selectedValues.forEach((id) => {
      formData.append("CategoryIds[]", id.toString());
    });

    try {
      const response = await axiosInstance.post(SAVE_COMPANY, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        const newCompanyId = response.data.data;
        submitPublicInformation(newCompanyId);
      }
    } catch (error: any) {
      const serverResponse = error.response?.data;

      if (
        Array.isArray(serverResponse?.data) &&
        serverResponse.data.length > 0
      ) {
        toast.error(serverResponse.data[0].error);
      } else if (serverResponse?.message) {
        toast.error(serverResponse.message);
      } else {
        toast.error("خطایی در ارتباط با سرور رخ داده است.");
      }

      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );
    saveCompany(cleanObject);
  };

  return (
    <Box>
      <Typography className="fs-28 mt-4 mb-2 fw-normal">
        تکمیل اطلاعات شرکت
      </Typography>
      <form className="mt-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <TextInput
            name="Title"
            control={form.control}
            placeholder="نام شرکت"
            type="text"
            hasError={!!form.formState.errors.Title}
            sm={4}
            required
          />
          <TextInput
            name="Code"
            control={form.control}
            placeholder="کد یکتای شرکت"
            type="text"
            hasError={!!form.formState.errors.Code}
            sm={4}
            required
            helperText="ادرس صفحه اختصاصی شما در ارانیکو"
          />
          <TextInput
            name="RegistrationCode"
            control={form.control}
            placeholder="شناسه ثبت"
            type="text"
            sm={4}
          />
          <TextInput
            name="NationalCode"
            control={form.control}
            placeholder="شناسه ملی"
            type="text"
            sm={4}
          />
          <TextInput
            name="EconomyCode"
            control={form.control}
            placeholder="شناسه اقتصادی"
            type="text"
            sm={4}
          />
          <TextInput
            name="Email"
            control={form.control}
            placeholder="پست الکترونیک شرکت"
            type="text"
            sm={4}
          />
          <TextInput
            name="Telephone"
            control={form.control}
            placeholder="تلفن ثابت"
            type="text"
            sm={4}
          />
          <TextInput
            name="Fax"
            control={form.control}
            placeholder="فکس"
            type="text"
            sm={4}
          />
          <TextInput
            name="Webpage"
            control={form.control}
            placeholder="آدرس وب‌سایت"
            type="text"
            sm={4}
          />

          <TextInput
            name="CEOName"
            control={form.control}
            placeholder="نام مدیرعامل"
            type="text"
            sm={4}
          />
          <TextInput
            name="CEOPhone"
            control={form.control}
            placeholder="شماره تماس مدیرعامل"
            type="text"
            sm={4}
          />
          <TextInput
            name="CEOEmail"
            control={form.control}
            placeholder="پست الکترونیک مدیرعامل"
            type="text"
            sm={4}
          />
          <TextInput
            name="Address"
            control={form.control}
            placeholder="آدرس"
            type="text"
            sm={8}
          />
          <TextInput
            name="ShortIntroduction"
            control={form.control}
            placeholder="معرفی کوتاه"
            type="text"
            sm={8}
          />
        </Grid>
        <ActivityContext
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
        <hr className="my-5" />
        <div className="w-100 d-flex justify-content-between">
          <LoadingButton
            variant="contained"
            color="primary"
            className="fs-14 fw-500 px-5"
            type="submit"
            //   loading={loading}
            //   disabled={currentStep >= 2}
          >
            تایید
          </LoadingButton>
          <Button
            onClick={onClose}
            className="border fs-14 fw-500 px-5"
            variant="text"
            style={{ borderRadius: "12px" }}
          >
            لغو
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default PublicInformation;
