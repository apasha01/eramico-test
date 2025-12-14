"use client";

import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SideBarItem {
  id: number;
  name: string;
  icon?: React.ReactNode;
  url?: string;
  isDefault?: boolean;
  badgeCount?: number; // optional badge count (e.g. unread messages)
}

interface SideBarProps {
  onSelect?: (selectedItem: number) => void;
  selectedView?: number | null;
  sidebarList: SideBarItem[];
}

const SideBar = ({ onSelect, selectedView, sidebarList }: SideBarProps) => {
  const currentPath = usePathname();
  const defaultClassNames =
    "d-flex fw-500 gap-3 align-items-center justify-content-start rounded-5 col-12 rounded mt-3 px-3";
  return (
    <div className="w-100 h-100 px-3">
      {sidebarList.map((val: SideBarItem) => {
        if (val.url && val.url.length > 0) {
          return (
            <Button
              key={val.id}
              href={val.url}
              className={`${defaultClassNames} ${
                currentPath === val.url || val.isDefault
                  ? "categoryBtnActive"
                  : "categoryBtn"
              }`}
              style={{
                height: "48px",
              }}
              startIcon={val.icon || null}
              LinkComponent={Link}
            >
              <span className="d-flex align-items-center gap-2">
                <span>{val.name}</span>
                {val.badgeCount &&
                  val.badgeCount > 0 &&
                  false && ( //TODO - show it when api changed
                    <span
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "2px 8px",
                        fontSize: 12,
                        lineHeight: 1,
                        minWidth: 24,
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {(val.badgeCount || 0) > 99 ? "99+" : val.badgeCount}
                    </span>
                  )}
              </span>
            </Button>
          );
        } else
          return (
            <Button
              key={val.id}
              className={`${defaultClassNames} ${
                selectedView === val.id ? "categoryBtnActive" : "categoryBtn"
              }`}
              style={{
                height: "48px",
              }}
              variant="text"
              startIcon={val.icon || null}
              onClick={() => onSelect && onSelect(val.id)}
            >
              <span className="d-flex align-items-center gap-2">
                <span>{val.name}</span>
                {val.badgeCount &&
                  val.badgeCount > 0 &&
                  false && ( //TODO - show it when api changed
                    <span
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "2px 8px",
                        fontSize: 12,
                        lineHeight: 1,
                        minWidth: 24,
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {(val.badgeCount || 0) > 99 ? "99+" : val.badgeCount}
                    </span>
                  )}
              </span>
            </Button>
          );
      })}
    </div>
  );
};
export default SideBar;
