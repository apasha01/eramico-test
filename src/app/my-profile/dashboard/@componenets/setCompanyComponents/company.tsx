"use client";

import { Button, Tooltip, Typography } from "@mui/material";
import { LuClock3 } from "react-icons/lu";
import { useState } from "react";
import CompanyUsers from "./company-users";
import EditPositionModal from "./edit-position-modal";
import TheAvatar from "@/Components/common/the-avatar";
import { DemandTypeEnum } from "@/Helpers/Interfaces/Enums";
import CompanyAction from "./company-action";
import { useRouter } from "next/navigation";

interface CompanyProps {
  id: number;
  companyId: number;
  positionId: number;
  demandTypeId: number;
  position: string | null;
  isOwner: boolean;
  isMember: boolean;
  avatar: string | null;
  name: string;
  introduction: string;
  subscriptionAvatar: string | null;
  isSafe?: boolean;
  isVerified?: boolean;
  onReload: (() => Promise<void>) | null | undefined;
}

const Company = ({
  id,
  companyId,
  positionId,
  demandTypeId,
  position,
  isOwner,
  isMember,
  avatar,
  name,
  introduction,
  subscriptionAvatar,
  isSafe = false,
  isVerified = false,
  onReload,
}: CompanyProps) => {
  const [showUsers, setShowUsers] = useState(false);
  const [showEditPoisitionModal, setShowEditPositionModal] = useState(false);

  // ✅ state محلی برای نمایش بی‌درنگ (بدون refresh)
  const [localPositionId, setLocalPositionId] = useState(positionId);
  const [localPositionTitle, setLocalPositionTitle] = useState(position || "");

  const isWaiting =
    demandTypeId === DemandTypeEnum.Request && !isMember && !isOwner;

  const router = useRouter();

  const onOpen = () => {
    if (isWaiting) return;
    setShowUsers((p) => !p);
  };

  const companyDetail = () => {
    router.push("/companies/" + companyId);
  };

  return (
    <>
      <div
        className="containerStyle"
        style={{ cursor: "pointer" }}
        onClick={companyDetail}
      >
        <div
          className="d-flex flex-column flex-sm-row gap-3 align-items-flex-start justify-content-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className={!isWaiting ? "clickable" : ""}
            style={{ opacity: isWaiting ? "0.6" : "1", width: "fit-content" }}
          >
            <TheAvatar
              name={name}
              src={avatar || ""}
              subscriptionAvatar={subscriptionAvatar}
              height={68}
              width={68}
              isSafe={isSafe}
              isVerified={isVerified}
              variant="circular"
            />
          </div>

          <div className="d-flex w-100 align-items-center justify-content-between flex-column flex-md-row gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              style={{ opacity: isWaiting ? "0.5" : "1" }}
            >
              <div className="d-flex gap-2">
                <Tooltip title={name}>
                  <Typography className="fs-23 fw-500 truncate-text">
                    {name}
                  </Typography>
                </Tooltip>
                {!isWaiting && (
                  <Button
                    variant="text"
                    style={{ color: "#006aff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      companyDetail();
                    }}
                  >
                    مشاهده شرکت
                  </Button>
                )}
              </div>

              <Typography className="fs-13 fw-500 greyColor2 mt-2">
                {introduction
                  ? introduction.length > 200
                    ? introduction.slice(0, 100) + " ..."
                    : introduction
                  : ""}
              </Typography>
            </div>

            <div
              className="d-flex align-items-center justify-content-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {isWaiting && (
                <div style={{ minWidth: "110px" }}>
                  <Typography className="col fs-12 fw-500">
                    <LuClock3 /> در انتظار تایید شرکت
                  </Typography>
                </div>
              )}

              <div
                className="d-flex align-items-center justify-content-between gap-2 col"
                onClick={(e) => e.stopPropagation()}
              >
                <CompanyAction
                  companyId={companyId}
                  id={id}
                  name={name}
                  avatar={avatar}
                  isMember={isMember}
                  isOwner={isOwner}
                  demandTypeId={demandTypeId}
                  // ⬇️ از state محلی برای نمایش سمت استفاده می‌کنیم
                  position={localPositionTitle}
                  onEditPosition={() => setShowEditPositionModal(true)}
                  onManage={() => setShowUsers((p) => !p)}
                  isMe={true}
                  onReload={onReload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditPoisitionModal && (
        <EditPositionModal
          id={id}
          positionId={localPositionId}
          show={showEditPoisitionModal}
          onClose={() => setShowEditPositionModal(false)}
          onUpdated={({ positionId, title }) => {
            setLocalPositionId(positionId);
            setLocalPositionTitle(title); // val.title
          }}
        />
      )}

      {showUsers && <CompanyUsers id={companyId} />}
    </>
  );
};

export default Company;
