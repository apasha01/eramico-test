import DeleteModal from "@/Components/common/delete-modal";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  ACCEPT_REQUEST,
  CANCEL_DEMAND,
  CHANGE_OWNERSHIP,
  COMPANY_USER_EDIT,
  EDIT_REQUEST_POSITION,
  LEAVE_POSITION,
  REJECT_REQUEST,
  REMOVE_USER,
} from "@/lib/urls";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { FaArrowPointer, FaRecycle, FaRegCircleCheck } from "react-icons/fa6";
import { IoBan } from "react-icons/io5";
import { TbTrash } from "react-icons/tb";
import { toast } from "react-toastify";
import EditAccessModal from "./edit-access-modal";
import { DemandTypeEnum } from "@/Helpers/Interfaces/Enums";
import { PiPencil, PiReceipt, PiRecord } from "react-icons/pi";
import ConfirmDialog from "@/Components/common/ArchiveItem";
import EditPositionModal from "./edit-position-modal";

interface UserActionProps {
  id: number;
  userId: number;
  companyId: number;
  name: string;
  avatar: string | null;
  phoneNumber: string | null;
  meIsOwner: boolean;
  isMember: boolean;
  isOwner: boolean;
  demandType: number;
  isMe: boolean;
  onReload: () => Promise<void> | null;
  positionId: number | null;
}

const UserAction = ({
  id,
  userId,
  companyId,
  name,
  avatar,
  phoneNumber,
  isOwner,
  meIsOwner,
  isMember,
  demandType,
  isMe,
  onReload,
  positionId,
}: UserActionProps) => {
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showEditAccessModal, setShowEditAccessModal] = useState(false);
  const [showOwnershipChangeModal, setShowOwnershipChangeModal] =
    useState(false);
  const [showChangePositionModal, setShowChangePositionModal] = useState(false);

  const requestIsWaiting = demandType === DemandTypeEnum.Request && !isMember;
  const inviteIsWaiting = demandType === DemandTypeEnum.Invite && !isMember;

  const replyUserRequest = async (url: string) => {
    const response = await axiosInstance.post<any>(`${url}/${id}`);

    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload();
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const removeUser = async () => {
    const response = await axiosInstance.post<any>(
      `${REMOVE_USER}?companyId=${companyId}&userId=${userId}`
    );

    if (response?.data?.success) {
      toast.success(response.data.message);
      setShowRemoveUserModal(false);
      setShowEditAccessModal(false);
      onReload();
    } else {
      toast.warning(response?.data?.message);
    }
  };
  const onCancel = async () => {
    const url = `${CANCEL_DEMAND}/${id}`;
    const response = await axiosInstance.post<any>(url);

    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload();
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const onChangeOwnership = async () => {
    const url = `${CHANGE_OWNERSHIP}?CompanyId=${companyId}&UserId=${userId}`;
    var response = await axiosInstance.post<any>(url);
    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload();
      setShowOwnershipChangeModal(false);
    } else {
      toast.warning(response?.data?.message);
    }
  };

  const onChangePosition = async (newPosition: number) => {
    const url = `${COMPANY_USER_EDIT}?CompanyId=${companyId}&UserId=${userId}&PositionId=${newPosition}`;
    var response = await axiosInstance.post<any>(url);
    if (response?.data?.success) {
      toast.success(response.data.message);
      onReload();
      setShowOwnershipChangeModal(false);
    } else {
      toast.warning(response?.data?.message);
    }
  };
  return (
    <>
      {meIsOwner && !isMe && isMember && (
        <Tooltip title="برای انتقال مالکیت این شرکت به این کاربر کلیک کنید.">
          <Button
            className="py-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#212121",
              "&:hover": {
                color: "#FB8C00",
                borderColor: "#FB8C00",
              },
            }}
            onClick={() => setShowOwnershipChangeModal(true)}
            startIcon={<FaArrowPointer size={16} color="#FB8C00" />}
          >
            انتقال مالکیت
          </Button>
        </Tooltip>
      )}
      {((isMe && isMember) || meIsOwner) && (
        <Tooltip title="برای تغییر سمت این کاربر کلیک کنید.">
          <Button
            className="py-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#212121",
              "&:hover": {
                color: "#FB8C00",
                borderColor: "#FB8C00",
              },
            }}
            onClick={() => setShowChangePositionModal(true)}
            startIcon={<PiRecord size={16} color="#FB8C00" />}
          >
            تغییر سمت
          </Button>
        </Tooltip>
      )}
      {meIsOwner && requestIsWaiting ? (
        <div className="d-flex gap-2">
          <Button
            className="py-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#00C853",
              "&:hover": {
                color: "#00C853",
                borderColor: "#00C853",
              },
            }}
            startIcon={<FaRegCircleCheck color="#00C853" />}
            onClick={() => replyUserRequest(ACCEPT_REQUEST)}
          >
            تایید درخواست
          </Button>
          <Button
            className="py-2"
            variant="outlined"
            sx={{
              border: "1px solid #E0E0E0",
              color: "#D32F2F",
              "&:hover": {
                color: "#D32F2F",
                borderColor: "#D32F2F",
              },
            }}
            onClick={() => replyUserRequest(REJECT_REQUEST)}
            startIcon={<IoBan color="#D32F2F" />}
          >
            رد درخواست
          </Button>
        </div>
      ) : meIsOwner && inviteIsWaiting ? (
        <Button
          className="py-1 text-nowrap"
          variant="outlined"
          sx={{
            border: "1px solid #E0E0E0",
            color: "#D32F2F",
            "&:hover": {
              color: "#D32F2F",
              borderColor: "#D32F2F",
            },
          }}
          onClick={onCancel}
          startIcon={<IoBan color="#D32F2F" />}
        >
          انصراف از دعوت
        </Button>
      ) : (
        meIsOwner &&
        !isMe &&
        !isOwner && (
          <div className="d-flex gap-2">
            <Button
              className="py-2"
              variant="outlined"
              sx={{
                border: "1px solid #E0E0E0",
                color: "#212121",
                "&:hover": {
                  color: "#FB8C00",
                  borderColor: "#FB8C00",
                },
              }}
              startIcon={<PiPencil size={16} color="#FB8C00" />}
              onClick={() => setShowEditAccessModal(true)}
            >
              ویرایش دسترسی
            </Button>
            <Tooltip title="حذف کاربر از شرکت">
              <IconButton
                style={{
                  border: "1px solid red",
                  color: "red",
                  width: "36px",
                  height: "36px ",
                  backgroundColor: "#fff ",
                  padding: "4px",
                }}
                onClick={() => setShowRemoveUserModal(true)}
              >
                <TbTrash color="red" />
              </IconButton>
            </Tooltip>
          </div>
        )
      )}
      {showRemoveUserModal && (
        <DeleteModal
          show={showRemoveUserModal}
          submitText="حذف کاربر"
          title="آیا مطمئن هستید که میخواهید کاربر را حذف کنید؟"
          text="با حذف کاربر از شرکت، تمامی اطلاعات این کاربر از صفحه شرکت شما حذف خواهدشد و قابل بازگردانی نمی‌باشد."
          onClose={() => setShowRemoveUserModal(false)}
          onSubmit={removeUser}
        />
      )}
      {showEditAccessModal && (
        <EditAccessModal
          userId={userId}
          companyId={companyId}
          show={showEditAccessModal}
          onClose={() => setShowEditAccessModal(false)}
          name={name}
          avatar={avatar}
          phoneNumber={phoneNumber}
        />
      )}
      {showOwnershipChangeModal && (
        <ConfirmDialog
          title="تغییر مالکیت شرکت"
          submitText="بله تایید می‌کنم"
          onSubmit={() => onChangeOwnership()}
          onClose={() => setShowOwnershipChangeModal(false)}
          open={showOwnershipChangeModal}
          text={`آیا از تغییر مالکیت شرکت به ${name} اطمینان دارید؟ پس از تایید، شما به عنوان یک عضو عادی در این شرکت خواهید بود.`}
          submitColor="green"
        />
      )}

      {showChangePositionModal && (
        <EditPositionModal
          id={id}
          positionId={positionId}
          show={showChangePositionModal}
          onClose={() => setShowChangePositionModal(false)}
          onUpdated={({ positionId }) => onChangePosition(positionId)}
          onlySelector={true}
        />
      )}
    </>
  );
};

export default UserAction;
