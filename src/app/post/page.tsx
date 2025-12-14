import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import dynamic from "next/dynamic";
const MainHome = dynamic(() => import("@/Components/Home/Main/main-home"), {
  ssr: false,
});

export default function page() {
  return (
    <div className="row mx-0 mobileFlex">
      <div className="col-12">
        <MainHome entityTypeId={EntityTypeEnum.Post} />
      </div>
    </div>
  );
}
