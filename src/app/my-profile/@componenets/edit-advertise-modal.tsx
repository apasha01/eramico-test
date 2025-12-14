import { axiosInstance } from "@/Helpers/axiosInstance";
import { SAVE_ADVERTISE } from "@/lib/urls";
import {
  Box,
  Button,
  Grid,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type NewAdvertiseForm,
  newAdvertiseFormSchema,
} from "@/Helpers/schemas/new-advertise-form";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import DatePicker from "@/Components/common/date-picker";
import OnlineSearch from "@/Components/common/online-search";
import TextWithSelect from "@/Components/common/text-with-select";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth:
    typeof window !== "undefined" && window.innerWidth <= 460 ? "100%" : 640,
  minHeight:
    typeof window !== "undefined" && window.innerWidth <= 460 ? "100%" : 600,
  bgcolor: "#FDFDFD",
  border: "1px solid #E0E0E0",
  p: 3,
  maxHeight: "80vh",
  overflowY: "scroll",
};

interface EditAdvertiseModalProps {
  show: boolean;
  item: any; // آگهی انتخاب‌شده برای ویرایش
  isAd?: boolean;
  onClose: () => void;
  options: any;
  setShouldUpdate: (v: boolean) => void;
}

const EditAdvertiseModal = ({
  show,
  item,
  onClose,
  options,
  isAd = true,
  setShouldUpdate,
}: EditAdvertiseModalProps) => {
  // پیش‌فرض‌ها از options
  const defaultsFromOptions = useMemo(() => {
    const defaultPriceUnit =
      options["PriceUnitPropertyId"]?.find((x: any) => x.isDefault)?.id ??
      options["PriceUnitPropertyId"]?.[0]?.id ??
      0;
    const defaultAmountUnit =
      options["AmountUnitPropertyId"]?.find((x: any) => x.isDefault)?.id ??
      options["AmountUnitPropertyId"]?.[0]?.id ??
      0;
    const defaultCompany =
      options["CompanyId"]?.find((x: any) => x.isOwner)?.id ??
      options["CompanyId"]?.[0]?.id ??
      0;

    return { defaultPriceUnit, defaultAmountUnit, defaultCompany };
  }, [options]);

  const isEditMode = !!item?.id;
  const [forMe, setForMe] = useState(false);

  const form = useForm<NewAdvertiseForm>({
    resolver: zodResolver(newAdvertiseFormSchema),
    defaultValues: {
      productId: 0,
      productTypeId: 0,
      producerCountryPropertyId: 0,
      dealTypePropertyId: 0,
      packingTypePropertyId: 0,
      deliveryLocationPropertyId: 0,
      priceBasePropertyId: 0,
      productGradeId: 0,
      amountUnitPropertyId: defaultsFromOptions.defaultAmountUnit,
      priceUnitPropertyId: defaultsFromOptions.defaultPriceUnit,
      advertiseModeId: 0,
      companyId: defaultsFromOptions.defaultCompany,
      minAmount: null,
      maxAmount: null,
      deliveryCost: null,
      price: null,
      description: "",
      technicalInfo: "",
      expirationDate: "",
      deliveryDate: "",
      producer: "",
    },
  });

  const router = useRouter();
  // پر کردن فرم با آیتم انتخاب‌شده
  useEffect(() => {
    if (!item) return;

    form.reset({
      productId: item.productId ?? 0,
      productTypeId: item.productTypeId ?? 0,
      producerCountryPropertyId: item.producerCountryPropertyId ?? 0,
      dealTypePropertyId: item.dealTypePropertyId ?? 0, // bugfix: pealTypePropertyId → dealTypePropertyId
      packingTypePropertyId: item.packingTypePropertyId ?? 0,
      deliveryLocationPropertyId: item.deliveryLocationPropertyId ?? 0,
      priceBasePropertyId: item.priceBasePropertyId ?? 0,
      productGradeId: item.productGradeId ?? 0,
      amountUnitPropertyId:
        item.amountUnitPropertyId ?? defaultsFromOptions.defaultAmountUnit,
      priceUnitPropertyId:
        item.priceUnitPropertyId ?? defaultsFromOptions.defaultPriceUnit,
      advertiseModeId: item.advertiseModeId ?? 0,
      companyId: item.companyId ?? defaultsFromOptions.defaultCompany,
      minAmount: item.minAmount ?? null,
      maxAmount: item.maxAmount ?? null,
      deliveryCost: item.deliveryCost ?? null,
      price: item.price ?? null,
      description: item.description ?? "",
      technicalInfo: item.technicalInfo ?? "",
      expirationDate: item.expirationDate ?? "",
      deliveryDate: item.deliveryDate ?? "",
      producer: item.producer ?? "",
    });
  }, [form, item, defaultsFromOptions]);

  /**
   * تشخیص خالی‌بودن برای FormData:
   * - null, undefined, ""
   * - عدد 0 (طبق خواسته شما ارسال نشود)
   * - false مجاز است و حذف نمی‌شود
   */
  const isEmptyForForm = (v: any) =>
    v === null ||
    v === undefined ||
    v === "" ||
    (typeof v === "number" && v === 0);

  /**
   * ساخت FormData بدون ارسال فیلدهای خالی یا 0
   */
  const buildFormDataSansEmpty = (data: Record<string, any>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (!isEmptyForForm(value)) {
        // اگر تاریخ آبجکت Moment/Dayjs باشد، تبدیل به string
        if (
          typeof value === "object" &&
          value !== null &&
          typeof (value as any).toISOString === "function"
        ) {
          fd.append(key, (value as any).toISOString());
        } else {
          fd.append(key, value as any);
        }
      }
    });
    return fd;
  };

  const editAdvertise = async (data: any) => {
    // همیشه id رو می‌فرستیم حتی اگر 0 یا null باشد (معمولا id معتبر است)
    const formData = buildFormDataSansEmpty({ ...data, id: item.id });

    try {
      const response = await axiosInstance.post(SAVE_ADVERTISE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShouldUpdate(true);
        onClose();
        router.refresh();
      } else {
        toast.error(response.data.message);
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("مشکلی در ذخیره تغییرات رخ داد");
    }
  };

  // پاکسازی آبجکت (اختیاری، اگر بخوای قبل از ساخت FormData هم حذف کنی)
  const sanitize = (values: any) =>
    Object.fromEntries(
      Object.entries(values).filter(([, v]) => !isEmptyForForm(v))
    );

  const onSubmit = (values: any) => {
    // AdvertiseTypeId طبق نیاز شما اضافه می‌شود
    const payload = { ...values, AdvertiseTypeId: isAd ? 1 : 2 };
    // (اختیاری) اگر بخوای قبل از ساخت FormData پاک‌سازی بشه:
    // const cleanObject = sanitize(payload);
    editAdvertise(payload);
  };

  const onInvalid = (errors: any) => {
    const messages = Array.from(
      new Set(
        Object.values(errors)
          .map((err: any) => {
            if (!err) return null;
            if (err?.message) return err.message;
            if (err?.types) return Object.values(err.types).join(" | ");
            return null;
          })
          .filter(Boolean) as string[]
      )
    );

    if (messages.length === 0) {
      toast.error("لطفا فیلدهای الزامی را تکمیل کنید");
    } else if (messages.length === 1) {
      toast.error(messages[0]);
    } else {
      toast.error(messages.join("\n"));
    }
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: "scroll" }}
      dir="rtl"
      className="modal-box"
    >
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">
            {isAd ? "ویرایش آگهی" : "ویرایش استعلام"}
          </h3>
        </div>

        {/* فرم */}
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <Grid container spacing={2}>
            {/* Required fields */}
            <OnlineSearch
              name="productId"
              placeholder="نام کالا را جستجو کنید..."
              label="نام کالا"
              required
              control={form.control}
              hasError={!!form.formState.errors.productId}
              defaultValue={item?.productId || ""}
              defaultTitle={item?.productTitle || ""}
            />

            <TextWithSelect
              name="price"
              id="priceUnitPropertyId"
              control={form.control}
              options={options["PriceUnitPropertyId"]}
              label="قیمت"
              type="number"
              placeholder="قیمت"
              hasError={!!form.formState.errors.priceUnitPropertyId}
            />

            <SelectInput
              id="amountUnitPropertyId"
              control={form.control}
              options={options["AmountUnitPropertyId"]}
              label="واحد کالا"
              required={!!(form.watch("minAmount") || form.watch("maxAmount"))}
              placeholder="واحد کالا را انتخاب کنید"
              hasError={!!form.formState.errors.amountUnitPropertyId}
            />

            {options["CompanyId"] && options["CompanyId"].length > 0 && (
              <SelectInput
                disabled={isEditMode}
                id="companyId"
                control={form.control}
                options={options["CompanyId"]}
                label="شرکت"
                placeholder="شرکت را انتخاب کنید"
                sm={12}
              />
            )}

            <TextInput
              name="description"
              control={form.control}
              label="توضیحات"
              placeholder="توضیحات را وارد کنید"
              multiline
              type="text"
              xs={12}
              sm={12}
            />

            {/* Optional fields inside collapsible */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600} fontSize={14}>
                    اطلاعات تکمیلی (اختیاری)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <SelectInput
                      id="productTypeId"
                      control={form.control}
                      options={options["ProductTypeId"]}
                      label="نوع کالا"
                      placeholder="نوع کالا را انتخاب کنید"
                    />
                    <SelectInput
                      id="dealTypePropertyId"
                      control={form.control}
                      options={options["DealTypePropertyId"]}
                      label="نوع معامله"
                      placeholder="نوع معامله را انتخاب کنید"
                    />
                    <TextInput
                      name="producer"
                      control={form.control}
                      label="تولیدکننده"
                      placeholder="تولیدکننده را وارد کنید"
                      type="text"
                    />
                    <SelectInput
                      id="producerCountryPropertyId"
                      control={form.control}
                      options={options["ProducerCountryPropertyId"]}
                      label="کشور تولید کننده"
                      placeholder="کشور تولیدکننده را انتخاب کنید"
                    />
                    <SelectInput
                      id="packingTypePropertyId"
                      control={form.control}
                      options={options["PackingTypePropertyId"]}
                      label="نوع بسته بندی"
                      placeholder="نوع بسته‌بندی را انتخاب کنید"
                    />
                    <SelectInput
                      id="deliveryLocationPropertyId"
                      control={form.control}
                      options={options["DeliveryLocationPropertyId"]}
                      label="محل تحویل"
                      placeholder="محل تحویل را انتخاب کنید"
                    />

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="deliveryDate"
                        control={form.control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            label="تاریخ تحویل"
                            placeholder="تاریخ تحویل را انتخاب کنید"
                          />
                        )}
                      />
                    </Grid>

                    <SelectInput
                      id="priceBasePropertyId"
                      control={form.control}
                      options={options["PriceBasePropertyId"]}
                      label="قیمت پایه"
                      placeholder="قیمت پایه را انتخاب کنید"
                    />
                    <SelectInput
                      id="productGradeId"
                      control={form.control}
                      options={options["ProductGradeId"]}
                      label="درجه کالا"
                      placeholder="درجه کالا را انتخاب کنید"
                    />

                    <TextInput
                      name="deliveryCost"
                      control={form.control}
                      label="هزینه ارسال"
                      placeholder="হزینه ارسال را وارد کنید"
                    />
                    <SelectInput
                      id="advertiseModeId"
                      control={form.control}
                      options={options["AdvertiseModeId"]}
                      label="حالت آگهی"
                      placeholder="حالت آگهی را انتخاب کنید"
                    />
                    {false && (
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="expirationDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              placeholder="تاریخ انقضا را انتخاب کنید"
                              label="تاریخ انقضا"
                            />
                          )}
                        />
                      </Grid>
                    )}

                    <TextInput
                      name="minAmount"
                      control={form.control}
                      label="کمترین مقدار قابل سفارش"
                      placeholder="کمترین مقدار قابل سفارش را وارد کنید"
                      hasError={!!form.formState.errors.minAmount}
                    />
                    <TextInput
                      name="maxAmount"
                      control={form.control}
                      label="بیشترین مقدار قابل سفارش"
                      placeholder="بیشترین مقدار قابل سفارش را وارد کنید"
                      hasError={!!form.formState.errors.maxAmount}
                    />
                    <TextInput
                      name="contactNumber"
                      control={form.control}
                      label="شماره تماس"
                      placeholder="شماره تماس را وارد کنید"
                      type="text"
                      helperText="در صورتی که می‌خواهید برای این آگهی شماره تماس مختص به آن ثبت کنید، این قسمت را پر نمایید."
                    />

                    <TextInput
                      name="technicalInfo"
                      control={form.control}
                      label="اطلاعات فنی"
                      placeholder="اطلاعات فنی را وارد کنید"
                      multiline
                      type="text"
                      xs={12}
                      sm={12}
                    />
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          <div className="d-flex mt-5 justify-content-center sticky-bottom">
            <Button
              variant="contained"
              className="mt-5 w-100"
              type="submit"
              style={{ background: isAd ? "#0d47a1" : "orange" }}
            >
              ثبت ویرایش
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditAdvertiseModal;
