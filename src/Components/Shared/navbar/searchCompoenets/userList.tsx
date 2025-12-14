import React from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import { LiaArrowLeftSolid } from "react-icons/lia";
import NothingFound from "./nothingFound";
import { PROFILE } from "@/lib/internal-urls";
import TheAvatar from "@/Components/common/the-avatar";

interface users {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface CompanyListProps {
  user: users[];
  onClose?: () => void;
}

const UserList: React.FC<CompanyListProps> = ({ user, onClose }) => {
  return (
    <div>
      {user?.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          {user.map((user: users) => (
            <Link
              href={PROFILE(user.id.toString())}
              key={`user-${user.id}`}
              style={{ textDecoration: "none" }}
              onClick={onClose}
            >
              <div className="d-flex  px-4 py-2 buyAdvertisement BorderBottom justify-content-between w-100 align-content-center ">
                <div className="d-flex gap-3 my-1 px-0  ">
                  <div style={{ position: "relative" }}>
                    <TheAvatar
                      variant="circular"
                      name={user.firstName + " " + user.lastName}
                      src={user?.avatar ? user?.avatar : ""}
                      height={42}
                      width={42}
                    />
                  </div>
                  <div className="col px-0 mx-0">
                    <Typography variant="body1" sx={{ textDecoration: "none" }}>
                      {user?.userName}
                    </Typography>

                    <Typography
                      variant="body2"
                      className="col-12 pt-2"
                      sx={{ textDecoration: "none" }}
                    >
                      {`${user?.firstName} ${user?.lastName}`}
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

export default UserList;
