import { toast } from "react-toastify";

export function numberWithCommas(num?: string | number) {
  if ((!num && num !== 0) || !isNumeric(Math.abs(+num).toString())) return num;
  var parts = num.toString().split(".");
  parts[0] = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length === 2 ? parts.join(".") : parts[0];
}

export const isNumeric = (text: string) => {
  const value = Math.abs(+text);
  return typeof value === "number" && !Number.isNaN(value);
};

export function base64ToFile(base64: string, filename: string) {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid base64 string");
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const convertNumbersToEnglish = (str: string) => {
  const convertedStr = str
    .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => (d.charCodeAt(0) - 1632).toString()) // Convert Arabic numbers
    .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => (d.charCodeAt(0) - 1776).toString()); // Convert Persian numbers

  return convertedStr;
};
