"use client";

import { useState, useEffect } from "react";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import styles from "../styles.module.css";
import { FiUser } from "react-icons/fi";
import { RiDeleteBinLine, RiProfileLine } from "react-icons/ri";
import { TbBuilding, TbReceipt } from "react-icons/tb";
import { MdOutlineLock } from "react-icons/md";
import SideBar from "@/Components/common/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PageHeader from "@/Components/common/page-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const token = getToken_Localstorage();
    if (!token) {
      // show toast or alert for unauthorized access
      toast.warning("لطفا وارد حساب کاربری خود شوید");
      router.push("/");
    } else {
      setIsLogin(true);
    }
  }, [router]);

  if (!isLogin) {
    return null;
  }

  const sidebarList = [
    {
      id: 0,
      name: "اطلاعات شخصی",
      icon: <FiUser />,
      url: "/my-profile/dashboard",
      isExternal: false,
    },
    {
      id: 1,
      name: "اطلاعات تماس",
      icon: <RiProfileLine size={22} />,
      url: "/my-profile/dashboard/contact",
      isExternal: false,
    },
    {
      id: 2,
      name: "اطلاعات شرکت",
      icon: <TbBuilding size={22} />,
      url: "/my-profile/dashboard/company",
      isExternal: false,
    },
    {
      id: 3,
      name: "سوابق اشتراک",
      icon: <TbReceipt size={22} />,
      url: "/my-profile/dashboard/subscription-history",
      isExternal: false,
    },
    {
      id: 4,
      name: " تغییر کلمه عبور",
      icon: <MdOutlineLock size={22} />,
      url: "/my-profile/dashboard/change-password",
      isExternal: false,
    },
    {
      id: 5,
      name: "حذف حساب کاربری",
      icon: <RiDeleteBinLine size={22} />,
      url: "/my-profile/dashboard/delete-account",
      isExternal: false,
    },
  ];

  return (
    <div className="mainStyle">
      <PageHeader title="داشبورد" />
      <div className="dividerStyle">
        <div className="row mx-0 w-100 mobileFlex ">
          <div className={styles.listCompanyStyle} dir="rtl">
            <aside className={styles.listCategoryStyle}>
              <SideBar sidebarList={sidebarList} />
            </aside>
            <main className={styles.mainContent + " w-100"}>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
