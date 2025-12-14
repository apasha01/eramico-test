import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { LIKE_LIST } from "@/lib/urls";
import LoaderComponent from "./LoaderComponent";
import Link from "next/link";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { PROFILE } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

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

interface LikeModalProps {
  open: boolean;
  onClose: () => void;
  entityTypeId?: number;
  id: number;
}

const LikeModal = ({ open, onClose, entityTypeId, id }: LikeModalProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>(
          `${LIKE_LIST}/${id}?entityTypeId=${entityTypeId}`
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
        <Box sx={modalStyle}>
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
                <div key={item.id}>
                  <Link
                    className="followerInfo clickable mb-3"
                    href={PROFILE(item.userId.toString())}
                    onClick={async () => {
                      await saveEntityClick(item.userId, EntityTypeEnum.User);
                    }}
                  >
                    <div className="px-0 mx-0">
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 72,
                          height: 72,
                          backgroundColor: "#fff ",
                          color: "#212121",
                          border: "1px solid #F5F5F5",
                          borderRadius: "12px",
                        }}
                        alt="profile picture"
                      >
                        {item.userAvatar ? (
                          <Image
                            className="col-12"
                            alt="لوگو شرکت"
                            src={item.userAvatar}
                            width={70}
                            height={70}
                          />
                        ) : (
                          <BiUser size={24} style={{ color: "#212121" }} />
                        )}
                      </Avatar>
                    </div>
                    <div>
                      <Typography className="fs-16 fw-500">
                        {item.userFullName}
                      </Typography>
                      {item.username && (
                        <Typography variant="body2" className="fs-14 fw-400">
                          @{item.userName}
                        </Typography>
                      )}
                    </div>
                  </Link>
                </div>
                {index !== data.length - 1 && <Divider />}
              </>
            ))}
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default LikeModal;
