import { Metadata } from "next";

export const BASE_TITLE = process.env.NEXT_PUBLIC_BASE_TITLE || "ارانیکو";
export const DEFAULT_META_DESCRIPTION =
  process.env.NEXT_PUBLIC_DEFAULT_META_DESCRIPTION ||
  "اولین سرویس بازرگانی الکترونیک در ایران";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ارانیکو";

export const GetTitle = (title?: null | string) => {
  if (title && title.trim() !== "") {
    return `${title} | ${BASE_TITLE}`;
  }
  return BASE_TITLE;
};

export const GetMetaDescription = (description?: null | string) => {
  if (description && description.trim() !== "") {
    return description;
  }
  return DEFAULT_META_DESCRIPTION;
};

export const GetMetadata = (title?: null | string, description?: null | string) => {
  return {
    title: GetTitle(title) || "",
    description: GetMetaDescription(description) || "",
  };
};
