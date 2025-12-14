export const getCleanFileName = (url: string | null | undefined): string => {
  if (!url) return "فایل نامعلوم";

  const fullFileName = url.split("/").pop()?.split("?")[0] ?? "فایل نامعلوم";
  const match = fullFileName.match(/^\d+-(.*)$/);

  if (match && match[1]) {
    return match[1];
  }
  return fullFileName;
};
