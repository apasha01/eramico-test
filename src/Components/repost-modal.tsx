import { axiosInstance } from "@/Helpers/axiosInstance";
import { REPOST_LIST } from "@/lib/urls";
import { Box, Divider, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import LoaderComponent from "./LoaderComponent";
import CloseIcon from "@mui/icons-material/Close";
import SimplePost from "./Home/Main/Post/simple-post";
import { APP_NAME } from "@/lib/metadata";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 576,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface RepostModalProps {
  open: boolean;
  onClose: () => void;
  entityTypeId?: number;
  id: number;
}

const RepostModal = ({ open, onClose, entityTypeId, id }: RepostModalProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>(
          `${REPOST_LIST}/${id}?entityTypeId=${entityTypeId}`
        );
        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="company-modal-title"
      dir="rtl"
      className="modal-box"
    >
      {loading ? (
        <LoaderComponent />
      ) : (
        <Box sx={modalStyle} className="like-modal">
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              left: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <div className="d-flex flex-column like-modal">
            {data.map((item: any, index: number) => (
              <>
                <SimplePost
                showFullPost
                  key={item.id}
                  to={undefined}
                  companyId={item.companyId}
                  avatar={
                    item.companyAvatar || item.userAvatar
                      ? item.companyId
                        ? item.companyAvatar
                        : item.userAvatar
                      : null
                  }
                  userId={item.userId}
                  username={
                    item.companyId ? item.companyCode : item.userName || ""
                  }
                  name={
                    item.companyId || item.userId
                      ? item.companyId
                        ? item.companyTitle
                        : item.userFullName
                      : APP_NAME
                  }
                  description={item.context || ""}
                  createdDate={item.timePast || item.createdDatePersian || ""}
                  commentCount={item.commentCount || 0}
                  likeCount={item.likeCount || 0}
                  entityId={item.entityId || 0}
                  entityTypeIdentity={item.entityTypeIdentity}
                  entityTypeId={item.entityTypeId || 0}
                  userCompanyId={item.userCompanyId}
                  userCompanyTitle={item.userCompanyTitle}
                  userPositionTitle={item.userPositionTitle}
                  disablePostOption
                />
                {index !== data.length - 1 && <Divider />}
              </>
            ))}
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default RepostModal;
