import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  ACCEPT_REQUEST,
  REJECT_REQUEST,
  CANCEL_DEMAND,
  LEAVE_POSITION,
} from "@/lib/urls";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { IoBan, IoCheckmarkCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { DemandTypeEnum } from "@/Helpers/Interfaces/Enums";
import { HiOutlinePencil } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import DeleteCompany from "@/app/my-profile/my-companies/@componenets/delete-company";

interface CompanyActionProps {
  id: number;
  companyId: number;
  name: string;
  avatar: string | null;
  isMember: boolean;
  isOwner: boolean;
  demandTypeId: number;
  position: string | null;
  isMe: boolean;
  onManage: () => void;
  onEditPosition: () => void;
  onReload: (() => Promise<void>) | null | undefined;
}

const CompanyAction = ({
  id,
  companyId,
  isOwner,
  isMember,
  demandTypeId,
  onManage,
  isMe,
  position,
  onEditPosition,
  onReload,
}: CompanyActionProps) => {
  const requestIsWaiting = demandTypeId === DemandTypeEnum.Request && !isMember;
  const inviteIsWaiting = demandTypeId === DemandTypeEnum.Invite && !isMember;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const onCancel = async () => {
    const url = `${CANCEL_DEMAND}/${id}`;
    const response = await axiosInstance.post<any>(url);
    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload?.();
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const onLeave = async () => {
    const url = `${LEAVE_POSITION}?companyId=${companyId}`;
    const response = await axiosInstance.post<any>(url);

    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload?.();
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const onAcceptInvitation = async () => {
    const url = `${ACCEPT_REQUEST}/${id}`;
    const response = await axiosInstance.post<any>(url);

    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload?.();
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const onRejectInvitation = async () => {
    const url = `${REJECT_REQUEST}/${id}`;
    const response = await axiosInstance.post<any>(url);

    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload?.();
    } else {
      toast.warning(response?.data?.message);
    }
  };
  return (
    <>
      {isOwner ? (
        <div className="d-flex gap-2">
          <Tooltip title="شما مالک این شرکت هستید.">
            <Button
              variant="outlined"
              className="cursor-default"
              sx={{
                border: "1px solid green",
                color: "green",
                height: "36px",
                textWrap: "nowrap",
                "&:hover": {
                  borderColor: "green",
                  color: "green",
                },
              }}
              disableFocusRipple
              disableTouchRipple
              disableElevation
              startIcon={<IoCheckmarkCircleOutline color="green" />}
            >
              مالک شرکت
            </Button>
          </Tooltip>
          <Tooltip title="شرکت را حذف کنید ">
            <Button
              variant="outlined"
              className="cursor-default"
              onClick={handleOpenDeleteModal}
              sx={{
                border: "1px solid red",
                color: "red",
                height: "36px",
                textWrap: "nowrap",
                "&:hover": {
                  borderColor: "red",
                  color: "red",
                },
              }}
            >
              حذف شرکت
            </Button>
          </Tooltip>
          <IconButton
            className="p-0 bg-transparent"
            style={{
              width: "36px",
              height: "36px ",
            }}
            sx={{
              border: "1px solid #0068FF",
              color: "#0068FF",
              "&:hover": {
                borderColor: "#0068FF",
                color: "#0068FF",
              },
            }}
            onClick={() => onManage()}
          >
            <FiUsers size={18} color="#0068ff" />
          </IconButton>
        </div>
      ) : (
        <div className="d-flex gap-1">
          <Typography className="fs-12 fw-500 greyColor2">سمت:</Typography>
          <Typography className="fs-12 text-nowrap">{position}</Typography>
          {requestIsWaiting && (
            <IconButton
              className="p-0 bg-transparent"
              style={{
                width: "15px",
                height: "15px ",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEditPosition();
              }}
            >
              <HiOutlinePencil color="#0068ff" />
            </IconButton>
          )}
        </div>
      )}
      {isMember && isMe && !isOwner && (
        <div className="d-flex justify-content-center gap-2">
          <Button
            className="px-2 d-flex gap-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#D32F2F",
              height: "36px",
              textWrap: "nowrap",
              "&:hover": {
                borderColor: "#D32F2F",
                color: "#D32F2F",
              },
            }}
            disableFocusRipple
            disableTouchRipple
            disableElevation
            startIcon={<IoBan color="#D32F2F" />}
            onClick={() => onLeave()}
          >
            ترک سمت
          </Button>
        </div>
      )}
      {inviteIsWaiting && (
        <div className="d-flex justify-content-center gap-2">
          <Button
            className="px-2 d-flex gap-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#00C853",
              height: "36px",
              textWrap: "nowrap",
              // minWidth: "110px",
              "&:hover": {
                borderColor: "#00C853",
                color: "#00C853",
              },
            }}
            disableFocusRipple
            disableTouchRipple
            disableElevation
            startIcon={<IoCheckmarkCircleOutline color="#00C853" />}
            onClick={() => onAcceptInvitation()}
          >
            قبول دعوت
          </Button>
          <Button
            className="px-2 d-flex gap-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#D32F2F",
              height: "36px",
              // minWidth: "88px",
              textWrap: "nowrap",
              "&:hover": {
                borderColor: "#D32F2F",
                color: "#D32F2F",
              },
            }}
            disableFocusRipple
            disableTouchRipple
            disableElevation
            startIcon={<IoBan color="#D32F2F" />}
            onClick={() => onRejectInvitation()}
          >
            رد دعوت
          </Button>
        </div>
      )}
      {requestIsWaiting && (
        <div className="d-flex justify-content-center gap-2">
          <Button
            className="px-2 d-flex gap-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#D32F2F",
              height: "36px",
              // minWidth: "80px",
              textWrap: "nowrap",
              "&:hover": {
                borderColor: "#D32F2F",
                color: "#D32F2F",
              },
            }}
            disableFocusRipple
            disableTouchRipple
            disableElevation
            startIcon={<IoBan color="#D32F2F" />}
            onClick={() => onCancel()}
          >
            انصراف
          </Button>
        </div>
      )}
      <DeleteCompany
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        companyId={companyId}
        onReload={onReload}
      />
    </>
  );
};

export default CompanyAction;
