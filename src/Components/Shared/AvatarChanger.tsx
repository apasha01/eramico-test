import React, { useRef, useState, useCallback, useEffect } from "react";
import { Avatar, IconButton, Button, Modal, Box } from "@mui/material";
import { FiCamera } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/Helpers/utils/cropImage"; // Ensure this is implemented
import CloseIcon from "@mui/icons-material/Close";
import useUpdateAvatarApi from "@/Helpers/CustomHooks/user/useAvatarUpdate";
import { toast } from "react-toastify";
import { updateUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { base64ToFile } from "@/lib/utils";
import TheAvatar from "../common/the-avatar";

interface AvatarWithCameraProps {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

export const AvatarChanger: React.FC<AvatarWithCameraProps> = ({
  image,
  setImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
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
  } = useUpdateAvatarApi();

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = base64ToFile(croppedImage, "avatar.jpg");
      const result = await updateAvatar(croppedFile);
      if (result?.success) {
        setImage(croppedImage);
        dispatch(updateUser({ avatar: croppedImage }));
        onClickModalClose();
        toast.success(successMessage);
      } else {
        toast.warning(errorUpdateAvatar);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onClickModalClose = () => {
    fileInputRef.current!.value = "";
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setOpenCropModal(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div onClick={handleClick}>
        <TheAvatar variant="circular" name="" src={image} width={78} height={78} />
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
        aria-label="change-avatar"
        style={{
          position: "absolute",
          top: -10,
          right: -5,
          background: "#e9f2fe",
          width: "36px",
          height: "36px",
        }}
        onClick={handleClick}
      >
        <FiCamera color="#0068ff" />
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
            {" "}
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

export default AvatarChanger;
