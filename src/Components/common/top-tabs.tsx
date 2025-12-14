"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

interface SideBarItem {
  id: number;
  name: string;
  icon?: React.ReactNode;
  url?: string;
}

interface TopTabsProps {
  onSelect?: (selectedItem: number) => void;
  selectedView?: number | null;
  sidebarList: SideBarItem[];
}

export default function TopTabs({
  onSelect,
  selectedView,
  sidebarList,
}: TopTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = sidebarList.findIndex((item) =>
    item.url ? pathname === item.url : item.id === selectedView
  );

  return (
    <Box
      className="hideInDesktopScreen"
      sx={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Box sx={{ width: "max-content" }}>
        <Tabs
          value={currentIndex === -1 ? 0 : currentIndex}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 48,
            borderBottom: "1px solid #eee",

            "& .MuiTabs-flexContainer": {
              flexWrap: "nowrap !important",
            },

            "& .MuiTab-root": {
              minHeight: 48,
              minWidth: "auto",
              padding: "0 16px",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
              flexShrink: 0,
            },
          }}
          onChange={(_, idx) => {
            const item = sidebarList[idx];

            if (item.url) return router.push(item.url);
            if (onSelect) onSelect(item.id);
          }}
        >
          {sidebarList.map((item) => (
            <Tab
              key={item.id}
              label={
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {item.icon}
                  {item.name}
                </span>
              }
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
