"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { TbMailOpened } from "react-icons/tb";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SubmitNewInquiry from "@/Components/Home/Sidebar/inquiries/submit-new-inqiry";
import { axiosInstance } from "@/Helpers/axiosInstance";
import Image from "next/image";

export default function RelatedAdvertisements({
  id,
  title,
  productId,
}: {
  id: string;
  title: string;
  productId: number;
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>(
          `Advertise/similar-inquiry/${id}`
        );
        const data = response.data.data.map(
          (item: {
            id: any;
            companyId: number;
            userFullName: any;
            companyTitle: any;
            productTitle: any;
            amount: any;
            amountUnitPropertyTitle: string;
            userIsVerified: any;
            companyIsVerified: any;
            subscriptionAvatar: string | null;
            expirationRemained: string | null;
          }) => ({
            id: item.id,
            companyId: item.companyId,
            name: item.companyId ? item.companyTitle : item.userFullName,
            amount: item.amount,
            amountUnit: item.amountUnitPropertyTitle,
            verified: item.companyId
              ? item.companyIsVerified
              : item.userIsVerified,
            subscriptionAvatar: item.subscriptionAvatar,
            expirationRemained: item.expirationRemained,
          })
        );
        setData(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <section className="row">
      <div className="container p-0">
        <h6 className="col-12  p-3 rtl mt-1 d-flex gap-2 align-items-center justify-content-between">
          <span className="d-flex gap-2" style={{ color: "#FB8C00" }}>
            <TbMailOpened />
            دیگر استعلام‌های {title}
          </span>
          <SubmitNewInquiry productId={productId} productTitle={title} />
        </h6>

        {data.length > 0 ? (
          <>
            <nav>
              <List>
                {data.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding className="buyAdvertisement">
                      <ListItemButton
                        className="row px-0 mx-0 bg-transparent "
                        LinkComponent={Link}
                        href={"/inquiries/" + item.id}
                      >
                        <div
                          className="row px-3 mx-0 rtl py-1"
                          style={{ justifyContent: "space-between" }}
                        >
                          <div
                            className="col-4 px-0 d-flex flex-column justify-content-center"
                            style={{ textAlign: "right" }}
                          >
                            <Typography variant="body1">{item.name}</Typography>
                            {item.subscriptionAvatar || item.verified ? (
                              <Typography className="d-flex gap-1 fs-15">
                                {item.subscriptionAvatar && (
                                  <Image
                                   loading="lazy"
                                    alt=""
                                    src={item.subscriptionAvatar}
                                    width={25}
                                    height={25}
                                  />
                                )}
                                {item.verified && (
                                  <VerifiedIcon
                                    fontSize="inherit"
                                    color="secondary"
                                  />
                                )}
                              </Typography>
                            ) : null}
                          </div>
                          <div
                            className="col-2 align-self-center"
                            style={{ textAlign: "right" }}
                          >
                            {item.amount ? (
                              <Typography
                                variant="body1"
                                className="d-flex flex-column gap-1"
                              >
                                <span>
                                  {item.amount?.toLocaleString()}{" "}
                                  {item.amountUnit}
                                </span>
                                {item.expirationRemained && (
                                  <span>{item.expirationRemained}</span>
                                )}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                className="col-12 mt-2"
                              >
                                تماس بگیرید
                              </Typography>
                            )}
                          </div>
                          <div className="col-2 align-self-center text-left px-1">
                            <IconButton className="advertisementButton">
                              <NavigateBeforeIcon />
                            </IconButton>
                          </div>
                                   {/* <div className="col-4">
                          
            <Button variant="outlined" className="goldoutline">مشاهده استعلام</Button>
          </div> */}
                        </div>
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </nav>
            {data.length > 3 && (
              <div className="col-12 pb-4 pt-3 text-center">
                <Button
                  variant="outlined"
                  className="goldoutline py-2"
                  LinkComponent={Link}
                  href="/inquiries"
                >
                  مشاهده همه
                </Button>
              </div>
            )}
          </>
        ) : (
          <Typography className="fw-600 fs-18 text-center pb-3">
            .استعلامی پیدا نشد
          </Typography>
        )}
      </div>
    </section>
  );
}
