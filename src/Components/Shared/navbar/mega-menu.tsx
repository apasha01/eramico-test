"use client";

import React, { useEffect, useState, useMemo } from "react";
import styles from "./styles.module.css";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { PRODUCTS_LIST } from "@/lib/urls";
import { PRODUCT } from "@/lib/internal-urls";

interface MegaMenuProps {
  handleCloseCall: () => void;
}

interface MegaMenuItem {
  id: number;
  title: string;
  code?: string;
  engTitle?: string;
  icon?: string;
  parentId?: number | null;
  hasPrice: boolean;
  type: string;
  children: MegaMenuItem[];
}

interface MegaMenu_res extends IAPIResult<MegaMenuItem[]> {}

const MegaMenu: React.FC<MegaMenuProps> = ({ handleCloseCall }) => {
  const pathname = usePathname();
  const [response, setResponse] = useState<MegaMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSidebar, setSelectedSidebar] = useState<{
    id: number | null;
    index: number;
    childern: number | null;
  }>({ id: null, index: 0, childern: null });

  const handleParentClick = (id: number, index: number) => {
    setSelectedSidebar({
      id: selectedSidebar.id === id ? null : id,
      index,
      childern: null,
    });
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const apiRes = await axiosInstance.get<MegaMenu_res>(PRODUCTS_LIST);
        const data = apiRes?.data?.data || [];
        if (apiRes.data.success && data.length > 0) {
          setResponse(data);
        } else {
          console.error("Error fetching Category:", apiRes.data.message);
        }
      } catch (error) {
        console.error("Error fetching Category:", error);
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchSubscriptions();
  }, []);

  function findHighestParentAndIndex(
    data: any[],
    id: number
  ): { parentId: number | null; index: number } {
    for (let i = 0; i < data?.length; i++) {
      const firstChildren = data[i]?.children;
      if (firstChildren) {
        for (let j = 0; j < firstChildren.length; j++) {
          if (id === firstChildren[j]?.id) {
            return { parentId: data[i]?.id, index: i };
          }
          const secondChildren = firstChildren[j]?.children;
          if (secondChildren) {
            for (let k = 0; k < secondChildren.length; k++) {
              if (id === secondChildren[k]?.id) {
                return { parentId: data[i]?.id, index: i };
              }
            }
          }
        }
      }
    }
    return { parentId: null, index: 0 };
  }

  useEffect(() => {
    const productIdRegex = /\/products\/(\d+)/; // Regex to match /products/:id
    const match = pathname.match(productIdRegex);

    if (match && !loading) {
      const childId = match[1]; // Extract the ID from the matched string;
      const result = findHighestParentAndIndex(response, Number(childId));
      if (result) {
        setSelectedSidebar({
          id: result?.parentId ?? 0,
          childern: Number(childId),
          index: result.index,
        });
      }
    }
  }, [loading, pathname, response]); // Run the effect whenever the pathname changes

  // Render loading indicator if data is still being fetched
  if (loading) {
    return (
      <div className="w-100 pt-5">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className={styles.dividerStyle}>
      <div className={styles.listSubcategoryStyle}>
        <Link
          style={{ textDecoration: "none" }}
          href={`/products?category=${response?.[selectedSidebar.index]?.id}`}
        >
          <Typography className="fs-16 fw-500 gold" onClick={handleCloseCall}>
            <IoChevronBackOutline /> مشاهده همه کالاهای{" "}
            {response?.[selectedSidebar.index]?.title}{" "}
          </Typography>
        </Link>
        <div className={styles.mainListSubcategoryStyle} dir="rtl">
          {(response?.[selectedSidebar.index]?.children || []).map(
            (val: any, index: number) => (
              <div
                className={styles.eachSubcategoryStyleList}
                key={val?.id + "-" + index}
              >
                <Typography className="fs-18 fw-500 mb-1">
                  {val.title}
                </Typography>
                {val?.children
                  ? val?.children.map((val: any, index: number) => (
                      <div
                        className={styles.eachSubcategoryStyleList}
                        key={val?.id + "-" + index + "-subcategory"}
                      >
                        <Button
                          LinkComponent={Link}
                          href={PRODUCT(val?.id, val?.title)}
                          className="fs-16 fw-500 p-0"
                          sx={{
                            color:
                              selectedSidebar?.childern === val?.id
                                ? "#fb8c00"
                                : "#616161",
                            "&:hover": { color: "#fb8c00" },
                          }}
                          onClick={handleCloseCall} // Close the drawer
                        >
                          {val.title}
                        </Button>
                      </div>
                    ))
                  : null}
              </div>
            )
          )}
        </div>
      </div>
      <div className={styles.listCategoryStyle}>
        {response?.map((val: any, index: number) => (
          <div className="w-100 px-3" key={val?.id} dir="rtl">
            <Button
              className={`d-flex gap-3 justify-content-start rounded-5 col-12 rounded px-3 fs-16 fw-500 ${
                selectedSidebar.id === val?.id
                  ? "categoryBtnActive"
                  : "categoryBtn"
              }`}
              style={{
                height: "48px",
              }}
              variant="text"
              startIcon={
                val?.icon ? (
                  <Image
                    src={val.icon}
                    alt={val.title}
                    width={24}
                    height={24}
                  />
                ) : (
                  <div style={{ width: "24px" }} />
                )
              }
              onClick={() => handleParentClick(val?.id, index)}
              onMouseEnter={() => handleParentClick(val?.id, index)}
            >
              {val?.title || ""}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MegaMenu;
