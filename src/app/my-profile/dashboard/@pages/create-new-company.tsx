/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { BsArrowRightShort } from "react-icons/bs";
import StepOneRegisterIcon from "../@icons/company/StepOneRegisterIcon";
import StepThreeRegisterIcon from "../@icons/company/StepThreeRegisterIcon";
import StepFourRegisterIcon from "../@icons/company/StepFourRegisterIcon";
import RegisterCompanyStatus from "../@componenets/setCompanyComponents/RegisterCompanyStatus";
import WaitingForValidation from "../@componenets/setCompanyComponents/WaitingForValidation";
import ValidationComplete from "../@componenets/setCompanyComponents/ValidationComplete";
import { baseUrl } from "@/Helpers/axiosInstance/constants";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAppSelector } from "@/lib/hooks";
import PublicInformation from "../@componenets/setCompanyComponents/public-information";
import StepTwoRegisterIcon from "../@icons/company/StepTwoRegisterIcon";
import RegistrationDocumentStep from "../@componenets/setCompanyComponents/registration-document-step";

const steps = [
  {
    title: "ثبت اطلاعات عمومی شرکت",
    icon: <StepOneRegisterIcon />,
  },
  {
    title: "ثبت اطلاعات هویتی شرکت",
    icon: <StepTwoRegisterIcon />,
  },
  {
    title: "بررسی توسط کارشناسان سایت",
    icon: <StepThreeRegisterIcon />,
  },
  {
    title: "دریافت نماد تأیید شرکت",
    icon: <StepFourRegisterIcon />,
  },
];

const CreateNewCompany = ({ onClose }: any) => {
  const user = useAppSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [companyData, setCompanyData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const requiredFields = ["Title", "Address", "Telephone"];
  const [companyId, setCompanyId] = useState<number | null>(null);

  const validateFields = () => {
    let validationErrors: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      if (!companyData[field]) {
        validationErrors[field] = true;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = (updatedValues: Record<string, string>) => {
    setCompanyData((prev) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  const handleSubmit = async (data: any) => {
    if (currentStep < 2 && !validateFields()) {
      toast.error("لطفا تمامی فیلد های اجباری را پر کنید");
      return;
    }
    setLoading(true);

    try {
      // Construct the URL with the parameters
      const url =
        `${baseUrl}/Company/save?id=${user.userId}&` +
        new URLSearchParams(companyData).toString();

      // Make the request using axiosInstance and pass data in params
      const response = await axiosInstance.post<any>(url);

      // Check if the request was successful
      if (response?.status === 200 && response?.data?.success) {
        toast.success("اطلاعات شرکت با موفقیت ثبت شد");
        setCurrentStep(currentStep + 1);
      } else {
        // Log and handle errors returned from the server
        console.error("Error:", response?.data?.message || "Unknown error");
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };
  const handlePublicInformationSubmit = (newCompanyId: number) => {
    setCompanyId(newCompanyId);
    setCurrentStep(1);
  };

  const components = [
    <PublicInformation
      submitPublicInformation={handlePublicInformationSubmit}
      onClose={onClose}
    />,

  <RegistrationDocumentStep
    companyId={companyId}
    onDocumentsSubmit={() => setCurrentStep(2)}
  />,
    <WaitingForValidation />,
    <ValidationComplete />,
  ];

  return (
    <div className="px-5">
      {/* Header and steps */}
      <div className="flex w-full d-flex gap-1 items-center justify-start mb-4">
        <Typography className="fs-14 fw-normal" style={{ color: "#212121" }}>
          اطلاعات شرکت
        </Typography>
        <Typography className="fs-14 fw-normal">/</Typography>
        <Typography className="fs-14 fw-normal" style={{ color: "#757575" }}>
          ویرایش اطلاعات
        </Typography>
      </div>

      <div className="flex w-full d-flex gap-3 items-center justify-start mb-2">
        <IconButton
          className="border black"
          // sx={{  }}
          onClick={onClose}
        >
          <BsArrowRightShort size={24} />
        </IconButton>
        <Typography className="fs-28 fw-normal">مدیریت شرکت</Typography>
      </div>
      <RegisterCompanyStatus steps={steps} currentStep={currentStep} />
      <hr className="my-3" />
      {components[currentStep]}
    </div>
  );
};

export default CreateNewCompany;
