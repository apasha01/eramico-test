import { Typography } from "@mui/material";
import TheAvatar from "@/Components/common/the-avatar";
import Link from "next/link";
import { PROFILE } from "@/lib/internal-urls";
import { CompanyUserInterface } from "./CompanyUserInterface";

  

export default function CompanyUserList({ users }: { users: CompanyUserInterface[] }) {
  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4">
        <Typography className="fs-19 fw-500 mb-2">اعضای شرکت</Typography>

        {users.length === 0 && (
          <Typography className="fs-14 greyColor2">
            عضوی برای این شرکت یافت نشد.
          </Typography>
        )}

        <div className="d-flex flex-column gap-3 mt-2">
          {users.map((user: any) => (
            <Link
              href={PROFILE(user?.userId.toString())}
              key={`user-${user.userId}`}
              style={{ textDecoration: "none" }}
            >
              <div className="d-flex gap-2" key={user.userId}>
                <div className="px-0 ms-2 position-relative">
                  <TheAvatar
                    name={user.fullName}
                    src={user.userAvatar || ""}
                    height={42}
                    width={42}
                    isSafe={false}
                    isVerified={false}
                    subscriptionAvatar=""
                    variant="circular"
                  />
                </div>

                <div className="col-12 mx-0 px-0">
                  <Typography className="fs-16 fw-500">
                    {user.fullName ? user.fullName : user.useName}
                  </Typography>

                  <div className="d-flex flex-column mt-1 gap-1">
                    {user.email && (
                      <Typography className="fs-13 fw-500 greyColor2">
                        ایمیل: {user.email}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
           </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
