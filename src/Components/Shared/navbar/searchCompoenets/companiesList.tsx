import React from "react";
import { Avatar, Typography } from "@mui/material";
import Link from "next/link";
import { LiaArrowLeftSolid } from "react-icons/lia";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import VerifiedIcon from "@mui/icons-material/Verified";
import NothingFound from "./nothingFound";
import { COMPANY } from "@/lib/internal-urls";
import TheAvatar from "@/Components/common/the-avatar";

interface companies {
  id: number;
  title: string;
  subtext?: string;
  to: string;
  avatar?: string;
  isVerified?: boolean;
  code?: string;
}

interface CompanyListProps {
  Company: companies[];
  onClose?: () => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ Company, onClose }) => {
  return (
    <div>
      {Company?.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          {Company.map((Company: companies) => (
            <Link
              href={COMPANY(Company.code ?? Company.id.toString())}
              key={`company-${Company.id}`}
              style={{ textDecoration: "none" }}
              onClick={onClose}
            >
              <div className="d-flex  px-4 py-2 buyAdvertisement BorderBottom justify-content-between w-100 align-content-center ">
                <div className="d-flex gap-3 my-1 px-0  ">
                  <div style={{ position: "relative" }}>
                    <TheAvatar
                      variant="square"
                      name={Company.title}
                      src={Company.avatar ? Company.avatar : ""}
                      isVerified={Company.isVerified || false}
                      height={56}
                      width={56}
                    />
                  </div>
                  <div className="col px-0 mx-0">
                    <Typography variant="body1" sx={{ textDecoration: "none" }}>
                      {Company.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      className="col-12 pt-2"
                      sx={{ textDecoration: "none" }}
                    >
                      {Company?.subtext}
                    </Typography>
                  </div>
                </div>
                <LiaArrowLeftSolid size={24} className="black mt-3" />
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default CompanyList;
