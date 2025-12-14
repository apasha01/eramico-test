"use client";

import React, { useState, MouseEvent } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsChat } from "react-icons/bs";
import { RxLoop } from "react-icons/rx";
import { FaArchive, FaPowerOff, FaRegHeart } from "react-icons/fa";
import { LuShare } from "react-icons/lu";
import { IoFlagOutline } from "react-icons/io5";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { PiRecycle } from "react-icons/pi";

type OptionsMenuProps = {
  ShareHandler?: () => void;
  ReplyHandler?: () => void;
  RecommendHandler?: () => void;
  LikeHandler?: (state: boolean) => void;
  ReportHandler?: () => void;
  PendingHandler?: () => void;
  deleteHandler?: () => void;
  editHandler?: () => void;
  archiveHandler?: () => void;
  endInquiries?: () => void;
  isAd?: boolean;
  // جدید
  toggleSpecialOfferHandler?: () => void;
  togglePinSellerHandler?: () => void;
  isSpecialOffer?: boolean; // از API میاد (true/false)
  isPinSeller?: boolean; // از API میاد (true/false)

  className?: string;
  isRepending?: boolean;
};

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  ShareHandler,
  ReplyHandler,
  RecommendHandler,
  PendingHandler,
  endInquiries,
  LikeHandler,
  ReportHandler,
  deleteHandler,
  editHandler,
  archiveHandler,
  isAd = false,
  toggleSpecialOfferHandler,
  togglePinSellerHandler,
  isSpecialOffer = false,
  isPinSeller = false,
  className,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleWithClose = (fn?: () => void) => () => {
    if (fn) fn();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "options-popover" : undefined;

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClick}
        className={className}
        style={{
          minWidth: "32px",
          padding: "4px",
          borderRadius: "50%",
        }}
        aria-label="more options"
        aria-describedby={id}
      >
        <FiMoreHorizontal size={24} />
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="popover" style={{ padding: 8, minWidth: 220 }}>
          {/* اکشن‌های عمومی */}
          {ReplyHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(ReplyHandler)}
              endIcon={<BsChat />}
              aria-label="comment"
            >
              پاسخ
            </Button>
          )}

          {RecommendHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(RecommendHandler)}
              endIcon={<RxLoop />}
              aria-label="re-post"
            >
              توصیه
            </Button>
          )}

          {LikeHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(() => LikeHandler(true))}
              endIcon={<FaRegHeart />}
              aria-label="like"
            >
              پسندیدن
            </Button>
          )}

          {ShareHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(ShareHandler)}
              endIcon={<LuShare />}
              aria-label="share"
            >
              اشتراک‌گذاری
            </Button>
          )}

          {ReportHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(ReportHandler)}
              endIcon={<IoFlagOutline />}
              aria-label="report"
            >
              گزارش
            </Button>
          )}

          {(toggleSpecialOfferHandler || togglePinSellerHandler) && (
            <Divider sx={{ my: 1 }} />
          )}

          {/* پیشنهاد ویژه */}
          {isAd && toggleSpecialOfferHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(toggleSpecialOfferHandler)}
              aria-label="SpecialOffer"
              endIcon={
                isSpecialOffer ? (
                  <StarOutlinedIcon />
                ) : (
                  <StarBorderOutlinedIcon />
                )
              }
            >
              {isSpecialOffer
                ? "حذف از پیشنهاد ویژه"
                : "افزودن به پیشنهاد ویژه"}
            </Button>
          )}

          {/* صدر فروشندگان */}
          {isAd && togglePinSellerHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(togglePinSellerHandler)}
              endIcon={isPinSeller ? <PushPinIcon /> : <PushPinOutlinedIcon />}
            >
              {isPinSeller ? "حذف از صدر فروشندگان" : "افزودن به صدر فروشندگان"}
            </Button>
          )}
          {PendingHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(PendingHandler)}
              endIcon={<PiRecycle />}
            >
              درخواست بررسی مجدد
            </Button>
          )}
          {editHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(editHandler)}
              endIcon={<EditOutlinedIcon />}
            >
              ویرایش
            </Button>
          )}

          {deleteHandler && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(deleteHandler)}
              endIcon={<DeleteOutlineOutlinedIcon />}
            >
              حذف
            </Button>
          )}
          {isAd && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(archiveHandler)}
              endIcon={<FaArchive />}
            >
              آرشیو
            </Button>
          )}
          {!isAd && (
            <Button
              className="d-flex gap-2 align-items-center w-100 justify-content-end"
              variant="text"
              size="small"
              onClick={handleWithClose(endInquiries)}
              endIcon={<PowerSettingsNewIcon />}
            >
              پایان استعلام
            </Button>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default OptionsMenu;
