"use client";

import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ImRadioUnchecked } from "react-icons/im";
import PostCard, { Post } from "./post-card";
import { Option } from "@/Helpers/Interfaces/Feed_interface";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { SAVE_VOTE } from "@/lib/urls";
import { toast } from "react-toastify";
import Link from "next/link";
import { IAPIResult } from "@/Helpers/IAPIResult";

export default function VotingPost(
  props: Post & {
    text: string;
    options: Option[];
  }
) {
  const [visitCount, setVisitCount] = useState(props.totalVisit || 0);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const findSelectedVote = () => {
    const selectedVote = props.options.find(
      (option: Option) => option.isSelected
    );
    const selectedVoteId = selectedVote ? selectedVote.id : null;
    return selectedVoteId;
  };

  useEffect(() => {
    setSelectedValue(findSelectedVote());
  }, []);

  useEffect(() => {
    setVisitCount(props.totalVisit || 0);
  }, [props]);

  const handleChange = async (event: any) => {
    if (props.isParticipated) {
      toast.info("شما قبلا در این نظرسنجی شرکت کرده‌اید.");
      return;
    }
    try {
      const response = await axiosInstance.post<IAPIResult<any>>(
        `${SAVE_VOTE}?VoteId=${props.entityId}&VoteOptionId=${event.target.value}`
      );

      if (response.data.success) {
        setSelectedValue(event.target.value);
        setVisitCount(visitCount + 1);
      } else {
        toast.warning(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "خطایی در ذخیره پاسخ شما رخ داده‌است."
      );
    }
  };

  return (
    <PostCard {...props} totalVisit={visitCount}>
      <>
        <div className="sm-padding" style={{ padding: "0 75px 0px 10px" }}>
          <Link href={`/vote/${props.entityId}`} passHref>
            <Typography
              variant="body2"
              className="col-12 fs-14 fw-500 sm-fs-12 fw-400 text-justify mb-4"
              style={{
                whiteSpace: "pre-wrap",
                textJustify: "inter-word",
              }}
            >
              {props.text}
            </Typography>
          </Link>
        </div>
        <div
          style={{ padding: "0 75px 0px 10px" }}
          className="mobileRightPadding "
        >
          <Box display="flex" className="fw-500" flexDirection="column">
            <RadioGroup value={selectedValue} onChange={handleChange}>
              {props.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={
                    <Radio
                      checkedIcon={
                        <CheckCircleIcon style={{ color: "#FB8C00" }} />
                      }
                      style={{ color: "#E0E0E0" }}
                      icon={
                        <ImRadioUnchecked
                          size={24}
                          style={{ border: "1px solid #E0E0E0" }}
                          className="text-white rounded-5"
                        />
                      }
                    />
                  }
                  label={
                    <div className="d-flex justify-between w-100">
                      <Typography variant="body2" className="fs-14 fw-500">
                        {option.title}
                      </Typography>
                      {selectedValue || props.isParticipated ? (
                        <span
                          style={{ position: "absolute", left: 24 }}
                          className="fs-14 fw-500"
                        >
                          {option.percentage.toFixed()}%
                        </span>
                      ) : null}
                    </div>
                  }
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #E0E0E0",
                    background: `${
                      selectedValue || props.isParticipated
                        ? `linear-gradient(to left, #fff ${
                            option.percentage
                          }%, #FB8C0014 ${100 - option.percentage}%)`
                        : "#fff"
                    }`,
                    transition: "background 200ms",
                    marginBottom: "16px",
                    marginInline: "0px",
                    padding: "7px",
                    position: "relative",
                  }}
                />
              ))}
            </RadioGroup>
          </Box>
        </div>
      </>
    </PostCard>
  );
}
