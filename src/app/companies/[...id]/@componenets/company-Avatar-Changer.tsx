import React, { useRef, useState, useCallback, useEffect } from "react";
import { IconButton, Button, Modal, Box } from "@mui/material";
import { FiCamera } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/Helpers/utils/cropImage";
import { toast } from "react-toastify";
import { base64ToFile } from "@/lib/utils";
import TheAvatar from "@/Components/common/the-avatar";
import { RiDeleteBinLine } from "react-icons/ri";
import useUpdateCompanyAvatarApi from "@/Helpers/CustomHooks/company/useCompanyAvatarEdite";

interface CompanyAvatarChangerProps {
  companyId: number;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

export const CompanyAvatarChanger: React.FC<CompanyAvatarChangerProps> = ({
  companyId,
  image,
  setImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isClient, setIsClient] = useState(false);
  const {
    loadingUpdateAvatar,
    errorUpdateAvatar,
    successMessage,
    updateAvatar,
    loadingRemoveAvatar,
    errorRemoveAvatar,
    successRemoveMessage,
    removeAvatar,
  } = useUpdateCompanyAvatarApi();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getModalStyle = () => ({
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isClient && window.innerWidth <= 460 ? "100%" : 709,
    height: isClient && window.innerWidth <= 460 ? "100%" : 640,
    bgcolor: "#FDFDFD",
    border: "1px solid #E0E0E0",
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setOpenCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = base64ToFile(croppedImage, "company-avatar.jpg");
      const result = await updateAvatar(companyId, croppedFile);

      if (result?.success) {
        setImage(croppedImage);
        onClickModalClose();
        toast.success(
          successMessage || "آواتار شرکت با موفقیت به‌روزرسانی شد."
        );
      } else {
        toast.error(errorUpdateAvatar || "به‌روزرسانی آواتار انجام نشد.");
      }
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleRemoveAvatar = async () => {
    const result = await removeAvatar(companyId);
    if (result?.success) {
      setImage("");
      toast.success(successRemoveMessage || "آواتار شرکت حذف شد.");
    } else {
      toast.error(errorRemoveAvatar || "حذف آواتار انجام نشد.");
    }
  };

  const onClickModalClose = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setOpenCropModal(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div onClick={!image ? handleClick : undefined}>
        <TheAvatar
          variant="circular"
          name=""
          src={image}
          width={78}
          height={78}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onInput={handleFileInputChange}
        aria-label="Upload avatar image"
        title="Upload avatar image"
      />
      <IconButton
        aria-label={image ? "remove-avatar" : "change-avatar"}
        style={{
          position: "absolute",
          top: -10,
          right: -5,
          background: image ? "#ffebee" : "#e9f2fe",
          width: "36px",
          height: "36px",
        }}
        onClick={image ? handleRemoveAvatar : handleClick}
        disabled={loadingRemoveAvatar}
      >
        {image ? (
          <RiDeleteBinLine style={{ color: "#d32f2f" }} />
        ) : (
          <FiCamera color="#0068ff" />
        )}
      </IconButton>

      <Modal
        open={openCropModal}
        onClose={() => onClickModalClose()}
        className="modal-box change-avatar-preview-modal"
      >
        <Box
          className="rounded-4 d-flex flex-column gap-2"
          sx={getModalStyle()}
          dir="rtl"
        >
          <div className="flex d-flex justify-content-between w-100">
            <CloseIcon
              style={{ color: "#757575", cursor: "pointer" }}
              onClick={() => onClickModalClose()}
            />
            <h5 id="crop-modal-title" className="text-center">
              بارگذاری تصویر پروفایل
            </h5>
            <span></span>
          </div>
          <hr />
          <div className="w-100 h-100">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropSize={{ width: 230, height: 230 }}
                style={{
                  containerStyle: {
                    width: 350,
                    height: 350,
                    marginInline: "auto",
                    borderRadius: "12px",
                    top: "90px",
                  },
                  cropAreaStyle: { width: 230, height: 230 },
                }}
              />
            )}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={loadingUpdateAvatar}
              onClick={handleCrop}
              sx={{
                width: "100%",
                maxWidth: "402px",
                marginTop: 36,
              }}
            >
              انتخاب تصویر
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CompanyAvatarChanger;
