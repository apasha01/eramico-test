import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { GetMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const MainHome = dynamic(() => import("@/Components/Home/Main/main-home"), {
  ssr: false,
});

export const metadata: Metadata = GetMetadata("پست‌ها");

export default function page() {
  return (
    <div className="row mx-0 mobileFlex">
      <div className="col-12">
        <MainHome entityTypeId={EntityTypeEnum.Vote} />
      </div>
    </div>
  );
}
