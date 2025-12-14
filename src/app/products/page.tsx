import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { CATEGORY_LOOKUP_TREE, PRODUCTS_LIST } from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Category as ICategory } from "@/Helpers/Interfaces/CategoryInterface";
import ProductListClient from "./ProductListClient"; // ✅ بخش کلاینت جدا
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}

export const metadata: Metadata = GetMetadata("محصولات");

interface MegaMenuInterface {
  id: number;
  title: string;
  children?: MegaMenuInterface[];
  code: string;
  engTitle: string;
  abbr?: string;
  parentId: number | null;
  hasPrice?: boolean;
  icon: string | null;
  type: string;
}

interface Advertise_res extends IAPIResult<MegaMenuInterface[]> {}

export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const isMobileDevice = () => {
    const userAgent = headers().get("user-agent") || "";
    return /Mobi|Android|iPhone/i.test(userAgent);
  };

  const response = await axiosInstance.get<Advertise_res>(
    PRODUCTS_LIST,
    await getServerAxiosConfig()
  );
  const categoryResponse = await axiosInstance.get<Advertise_res>(
    CATEGORY_LOOKUP_TREE,
    await getServerAxiosConfig()
  );

  if (
    !categoryResponse.data.success ||
    categoryResponse.data.data?.length === 0 ||
    !response.data.success
  ) {
    return notFound();
  }

  // ---- Helpers ----
  const findCategoryInTree = (
    items: MegaMenuInterface[],
    targetId: number | string
  ): any[] => {
    const searchByCode = typeof targetId === "string";
    return items.reduce((acc: MegaMenuInterface[], item: MegaMenuInterface) => {
      if (
        (item.id === targetId || (searchByCode && item.code === targetId)) &&
        item.type === "category"
      )
        return [...acc, item];
      if (item.children && item.children.length > 0) {
        const foundInChildren = findCategoryInTree(item.children, targetId);
        if (foundInChildren.length > 0)
          return [...acc, { ...item, children: foundInChildren }];
      }
      return acc;
    }, []);
  };

  const findTextInTree = (
    items: MegaMenuInterface[],
    searchTerm: string
  ): MegaMenuInterface[] => {
    return items.reduce((acc: MegaMenuInterface[], item: MegaMenuInterface) => {
      if (
        ((item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.code &&
            item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.engTitle &&
            item.engTitle.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        item.type === "product"
      ) {
        return [...acc, item];
      }
      if (item.children && item.children.length > 0) {
        const foundInChildren = findTextInTree(item.children, searchTerm);
        if (foundInChildren.length > 0)
          return [...acc, { ...item, children: foundInChildren }];
      }
      return acc;
    }, []);
  };

  let filteredCategories = response.data.data || [];
  if (searchParams.category) {
    if (
      typeof searchParams.category === "string" &&
      isNaN(parseInt(searchParams.category))
    ) {
      filteredCategories = findCategoryInTree(
        filteredCategories,
        searchParams.category
      );
    } else {
      const categoryId = parseInt(searchParams.category);
      if (!isNaN(categoryId)) {
        filteredCategories = findCategoryInTree(filteredCategories, categoryId);
      }
    }
  }

  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredCategories = findTextInTree(filteredCategories, searchTerm);
  }

  const convertToCategory = (
    item: MegaMenuInterface,
    hasChildren = true
  ): ICategory => ({
    id: item.id,
    title: item.title,
    parentId: item.parentId,
    code: item.code,
    icon: item.icon,
    isChecked: false,
    orderNo: 1,
    children: hasChildren
      ? (item.children || []).map((child) => convertToCategory(child, false))
      : [],
  });

  const categoryFilterCategories = (categoryResponse?.data?.data || []).map(
    (category) => convertToCategory(category)
  );

  const isMobile = isMobileDevice();

  // ✅ فقط داده‌ها را به کلاینت پاس بده، نه فانکشن‌ها
  return (
    <ProductListClient
      filteredCategories={filteredCategories}
      categoryFilterCategories={categoryFilterCategories}
      total={response?.data?.total ?? 0}
      isMobile={isMobile}
      searchParams={searchParams}
    />
  );
}
