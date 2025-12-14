import { Typography } from "@mui/material";
import BackButton from "./back-button";
import { APP_NAME } from "@/lib/metadata";
import { numberWithCommas } from "@/lib/utils";
import SortButton from "./sort-Button";
import FilterButton from "./FilterButton";
import Link from "next/link";
import SortProps from "@/Helpers/Interfaces/SortProps";

interface HeaderProps {
  title: String | null;
  total?: number | null;
  singleTitle?: string | null;
  filterUrl?: string | null;
  sortProps?: SortProps;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  total,
  singleTitle,
  filterUrl,
  sortProps,
  children,
}: HeaderProps) {
  return (
    <div className="headerStyle" dir="rtl">
      <div className="headerTitleBoxStyle">
        <div className="headerBackRowStyle header-item">
          <BackButton />
          <div>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "20px", md: "28px" },
                fontWeight: 500,
              }}
            >
              {title || APP_NAME}
            </Typography>
          </div>
          {total && total > 0 ? (
            <div className="d-flex gap-1 header">
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#757575",
                  }}
                >
                  ({numberWithCommas(total || 0)} {singleTitle || ""})
                </Typography>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-1">
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#757575",
                }}
              ></Typography>
            </div>
          )}
        </div>
        <div className="filterbtn header-item">
          {sortProps && total && total > 0 && (
            <div>
              <SortButton {...sortProps} />
            </div>
          )}
          <div>
            {filterUrl && total && total > 0 && (
              <Link href={filterUrl}>
                <FilterButton />
              </Link>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
