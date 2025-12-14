"use client";

import { IconButton } from "@mui/material";
import { AdvertiseDetail } from "../advertiseInterface";
import CallIcon from "@/Components/Icons/CallIcon";
import Tooltip from "@mui/material/Tooltip";
import CompanyModal from "./CompanyModal";
import { useState } from "react";

interface ContactProps {
  response: AdvertiseDetail;
  color: string;
}

const ContactButton: React.FC<ContactProps> = ({ response, color }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip title={<div dir="rtl">اطلاعات تماس</div>}>
        <IconButton
          component="span"
          className="p-0"
          onClick={() => setShowModal(true)}
        >
          <CallIcon color={color} />
        </IconButton>
      </Tooltip>
      <CompanyModal
        open={showModal}
        onClose={() => setShowModal(false)}
        companyId={response.companyId}
        userId={response.userId}
        name={
          response.companyId ? response.companyTitle : response.userFullName
        }
        avatar={
          response.companyId ? response.companyAvatar : response.userAvatar
        }
        cellphone={
          response.companyId
            ? response.companyTelephone
            : response.userTelephone
        }
        contactNumber = {
          response.contactNumber
        }
        
        address={
          response.companyId ? response.companyAddress : response.userProvince
        }
        email={response.companyId ? response.companyEmail : response.userEmail}
        verified={
          response.companyId
            ? response.companyIsVerified
            : response.userIsVerified
        }
       
      />
    </>
  );
};

export default ContactButton;
