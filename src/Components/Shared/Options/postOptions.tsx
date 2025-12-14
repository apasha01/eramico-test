import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import styles from "./styles.module.css";
import { BsChat } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LuShare } from "react-icons/lu";
import { IoFlagOutline } from "react-icons/io5";
import { AiOutlineRetweet } from "react-icons/ai";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { toast } from "react-toastify";
import { Tooltip, Typography } from "@mui/material";
import CommentModal from "@/Components/comment-modal";
import LikeModal from "@/Components/like-modal";
import RepostModal from "@/Components/repost-modal";

type OptionsMenuProps = {
  id: number;
  entityTypeId?: number;
  handleShare?: () => void;
  handleReply?: () => void;
  commentCount?: number;
  handleRepost?: () => void;
  repostCount?: number;
  handleLike?: (liked: boolean) => void;
  likeCount?: number;
  isLiked?: boolean;
  ReportHandler?: () => void;
  ReportNumber?: number;
  totalVisit?: number;
  entityTypeIdentity?: string;
  disableComment?: boolean;
};

const PostOptions: React.FC<OptionsMenuProps> = ({
  id,
  entityTypeId,
  commentCount = 0,
  repostCount = 0,
  likeCount = 0,
  isLiked = false,
  ReportNumber = 0,
  handleShare,
  handleReply,
  handleRepost,
  handleLike,
  ReportHandler,
  entityTypeIdentity,
  totalVisit,
  disableComment,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [isLogin, setIsLogin] = useState(getToken_Localstorage());

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setIsLogin(getToken_Localstorage());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken_Localstorage()]);

  const onLike = () => {
    if (isLogin) {
      setLiked(!liked);
      if (handleLike) handleLike(!liked);
      return;
    }

    document.getElementById("login-register-main-button")?.click();
    toast.warning("برای لایک کردن باید وارد شوید.");
  };

  const onReply = () => {
    if (isLogin && handleReply) {
      handleReply();
      return;
    }

    document.getElementById("login-register-main-button")?.click();
    toast.warning("برای ثبت نظر باید وارد شوید.");
  };
  const onRepost = () => {
    if (isLogin && handleRepost) {
      handleRepost();
      return;
    }

    document.getElementById("login-register-main-button")?.click();
    toast.warning("برای بازنشر پست باید وارد شوید.");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className={`d-flex ${styles.postCard}`}>
          {!disableComment && handleReply && (
            <Tooltip title={<div dir="rtl">پاسخ</div>}>
              <div className="d-flex align-items-center">
                <Button
                  className="d-flex gap-2 align-items-center greyColor min-width-fit"
                  variant="text"
                  size="small"
                  onClick={onReply}
                  startIcon={<BsChat />}
                />
                <span
                  className="clickable pe-1"
                  onClick={() =>
                    setShowCommentModal(commentCount > 0 ? true : false)
                  }
                >
                  {commentCount}
                </span>
              </div>
            </Tooltip>
          )}
          {handleRepost && (
            <Tooltip title={<div dir="rtl">توصیه</div>}>
              <div className="d-flex align-items-center">
                <Button
                  className="d-flex gap-2 align-items-center greyColor min-width-fit"
                  variant="text"
                  size="small"
                  onClick={onRepost}
                  startIcon={<AiOutlineRetweet />}
                />
                <span
                  className="clickable pe-1"
                  onClick={() =>
                    setShowRepostModal(repostCount > 0 ? true : false)
                  }
                >
                  {repostCount}
                </span>
              </div>
            </Tooltip>
          )}
          {handleLike && (
            <Tooltip title={<div dir="rtl">پسندیدن</div>}>
              <div className="d-flex align-items-center">
                <Button
                  className="d-flex gap-2 align-items-center greyColor min-width-fit"
                  variant="text"
                  size="small"
                  onClick={onLike}
                  startIcon={liked ? <FaHeart color="red" /> : <FaRegHeart />}
                />
                <span
                  className="clickable pe-1"
                  onClick={() => setShowLikeModal(likeCount > 0 ? true : false)}
                >
                  {likeCount}
                </span>
              </div>
            </Tooltip>
          )}
          {handleShare && (
            <Tooltip title={<div dir="rtl">اشتراک‌گذاری</div>}>
              <Button
                className="d-flex gap-2 align-items-center greyColor"
                variant="text"
                size="small"
                onClick={handleShare}
                startIcon={<LuShare />}
              />
            </Tooltip>
          )}
          {ReportHandler && (
            <Button
              className="d-flex gap-2 align-items-center greyColor"
              variant="text"
              size="small"
              onClick={ReportHandler}
              startIcon={<IoFlagOutline />}
            >
              {ReportNumber}
            </Button>
          )}
        </div>

        {entityTypeIdentity === "Vote" && (
          <div
            style={{ padding: "0px 80px 15px 10px" }}
            className="justify-content-end gap-3 align-items-center showInMobileScreen"
          >
            <Typography
              style={{ whiteSpace: "nowrap" }}
              variant="body2"
              className=" fs-14 fw-500"
            >
              کل آراء: {totalVisit || 0}
            </Typography>
          </div>
        )}
        {entityTypeIdentity === "Vote" && (
          <div className="d-flex gap-2 align-items-center justify-between hideInMobileScreen">
            <Typography
              style={{ whiteSpace: "nowrap" }}
              variant="body2"
              className=" fs-14 fw-500"
            >
              کل آراء: {totalVisit || 0}
            </Typography>
          </div>
        )}
      </div>
      {showCommentModal && (
        <CommentModal
          open={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          entityTypeId={entityTypeId}
          id={id}
        />
      )}

      {showRepostModal && (
        <RepostModal
          open={showRepostModal}
          onClose={() => setShowRepostModal(false)}
          entityTypeId={entityTypeId}
          id={id}
        />
      )}
      {showLikeModal && (
        <LikeModal
          open={showLikeModal}
          onClose={() => setShowLikeModal(false)}
          entityTypeId={entityTypeId}
          id={id}
        />
      )}
    </>
  );
};

export default PostOptions;
