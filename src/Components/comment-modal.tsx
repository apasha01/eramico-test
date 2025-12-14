import { axiosInstance } from "@/Helpers/axiosInstance";
import { Box, Divider, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import LoaderComponent from "./LoaderComponent";
import { COMMENTS_LIST } from "@/lib/urls";
import SimplePost from "./Home/Main/Post/simple-post";
import CloseIcon from "@mui/icons-material/Close";

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

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  entityTypeId?: number;
  id: number;
}

const CommentModal = ({
  open,
  onClose,
  entityTypeId,
  id,
}: CommentModalProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>(
          `${COMMENTS_LIST}/${id}?entityTypeId=${entityTypeId}`
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
                  to={undefined}
                  key={item.id}
                  avatar={item.userAvatar}
                  userId={item.userId}
                  username={item.userName || ""}
                  name={item.userFullName}
                  disablePostOption={true}
                  description={item.body || ""}
                  createdDate={item.timePast || item.createdDatePersian || ""}
                  entityId={item.id || 0}
                  entityTypeIdentity="Post"
                  entityTypeId={20}
                  userCompanyId={item.userCompanyId}
                  userCompanyTitle={item.userCompanyTitle}
                  userPositionTitle={item.userPositionTitle}
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

export default CommentModal;
