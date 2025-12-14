import { Typography } from "@mui/material";
import UserAction from "./user-action";
import TheAvatar from "@/Components/common/the-avatar";

interface CompanyUserProps {
  id: number;
  userId: number;
  companyId: number;
  avatar: string | null;
  name: string;
  position: string;
  phoneNumber: string | null;
  verified: boolean;
  meIsOwner: boolean;
  isMember: boolean;
  isOwner: boolean;
  isMe: boolean;
  demandType: number;
  subscriptionAvatar: string | null;
  onReload: () => Promise<void> | null;
  positionId: number | null;
}

const CompanyUser = ({
  id,
  userId,
  companyId,
  avatar,
  name,
  position,
  phoneNumber,
  verified,
  meIsOwner,
  isMember,
  isOwner,
  demandType,
  isMe,
  subscriptionAvatar,
  onReload,
  positionId,
}: CompanyUserProps) => {
  return (
    <div className="d-flex align-items-center justify-content-between MemberCompanyStyle flex-column flex-md-row">
      <div className="d-flex gap-2">
        <div className="px-0 ms-2 position-relative">
          <TheAvatar
            name={name}
            src={avatar || ""}
            height={42}
            width={42}
            isSafe={false}
            isVerified={verified}
            subscriptionAvatar={subscriptionAvatar || ""}
            variant="circular"
          />
        </div>
        <div className="col-12 mx-0 px-0">
          <div className="d-flex gap-2 align-items-center mx-0  mt-0">
            <Typography className="fs-16 fw-500">{name} </Typography>
            {isMe && (
              <Typography className="fs-12 fw-500" sx={{ color: "#FB8C00" }}>
                (خودم)
              </Typography>
            )}
            {isOwner && (
              <Typography className="fs-12 fw-500" sx={{ color: "#FB8C00" }}>
                (مالک)
              </Typography>
            )}
          </div>
          <div className="d-flex gap-2 align-items-center mx-0 mt-0">
            {phoneNumber && (
              <div>
                <Typography className="fs-13 fw-500 greyColor2 mt-0">
                  {phoneNumber}
                </Typography>
              </div>
            )}
            {position && (
              <>
                <div>
                  <Typography className="fs-18 fw-500 greyColor2 mb-1"></Typography>
                </div>
                <div>
                  <Typography className="fs-13 fw-500 greyColor2 mt-0">
                    {position}
                  </Typography>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex gap-2">
        <UserAction
          id={id}
          userId={userId}
          companyId={companyId}
          name={name}
          avatar={avatar}
          phoneNumber={phoneNumber}
          meIsOwner={meIsOwner}
          isMember={isMember}
          isOwner={isOwner}
          demandType={demandType}
          isMe={isMe}
          onReload={onReload}
          positionId={positionId}
        />
      </div>
    </div>
  );
};

export default CompanyUser;
