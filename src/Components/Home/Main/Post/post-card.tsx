"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Box,
} from "@mui/material";
import Link from "next/link";
import PostOptions from "@/Components/Shared/Options/postOptions";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import {
  ADD_COMMENT,
  LIKE,
  ADD_REPOST,
  REMOVE_LIKE,
  SUBMIT_POST,
} from "@/lib/urls";
import AddComment from "./add-comment";
import ShareModal from "@/Components/common/share-modal";
import { COMPANY, PROFILE, SINGLE_CONTENT } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import TheAvatar from "@/Components/common/the-avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { TbEdit, TbTrash } from "react-icons/tb";
import DeleteModal from "@/Components/common/delete-modal";
import SubmitVoteForm from "@/Components/submit-vote-form";
import { mainUrl } from "@/Helpers/axiosInstance/constants";

import Lightbox from "@/Components/common/lightbox";

export type Post = {
  id?: number | string;
  userId?: number;
  companyId?: number;
  to?: string;
  username?: string;
  isMine?: boolean;
  name?: string | null;
  description?: string;
  createdDate?: string;
  children?: React.ReactNode;
  repostCount?: number;
  likeCount?: number;
  type?: "user" | "company";
  totalVisit?: number;
  disablePostOption?: boolean;
  entityId?: any;
  isParticipated?: boolean | null;
  entityTypeIdentity?: string;
  entityTypeId?: any;
  isLiked?: boolean;
  avatar?: string | null;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  userCompanyId?: number;
  commentCount?: number;
  title?: string;
  lead?: string;
  handleUserClick?: any;
  handleClick?: any;
  showFullPost?: boolean;
  disableComment?: boolean;
  verified?: boolean;
  isSafe?: boolean;
  subscriptionAvatar?: string;
  createdDatePersian?: string;
  media?: string;
};

const PostCard = ({
  id,
  userId,
  companyId,
  to,
  username = "",
  name = "",
  description,
  createdDate,
  createdDatePersian,
  repostCount,
  likeCount,
  commentCount,
  isMine = false,
  entityId,
  entityTypeIdentity,
  entityTypeId,
  type,
  totalVisit,
  disablePostOption,
  children,
  isLiked,
  avatar = "",
  userCompanyTitle,
  userPositionTitle,
  userCompanyId,
  title,
  lead,
  handleUserClick,
  showFullPost,
  handleClick,
  disableComment,
  verified,
  isSafe,
  subscriptionAvatar,
  media = "",
}: Post) => {
  const [currentDescription, setCurrentDescription] = useState(
    description || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    currentDescription || ""
  );
  const [updateLoading, setUpdateLoading] = useState(false);
  const sanitizedHtml = currentDescription?.replace(/\n/g, "<br />");
  const [likeNumber, setLikeNumber] = useState(likeCount ?? 0);
  const [repostNumber, setRepostNumber] = useState(repostCount ?? 0);
  const [commentNumber, setCommentNumber] = useState(commentCount ?? 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [openComment, setOpenComment] = useState(false);
  const [openRepost, setOpenRepost] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openVoteEditModal, setOpenVoteEditModal] = useState(false);

  const profileLink = companyId
    ? COMPANY(companyId.toString())
    : userId
    ? PROFILE(userId.toString())
    : entityTypeIdentity === "Content"
    ? SINGLE_CONTENT(id?.toString() || "")
    : "/";

  useEffect(() => {
    setCurrentDescription(description || "");
  }, [description]);

  useEffect(() => {
    if (isEditing) {
      setEditedDescription(currentDescription || "");
    }
  }, [isEditing, currentDescription]);

  useEffect(() => {
    if (likeCount) setLikeNumber(likeCount);
    if (commentCount) setCommentNumber(commentCount);
  }, [likeCount, commentCount]);

  const profileClicked = async () => {
    if (companyId) await saveEntityClick(companyId, EntityTypeEnum.Company);
    else if (userId) await saveEntityClick(userId, EntityTypeEnum.User);
  };

  const handleLike = async (state: boolean) => {
    if (!entityId || !entityTypeIdentity) return;
    let url = "";

    url = state
      ? `${LIKE}?EntityTypeId=${entityTypeId}&entityId=${entityId}`
      : `${REMOVE_LIKE}-${entityTypeIdentity.toLowerCase()}/${entityId}`;
    try {
      const response = await axiosInstance.post(url);
      if (response.data.success) {
        setLikeNumber((prev) => prev + (state ? 1 : -1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitComment = async (commentType: string) => {
    const formData = new FormData();
    formData.append("entityId", entityId);
    formData.append("EntityTypeId", entityTypeId);
    formData.append(
      commentType === "postComment" ? "Body" : "Context",
      commentBody
    );

    if (!commentBody.trim()) return;
    setLoading(true);
    try {
      let url = commentType === "postComment" ? ADD_COMMENT : ADD_REPOST;
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setCommentBody("");
        commentType === "postComment"
          ? setCommentNumber(commentNumber + 1)
          : setRepostNumber(repostNumber + 1);
        if (commentType !== "postComment") {
          document.getElementById("refresh-posts")?.click();
        }
        setOpenComment(false);
        setOpenRepost(false);
      } else {
        toast.error(
          response?.data?.message || "خطایی رخ داده است. لطفا دوباره تلاش کنید"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (
      !id ||
      !editedDescription.trim() ||
      editedDescription === currentDescription
    ) {
      setIsEditing(false);
      return;
    }

    setUpdateLoading(true);
    try {
      const formData = new FormData();
      let url = "";
      let bodyField = "Context";

      if (entityTypeIdentity === "Post") {
        url = `${SUBMIT_POST}/`;
      } else if (entityTypeIdentity === "Repost") {
        url = `${ADD_REPOST}/`;
      } else {
        setUpdateLoading(false);
        return;
      }

      formData.append(bodyField, editedDescription);
      formData.append("Id", id.toString());

      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setCurrentDescription(editedDescription);
        toast.success(
          response.data.message || `${entityTypeIdentity} با موفقیت به روز شد.`
        );
        setIsEditing(false);
        document.getElementById("refresh-posts")?.click();
      } else {
        toast.error(
          response?.data?.message ||
            `خطا در به روزرسانی ${entityTypeIdentity}. لطفا دوباره تلاش کنید.`
        );
      }
    } catch (error) {
      console.error("Error updating content:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditVote = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    handleMenuClose();
    setOpenVoteEditModal(true);
  };

  const htmlToRender = showFullPost
    ? sanitizedHtml || ""
    : sanitizedHtml
    ? sanitizedHtml.slice(0, 200) + "..."
    : "";

  const avatarIsRectangle =
    (type && type === "company") || entityTypeIdentity === "Content";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditedDescription(currentDescription || "");
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeletePost = () => {
    handleMenuClose();
    if (!id) {
      return;
    }
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    setOpenDeleteModal(false);
    if (!id) return;
    try {
      let base = "";
      if (entityTypeIdentity === "Post") base = "Post";
      else if (entityTypeIdentity === "Repost") base = "Repost";
      else if (entityTypeIdentity === "Vote") base = "Vote";
      else {
        return;
      }
      const url = `/${base}/remove/${id}`;
      const res = await axiosInstance.post(url);
      if (res?.data?.success) {
        toast.success(res.data?.message || "پست با موفقیت حذف شد");
        document.getElementById("refresh-posts")?.click();
      } else {
        toast.error(res?.data?.message || "خطا در حذف محتوا");
      }
    } catch (err) {
      toast.error("خطای سرور");
    }
  };

  const openImageLightbox = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    const imageSrc = media;
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="w-100">
          <TextField
            multiline
            fullWidth
            variant="outlined"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={4}
            dir="rtl"
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                textAlign: "right",
              },
            }}
          />
          <div className="d-flex gap-2 justify-content-end mt-2">
            <Button
              variant="contained"
              color="success"
              style={{
                borderRadius: "6px",
                height: "40px",
              }}
              onClick={handleUpdatePost}
              disabled={
                updateLoading ||
                editedDescription === currentDescription ||
                !editedDescription.trim()
              }
            >
              {updateLoading ? "در حال ویرایش..." : "ذخیره "}
            </Button>
            <Button
              style={{ borderRadius: "6px", height: "40px" }}
              variant="outlined"
              color="secondary"
              onClick={() => setIsEditing(false)}
              disabled={updateLoading}
            >
              لغو
            </Button>
          </div>
        </div>
      );
    }
    return (
      <>
        <Box
          component={showFullPost ? Box : Link}
          href={to || ""}
          scroll={true}
          passHref
        >
          <Typography
            variant="body2"
            className="col-12 d-flex gap-1 mt-2 fs-14 fw-500 sm-fs-12 fw-400 text-justify"
            style={{
              whiteSpace: "pre-wrap",
              textJustify: "inter-word",
            }}
            dangerouslySetInnerHTML={{
              __html:
                entityTypeId == EntityTypeEnum.Content
                  ? lead || htmlToRender
                  : htmlToRender,
            }}
          />
        </Box>

        {media && (
          <div className="w-100 d-flex justify-content-center p-4">
            <div className="w-50">
              <Lightbox
                loading="lazy"
                src={media}
                alt={title || ""}
                className={`rounded-3 clickable`}
                width={0}
                height={0}
                sizes="100vw"
                style={{ height: "auto", width: "100%" }}
                quality={100}
                onClick={openImageLightbox}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="row p-3 pt-2 mobileFlex mobileLeftPadding post-card w-100">
        <div
          className="container p-0"
          id={entityTypeIdentity + entityId?.toString()}
        >
          <div className="row p-0 m-0">
            <div className="col-12 px-0 p-3 pb-2 rtl mt-1 d-flex gap-2 align-items-start justify-content-between">
              <div className="d-flex gap-3 align-items-start w-100">
                <Link
                  href={profileLink}
                  scroll={false}
                  className="d-flex"
                  aria-label="Click to view profile"
                  onClick={profileClicked}
                >
                  <TheAvatar
                    name={name || username || title || "avatar"}
                    src={avatar || ""}
                    isVerified={verified}
                    isSafe={isSafe}
                    subscriptionAvatar={subscriptionAvatar}
                    variant={avatarIsRectangle ? "square" : "circular"}
                    width={60}
                    height={60}
                  />
                </Link>
                <div className="w-100" onClick={handleClick}>
                  <div className="px-0 sm-margin-content">
                    <div className="d-flex gap-2 align-items-center">
                      {(name || username) && (
                        <Link
                          href={profileLink}
                          scroll={false}
                          onClick={handleUserClick}
                          aria-label="Click to view profile"
                          className="d-flex gap-2"
                        >
                          {name && (
                            <Typography
                              variant="body1"
                              className="fs-16 sm-fs-12 fw-500 "
                            >
                              {name}
                            </Typography>
                          )}
                          {username && (
                            <Typography
                              variant="body2"
                              className="fs-16 sm-fs-12 fw-500 ltr"
                            >
                              @{username}
                            </Typography>
                          )}
                        </Link>
                      )}

                      <Tooltip
                        title={createdDatePersian || ""}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="body2"
                          className="fs-14 sm-fs-10 fw-500"
                        >
                          {createdDate}
                        </Typography>
                      </Tooltip>
                    </div>

                    {entityTypeId === EntityTypeEnum.Content && title && (
                      <Link href={to || ""} scroll={true} passHref>
                        <Typography
                          variant="body1"
                          className="fs-20 fw-500 pt-2 fs-12 sm-fs-16"
                          aria-label="Click to view post"
                        >
                          {title}
                        </Typography>
                      </Link>
                    )}

                    <div className="d-flex my-2 gap-2 align-items-center user-company-information fs-12">
                      {userCompanyTitle && userPositionTitle && (
                        <>
                          <Typography variant="body2" className="fs-14 fw-400">
                            {userPositionTitle}{" "}
                          </Typography>
                          <Link
                            className="fs-14 fs-12 fw-400 post-company-link"
                            href={COMPANY(userCompanyId?.toString() || "")}
                            passHref
                            aria-label="Click to view company page"
                          >
                            {userCompanyTitle}
                          </Link>
                        </>
                      )}
                    </div>

                    {!isEditing && renderContent()}
                  </div>
                </div>
              </div>

              {isMine && (
                <>
                  <IconButton onClick={handleMenuOpen} size="small">
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {entityTypeIdentity === "Vote" ? (
                      <MenuItem
                        style={{ display: "flex", gap: "5px" }}
                        onClick={handleEditVote}
                      >
                        <TbEdit />
                        ویرایش
                      </MenuItem>
                    ) : (
                      <MenuItem
                        style={{ display: "flex", gap: "5px" }}
                        onClick={handleEditClick}
                      >
                        <TbEdit />
                        ویرایش
                      </MenuItem>
                    )}

                    <MenuItem
                      style={{ display: "flex", gap: "5px" }}
                      onClick={handleDeletePost}
                    >
                      <TbTrash />
                      حذف
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="col-12 px-0 pt-2 pb-2 rtl mt-1">
              {renderContent()}
            </div>
          )}
          {!isEditing && <div className="w-100 rtl">{children}</div>}

          <div
            className="d-flex w-100 rtl justify-between post-option"
            style={{ padding: "0px 70px 0px 10px" }}
          >
            {!disablePostOption && (
              <div className="flex flex-column gap-2 w-100 rtl justify-center post-option">
                <PostOptions
                  isLiked={isLiked}
                  commentCount={commentNumber}
                  repostCount={repostNumber}
                  likeCount={likeNumber > 0 ? likeNumber : 0}
                  handleShare={() => setShowShareModal(true)}
                  handleReply={() => {
                    setOpenComment(!openComment);
                    setOpenRepost(false);
                  }}
                  handleRepost={() => {
                    setOpenRepost(!openRepost);
                    setOpenComment(false);
                  }}
                  handleLike={(state) => handleLike(state)}
                  entityTypeId={entityTypeId}
                  id={entityId}
                  totalVisit={totalVisit}
                  entityTypeIdentity={entityTypeIdentity}
                  disableComment={disableComment}
                />
                {openComment && (
                  <AddComment
                    onClose={() => {
                      setOpenComment(false);
                      setCommentBody("");
                    }}
                    onChange={(e: any) => setCommentBody(e.target.value)}
                    onSubmit={() => handleSubmitComment("postComment")}
                    loading={loading}
                    commentBody={commentBody}
                  />
                )}
                {openRepost && (
                  <AddComment
                    onClose={() => {
                      setOpenRepost(false);
                      setCommentBody("");
                    }}
                    onChange={(e: any) => setCommentBody(e.target.value)}
                    onSubmit={() => handleSubmitComment("repostComment")}
                    loading={loading}
                    commentBody={commentBody}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSubmit={confirmDelete}
        title="حذف محتوا"
        text="آیا مطمئن هستید که می‌خواهید این محتوا را برای همیشه حذف کنید؟ این عمل قابل بازگشت نیست."
        submitText="تأیید و حذف"
      />
      {showShareModal && (
        <ShareModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareLink={to ? mainUrl + to : mainUrl}
        />
      )}
      {openVoteEditModal && (
        <SubmitVoteForm
          onModalClose={() => setOpenVoteEditModal(false)}
          isEditMode={true}
          voteId={entityId}
          onSuccess={() => document.getElementById("refresh-posts")?.click()}
        />
      )}
    </>
  );
};
export default PostCard;
