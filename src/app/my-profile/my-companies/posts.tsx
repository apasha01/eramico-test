import React, { useEffect, useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import { COMPANY_FEED } from "@/lib/urls";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import SubmitPostForm from "@/Components/submit-post-form";

interface Feed_res extends IAPIResult<any> {}

const Posts = ({ id }: { id: number;  }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const fetchPosts = async () => {
    const response = await axiosInstance.get<Feed_res>(`${COMPANY_FEED}/${id}`);
    if (response.data.success === false) {
      return null;
    }
  
    setItems(response.data.data);
  };

  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4 mb-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Typography className="fs-19 fw-500 mb-3">پُست‌ها‌</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setSelectedOption("post")}
          >
            پست جدید
          </Button>
        </div>
        {items.length === 0 ? (
          <span>پستی توسط این شرکت ثبت نشده است.</span>
        ) : (
          <>
            {items.map((item: Data, index) => (
              <>
                <FeedItem key={`${item.id}_${index}_preload`} item={item}  />
                {index % 5 !== 4 &&
                  item?.entityTypeIdentity !== "Advertise" && <Divider />}
              </>
            ))}
          </>
        )}
      </div>
      {selectedOption == "post" && (
        <SubmitPostForm onModalClose={() => setSelectedOption(null)} />
      )}
      
    </div>
  );
};
export default Posts;
