import { z } from "zod";

export const newAdvertiseFormSchema = z
  .object({
    productId: z.coerce.number().min(1, "انتخاب کالا الزامی است."), // کالا
    productTypeId: z.coerce.number().optional(), // نوع کالا
    producerCountryPropertyId: z.coerce.number().optional(), //کشور تولید کننده
    dealTypePropertyId: z.coerce.number().optional(), // نوع معامله
    packingTypePropertyId: z.coerce.number().optional(), // نوع بسته بندی
    deliveryLocationPropertyId: z.coerce.number().optional(), // محل تحویل
    priceBasePropertyId: z.coerce.number().optional(), // قیمت پایه
    productGradeId: z.coerce.number().optional(), // درجه کالا
    amountUnitPropertyId: z.coerce.number().optional(), // واحد مقدار (شرطی)
    priceUnitPropertyId: z.coerce.number().optional(), // واحد قیمت (شرطی)
    advertiseModeId: z.coerce.number().optional(), // حالت آگهی
    minAmount: z.coerce.number().optional().nullable(), // حداقل مقدار قابل سفارش
    maxAmount: z.coerce.number().optional().nullable(), // حداکثر مقدار قابل سفارش
    deliveryCost: z.coerce.number().optional().nullable(), // هزینه ارسال'
    price: z.coerce.number().nullable(), // قیمت
    description: z.string(), // توضیحات
    technicalInfo: z.string(), // اطلاعات فنی
    expirationDate: z.string(), // تاریخ انقضا
    deliveryDate: z.string(), // تاریخ تحویل
    companyId: z.coerce.number(), // شرکت
    producer: z.string(), //تولید کننده
  })
  .refine(
    (data) => {
      // If price provided (non-null and not empty), priceUnitPropertyId must be > 0
      if (
        data.price !== null &&
        data.price !== undefined &&
        !isNaN(Number(data.price)) &&
        data.price > 0
      ) {
        return (
          !!data.priceUnitPropertyId && Number(data.priceUnitPropertyId) > 0
        );
      }
      return true;
    },
    {
      path: ["priceUnitPropertyId"],
      message: "واحد قیمت الزامی است", // Required price unit when price entered
    }
  )
  .refine(
    (data) => {
      // If either minAmount or maxAmount provided, amountUnitPropertyId must be > 0
      const hasAmount = [data.minAmount, data.maxAmount].some(
        (v) => v !== null && v !== undefined && !isNaN(Number(v)) && v > 0
      );
      if (hasAmount) {
        return (
          !!data.amountUnitPropertyId && Number(data.amountUnitPropertyId) > 0
        );
      }
      return true;
    },
    {
      path: ["amountUnitPropertyId"],
      message: "واحد مقدار الزامی است", // Required amount unit when amount entered
    }
  )
  .refine(
    (data) => {
      if (data.minAmount && data.maxAmount) {
        return (
          (Number(data.minAmount) || Number.MIN_VALUE) <
          (Number(data.maxAmount) || Number.MAX_VALUE)
        );
      }
      return true;
    },
    {
      path: ["minAmount"],
      message:
        "کمترین مقدار قابل سفارش باید کمتر از بیشترین مقدار قابل سفارش باشد.",
    }
  );

export const newInquiryFormSchema = z
  .object({
    productId: z.coerce.number().min(1, "انتخاب کالا الزامی است."), // کالا
    productTypeId: z.coerce.number().optional(), // نوع کالا
    productGradeId: z.coerce.number().optional(), // درجه کالا
    advertiseModeId: z.coerce.number().optional(), // حالت آگهی
    producerCountryPropertyId: z.coerce.number().optional(), //کشور تولید کننده
    dealTypePropertyId: z.coerce.number().optional(), // نوع معامله
    producer: z.string(), //تولید کننده
    technicalInfo: z.string(), // اطلاعات فنی
    amountUnitPropertyId: z.coerce.number().optional(), // واحد مقدار
    priceUnitPropertyId: z.coerce.number().optional(), // واحد قیمت
    price: z.coerce.number().nullable(), // قیمت
    description: z.string(), // توضیحات
    expirationDate: z.string().min(1, "تاریخ پایان استعلام الزامی است."), // تاریخ پایان استعلام
    companyId: z.coerce.number().default(0), // شرکت
    amount: z.coerce.number().optional().nullable(), // حداقل مقدار قابل سفارش
  })
  .refine(
    (data) => {
      // If price provided (non-null and not empty), priceUnitPropertyId must be > 0
      if (
        data.price !== null &&
        data.price !== undefined &&
        !isNaN(Number(data.price)) &&
        data.price > 0
      ) {
        return (
          !!data.priceUnitPropertyId && Number(data.priceUnitPropertyId) > 0
        );
      }
      return true;
    },
    {
      path: ["priceUnitPropertyId"],
      message: "واحد قیمت الزامی است", // Required price unit when price entered
    }
  )
  .refine(
    (data) => {
      // If amount provided (non-null and not empty), amountUnitPropertyId must be > 0
      if (
        data.amount !== null &&
        data.amount !== undefined &&
        !isNaN(Number(data.amount)) &&
        data.amount > 0
      ) {
        return (
          !!data.amountUnitPropertyId && Number(data.amountUnitPropertyId) > 0
        );
      }
      return true;
    },
    {
      path: ["amountUnitPropertyId"],
      message: "واحد مقدار الزامی است", // Required amount unit when amount entered
    }
  );

export type NewAdvertiseForm = z.infer<typeof newAdvertiseFormSchema>;
export type NewInquiryForm = z.infer<typeof newInquiryFormSchema>;
