"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import {
  InputAdornment,
  TextField,
  Typography,
  Pagination,
  Avatar,
  Divider,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import LoaderComponent from "@/Components/LoaderComponent";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import Link from "next/link";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/lib/urls";
import { toast } from "react-toastify";
import { PROFILE } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { GetMetadata } from "@/lib/metadata";
import TheAvatar from "./the-avatar";

interface FollowerData {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  isFollowed: boolean;
}

const ITEMS_PER_PAGE = 10;
interface follow_res extends IAPIResult<any> {}

const Followers = ({ url, type }: { url: string; type: string }) => {
  var title = type === "follower" ? "دنبال‌کنندگان" : "دنبال‌شده‌ها";
  var md = GetMetadata(title);
  document.title = md.title;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [followers, setFollowers] = useState<FollowerData[]>([]);
  const [filteredData, setFilteredData] = useState<FollowerData[]>([]);
  const [paginatedData, setPaginatedData] = useState<FollowerData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<follow_res>(url);
        if (response.data.success) {
          if (response.data.data.length > 0) {
            const data = response.data?.data.map((item: any) => ({
              id: type === "follower" ? item.userId : item.entityId,
              name: item.userFullName,
              username: item.userName,
              avatar: item.userAvatar,
              isFollowed: item.isFollowed,
            }));
            setFollowers(data);
          } else {
            setFollowers([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch followers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [url]);

  useEffect(() => {
    let filteredData = followers;
    if (searchTerm) {
      filteredData = followers.filter(
        (follower) =>
          follower?.name?.includes(searchTerm) ||
          follower?.username?.includes(searchTerm)
      );
    }
    setFilteredData(filteredData);
  }, [searchTerm, followers]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    setPaginatedData(paginatedData);
  }, [currentPage, filteredData]);

  const toggleFollow = async (id: number) => {
    const targetFollower = followers.find((item) => item.id === id);
    if (!targetFollower) return;

    const updatedFollowers = followers.map((item) =>
      item.id === id ? { ...item, isFollowed: !item.isFollowed } : item
    );
    setFollowers(updatedFollowers);

    const url = targetFollower.isFollowed
      ? `${UNFOLLOW_USER}/${id}`
      : `${FOLLOW_USER}?id=${id}`;

    try {
      const response = await axiosInstance.post(url);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to toggle follow status", error);
      setFollowers(followers);
    }
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`px-4 ${styles.followersListMainDiv}`} dir="rtl">
      <div>
        <Typography className="fs-24 fw-500 mb-3">
          {type === "follower" ? "دنبال‌کننده‌ها" : "دنبال‌شده‌ها"}
        </Typography>
      </div>

      <TextField
        name="search"
        className="col-12 w-full fs-16 fw-500 mb-5 border rounded-4 customStyleTextField"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" className="mx-1">
              <CiSearch size={22} />
            </InputAdornment>
          ),
          style: { textAlignLast: "right" },
        }}
        placeholder="کاربر مورد نظر را جستجو کنید ..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <LoaderComponent />
      ) : paginatedData.length !== 0 ? (
        paginatedData.map((item: FollowerData, index: number) => (
          <>
            <div key={item.id} className={styles.followerCard}>
              <Link
                className={styles.followerInfo}
                href={PROFILE(item.id.toString())}
                onClick={async () => {
                  await saveEntityClick(item.id, EntityTypeEnum.User);
                }}
              >
                <div className="px-0 mx-0">
                  <TheAvatar
                    width={72}
                    height={72}
                    src={item.avatar}
                    name={item.name || item.username || "کاربر"}
                  />
                </div>
                <div className={styles.followerDetails}>
                  <Typography className="fs-16 fw-500">{item.name}</Typography>
                  {item.username && (
                    <Typography variant="body2" className="fs-14 fw-400 ltr">
                      @{item.username}
                    </Typography>
                  )}
                </div>
              </Link>
              <button
                className={
                  item.isFollowed ? styles.unfollowButton : styles.followButton
                }
                onClick={() => toggleFollow(item.id)}
              >
                {item.isFollowed ? (
                  <DoneIcon sx={{ fontSize: "22px", color: "#616161" }} />
                ) : (
                  <AddIcon />
                )}
                {item.isFollowed ? "دنبال شده" : "دنبال کردن"}
              </button>
            </div>
            {paginatedData.length - 1 !== index && <Divider />}
          </>
        ))
      ) : (
        <span>موردی یافت نشد.</span>
      )}
      <div className="paginationStyle">
        {filteredData.length > 0 && (
          <Pagination
            className="mypagination justify-content-center"
            color="secondary"
            dir="rtl"
            count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
            onChange={(event: React.ChangeEvent<unknown>, value: number) =>
              handleChangePage(value)
            }
            page={currentPage}
            siblingCount={0}
            boundaryCount={2}
          />
        )}
      </div>
    </div>
  );
};

export default Followers;
