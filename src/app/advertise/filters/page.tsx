import MobileFilterPage from "@/Components/common/mobile-filter-page";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";

interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}
export default async function AdvertiseFilterPage(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  return <MobileFilterPage basePath="/advertise" searchParams={searchParams} />;
}
