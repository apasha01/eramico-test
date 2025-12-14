"use client";

import { IconButton, Button, Typography, Badge } from "@mui/material";
import Link from "next/link";
import MoreOption from "@/Components/Shared/Options";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import DeleteModal from "@/Components/common/delete-modal";
import { useState } from "react";
import { ADVERTISE_ARCHIVED, REMOVE_ADVERTISE, REPLY_LIST } from "@/lib/urls";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import Image from "next/image";
import EditInquiryModal from "./edit-inquiry-modal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LoaderComponent from "@/Components/LoaderComponent";
import Replies from "./replies";
import CompanyStatus from "@/Components/common/company-status";
import { PRODUCT } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import ConfirmDialog from "@/Components/common/ArchiveItem";

interface ProfileInquiryItemProps {
  item: any;
  options: any;
  setData: any;
  setShouldUpdate: any;
}

export default function ProfileInquiryItem({
  item,
  options,
  setData,
  setShouldUpdate,
}: ProfileInquiryItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endInquiries,setEndInquiry] = useState<boolean>(false)
  
  
  const {
    id,
    companyId,
    companyTitle,
    amount,
    visitCount,
    productId,
    productTitle: faTitle,
    productEngTitle: enTitle,
    priceUnitPropertyId,
    amountUnitPropertyTitle: amountUnit,
    expirationRemained: date,
    subscriptionAvatar,
    userIsVerified,
    companyIsVerified,
    companyIsSafe,
    userFullName,
    advertiseStatusTitle,
  } = item;

  const [inquiryStatus,setInquiryStatus] = useState<string>(advertiseStatusTitle)

  const onDeleteInquiry = async () => {
    try {
      const response = await axiosInstance.post(
        `${REMOVE_ADVERTISE}/${id.toString()}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData: any) => prevData.filter((ad: any) => ad.id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
    setShowDeleteModal(false);
  };

  const handleClick = async () => {
    setLoading(true);
    if (showResponses) {
      setShowResponses(false);
    } else {
      setShowResponses(true);
      const response = await axiosInstance.get<any>(`${REPLY_LIST}/${id}`);

      if (!response.data.success) {
        toast(response.data.message);
      } else {
        const data = response.data.data.map((item) => ({
          id: item.id,
          companyId: item.companyId,
          userId: item.userId,
          name: item.companyId ? item.companyTitle : item.userFullName,
          username: item.companyId ? item.companyCode : item.userName,
          price: item.price,
          priceUnit: item.unitPropertyTitle,
          createdDate: item.timePast || item.createdDatePersian,
          avatar: item.companyId ? item.companyAvatar : item.userAvatar,
          days: item.days,
          cellphone: item.companyId
            ? item.companyCellphone
            : item.userCellphone,
          address: item.companyId ? item.companyAddress : item.userProvince,
          email: item.companyId ? item.companyEmail : item.userEmail,
          verified: item.companyId
            ? item.companyIsVerified
            : item.userIsVerified,
          isAgreemental: item.isAgreemental,
        }));

        setResponses(data || []);
        setLoading(false);
      }
    }
  };

    const archiveHandler = async () => {
      try {
        const res = await axiosInstance.post(`${ADVERTISE_ARCHIVED}/${id}`);
        if (res.data.success) {
          toast.success("اگهی با موفقیت ارشیو شد");
          setInquiryStatus("پایان پذیرفته")
        } else {
          toast.error(res.data.message);
        }
      } catch (err: any) {
        toast.error("خطایی رخ داد");
      }
    };

  return (
    <>
      <div className="p-3 pt-2 mobileLeftPadding w-100">
        <div className="container px-0 rounded-4 p-0 pe-auto AdvertisementBgSell buyAdvertisement">
          <div
            className="row px-4 mx-0 rtl justify-content-between"
            style={{ padding: "24px" }}
          >
            <div className="col-3 mx-0 px-0 d-flex align-items-center gap-2">
              <Badge
                badgeContent={inquiryStatus}
                color="secondary"
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                className="text-related-badge"
              >
                <Link
                  className="d-flex gap-2 align-items-center"
                  href={PRODUCT(productId, faTitle)}
                  onClick={async () => {
                    await saveEntityClick(productId, EntityTypeEnum.Product);
                  }}
                >
                  <Typography variant="body1" className="fs-19 fw-500">
                    {faTitle}
                  </Typography>
                  {enTitle && (
                    <Typography className=" greyColor fs-14 fw-500 sm-fs-12">
                      ({enTitle})
                    </Typography>
                  )}
                </Link>
              </Badge>
            </div>
            <div className="col-3 px-0">
              <Typography variant="body1" className="col-12 fs-19 fw-500">
                {companyTitle || userFullName}
              </Typography>
              <Typography className="col-12 d-flex gap-2 mt-2 fs-5">
                <CompanyStatus
                  verified={companyId ? companyIsVerified : userIsVerified}
                  subscriptionAvatar={subscriptionAvatar}
                  isSafe={companyId ? companyIsSafe : null}
                />
              </Typography>
            </div>
            <div className="col-3 text-end align-self-center">
              {date && (
                <Typography
                  variant="body2"
                  className="col-12 mt-2  fs-18 fw-500"
                >
                  {date}
                </Typography>
              )}
              <Typography variant="body1" className="col-12  fs-19 fw-500">
                {amount ? (
                  <>
                    {amount?.toLocaleString()} {amountUnit || ""}
                  </>
                ) : (
                  "تماس بگیرید"
                )}
              </Typography>
            </div>
            <div
              className="col-3 align-self-center text-center px-1 hideInMobileScreen"
              style={{ width: "fit-content" }}
            >
              <div className="d-flex gap-3 align-items-center">
                <div>
                  <span className="ps-1" style={{ color: "#616161" }}>
                    {visitCount}
                  </span>
                  <Image
                    src="/images/visit_count.png"
                    alt="تعداد بازدید"
                     loading="lazy"
                    width={24}
                    height={24}
                  />
                </div>
                <Button
                  variant="outlined"
                  className="rounded-5 px-2 py-1 rtl goldoutline"
                  onClick={handleClick}
                  style={{ height: "42px" }}
                >
                  {showResponses ? "بستن پاسخ‌ها" : "مشاهده پاسخ‌ها"}
                  <IconButton component="span" className="p-0">
                    {showResponses ? (
                      <KeyboardArrowUpIcon sx={{ color: "#FB8C00" }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ color: "#FB8C00" }} />
                    )}
                  </IconButton>
                </Button>
                <div
                  style={{
                    height: "42px",
                    width: "42px",
                    border: "1px solid #FB8C00",
                    borderRadius: "50%",
                    justifyItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MoreOption
                    deleteHandler={() => setShowDeleteModal(true)}
                    editHandler={() => setShowEditModal(true)}
                    endInquiries={()=>setEndInquiry(true)}
                  />
                </div>
              </div>
            </div>


            <div className="col-2 align-self-end text-start showInMobileScreen">
              <IconButton className="advertisementButton">
                <NavigateBeforeIcon />
              </IconButton>
            </div>
            <div className="d-flex flex-column rtl mt-4 w-100 justify-content-start">
              {showResponses && (
                <>
                  {loading ? (
                    <LoaderComponent />
                  ) : (
                    <Replies responses={responses} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          submitText="حذف استعلام"
          title="آیا مطمئن هستید که میخواهید استعلام را حذف کنید؟"
          text="با حذف استعلام ، تمامی اطلاعات این استعلام از صفحه شرکت شما حذف خواهد شد و قابل بازگردانی نمی‌باشد."
          onClose={() => setShowDeleteModal(false)}
          onSubmit={onDeleteInquiry}
        />
      )}
      {showEditModal && (
        <EditInquiryModal
          show={showEditModal}
          item={item}
          options={options}
          onClose={() => setShowEditModal(false)}
          setShouldUpdate={setShouldUpdate}
        />
      )}
    <ConfirmDialog 
    onClose={()=>setEndInquiry(false)}
    onSubmit={archiveHandler}
    open={endInquiries}
    submitText="پایان استعلام"
      text="آیا از پایان استعلام مطمئنید؟"
   title="پایان استعلام"
   
   />

    </>
  );
}
