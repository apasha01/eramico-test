import styles from "./styles.module.css";
import { Button, Typography } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_MEDIA, COMPANY_REMOVE_MEDIA } from "@/lib/urls";
import MediaItem from "./@componenets/media-item";
import { useEffect, useState } from "react";
import MediaUploader from "./@componenets/media-uploader";
import DeleteModal from "@/Components/common/delete-modal";
import { toast } from "react-toastify";

interface MediaItemData {
  id: number;
  image: string;
  text: string;
  timePast: string;
  visitCount: number;
  isMine: boolean;
}

export default function Media({ id }: { id: number }) {
  const [items, setItems] = useState<MediaItemData[]>([]);
  const [openUploadFor, setOpenUploadFor] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mediaToDeleteId, setMediaToDeleteId] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axiosInstance.get<any>(`${COMPANY_MEDIA}/${id}`);
      if (response.data.success === false) return;

      const list = response.data.data.map((item: any) => ({
        id: item.id || item.mediaId,
        image: item.mediaSourceFileName,
        text: item.note || item.mediaTitle,
        timePast: item.timePast,
        visitCount: item.visitCount,
        isMine: item.isMine ?? false,
      }));

      setItems(list);

      const hasOwnedMedia = list.some((item: MediaItemData) => item.isMine);
      setIsOwner(hasOwnedMedia);
    } catch (e) {
      console.error("خطا در دریافت رسانه‌ها", e);
    }
  };

  const handleDelete = (recordId: number) => {
    const mediaItem = items.find((item) => item.id === recordId);
    if (!mediaItem?.isMine) return;

    setMediaToDeleteId(recordId);
    setShowDeleteModal(true);
  };

  const onDeleteMedia = async () => {
    if (!mediaToDeleteId) return;

    try {
      const response = await axiosInstance.post(
        `${COMPANY_REMOVE_MEDIA}${mediaToDeleteId}`
      );

      if (response.data.success) {
        setItems((prev) => prev.filter((m) => m.id !== mediaToDeleteId));
        toast.success(response.data.message);
      } else {
        toast.warning(response?.data?.message);
      }
    } finally {
      setShowDeleteModal(false);
      setMediaToDeleteId(null);
    }
  };

  return (
    <div className="mainStyle">
      <div
        className="col w-100 p-4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography className="fs-19 fw-500">رسانه‌ها</Typography>

        {isOwner && (
          <Button
            variant="outlined"
            color="primary"
            className="goldoutline"
            size="small"
            onClick={() => setOpenUploadFor(id)}
            sx={{ borderRadius: "999px", px: 1.5, whiteSpace: "nowrap" }}
          >
            آپلود عکس
          </Button>
        )}
      </div>

      <div className={`${styles.mediaList} d-grid px-4 w-100`}>
        {items.length !== 0 ? (
          items.map((item) => (
            <MediaItem
              key={item.id}
              {...item}
              onDelete={item.isMine ? handleDelete : undefined}
            />
          ))
        ) : (
          <span>رسانه‌ای برای این شرکت یافت نشد.</span>
        )}
      </div>

      {isOwner && (
        <>
          <MediaUploader
            open={!!openUploadFor}
            onClose={() => setOpenUploadFor(null)}
            Id={openUploadFor || 0}
            onRefresh={fetchMedia}
          />

          {showDeleteModal && (
            <DeleteModal
              show={showDeleteModal}
              submitText="حذف رسانه"
              title="آیا مطمئن هستید که می‌خواهید این رسانه را حذف کنید؟"
              text="با حذف این رسانه، امکان بازگردانی وجود ندارد."
              onClose={() => setShowDeleteModal(false)}
              onSubmit={onDeleteMedia}
            />
          )}
        </>
      )}
    </div>
  );
}
