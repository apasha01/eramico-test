import { axiosInstance } from "@/Helpers/axiosInstance";
import { SAVE_INQUIRY } from "@/lib/urls";
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
  type NewInquiryForm,
  newInquiryFormSchema,
} from "@/Helpers/schemas/new-advertise-form";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import DatePicker from "@/Components/common/date-picker";
import OnlineSearch from "@/Components/common/online-search";
import TextWithSelect from "@/Components/common/text-with-select";
import { useEffect, useMemo } from "react";
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

interface EditInquiryModalProps {
  show: boolean;
  item: any;
  onClose: () => void;
  options: any;
  setShouldUpdate: (v: boolean) => void;
}

const EditInquiryModal = ({
  show,
  item,
  onClose,
  options,
  setShouldUpdate,
}: EditInquiryModalProps) => {
  // keep the same defaults logic as NewInquiryForm
  const { defaultPriceUnit, defaultAmountUnit, defaultCompany } =
    useMemo(() => {
      const priceUnit =
        options?.["PriceUnitPropertyId"]?.find((it: any) => it.isDefault)?.id ??
        options?.["PriceUnitPropertyId"]?.[0]?.id ??
        0;

      const amountUnit =
        options?.["AmountUnitPropertyId"]?.find((it: any) => it.isDefault)
          ?.id ??
        options?.["AmountUnitPropertyId"]?.[0]?.id ??
        0;

      const company =
        options?.["CompanyId"]?.find((it: any) => it.isOwner)?.id ??
        options?.["CompanyId"]?.[0]?.id ??
        0;

      return {
        defaultPriceUnit: priceUnit,
        defaultAmountUnit: amountUnit,
        defaultCompany: company,
      };
    }, [options]);

  const defaultValues: NewInquiryForm = {
    productId: 0,
    productTypeId: 0,
    producerCountryPropertyId: 0,
    dealTypePropertyId: 0,
    productGradeId: 0,
    amountUnitPropertyId: defaultAmountUnit || 0,
    priceUnitPropertyId: defaultPriceUnit || 0,
    advertiseModeId: 0,
    companyId: defaultCompany || 0,
    amount: null,
    price: null,
    description: "",
    technicalInfo: "",
    expirationDate: "",
    producer: "",
  };

  const form = useForm<NewInquiryForm>({
    resolver: zodResolver(newInquiryFormSchema),
    defaultValues,
  });

  const router = useRouter();
  // sync form with selected item
  useEffect(() => {
    if (!item) return;
    form.reset({
      productId: item.productId ?? 0,
      productTypeId: item.productTypeId ?? 0,
      producerCountryPropertyId: item.producerCountryPropertyId ?? 0,
      dealTypePropertyId: item.dealTypePropertyId ?? 0, // fixed typo
      productGradeId: item.productGradeId ?? 0,
      amountUnitPropertyId: item.amountUnitPropertyId ?? defaultAmountUnit ?? 0,
      priceUnitPropertyId: item.priceUnitPropertyId ?? defaultPriceUnit ?? 0,
      advertiseModeId: item.advertiseModeId ?? 0,
      companyId: item.companyId ?? defaultCompany ?? 0,
      amount: item.amount ?? null,
      price: item.price ?? null,
      description: item.description ?? "",
      technicalInfo: item.technicalInfo ?? "",
      expirationDate: item.expirationDate ?? "",
      producer: item.producer ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, defaultAmountUnit, defaultPriceUnit, defaultCompany]);

  const editInquiry = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });
    formData.append("id", String(item?.id));

    try {
      const response = await axiosInstance.post(SAVE_INQUIRY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setShouldUpdate(true);
        onClose();
        router.refresh();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("در ذخیره‌سازی مشکلی پیش آمد");
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );
    editInquiry({ ...cleanObject, AdvertiseTypeId: 2 });
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
          <h3 className="fs-18 fw-bolder px-2">ویرایش استعلام</h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <Grid container spacing={2}>
            {/* Required (اصلی) fields */}
            <OnlineSearch
              name="productId"
              placeholder="نام کالا را جستجو کنید..."
              label="نام کالا"
              required
              control={form.control}
              hasError={!!form.formState.errors.productId}
              defaultTitle={item?.productTitle || ""}
              defaultValue={item?.productId || ""}
            />

            <Grid item xs={12} sm={6}>
              <Controller
                name="expirationDate"
                control={form.control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    label="تاریخ پایان استعلام"
                    placeholder="تاریخ پایان استعلام را انتخاب کنید"
                    hasError={!!form.formState.errors.expirationDate}
                    required
                  />
                )}
              />
            </Grid>

            <TextWithSelect
              name="amount"
              id="amountUnitPropertyId"
              control={form.control}
              options={options["AmountUnitPropertyId"]}
              defaultSelectValue={
                form.getValues("amountUnitPropertyId") || defaultAmountUnit
              }
              label="مقدار مورد نیاز"
              placeholder="مقدار مورد نیاز را وارد کنید"
              hasError={!!form.formState.errors.amountUnitPropertyId}
            />

            {options["CompanyId"] && options["CompanyId"].length > 0 && (
              <SelectInput
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
              multiline={true}
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
                    <TextWithSelect
                      name="price"
                      id="priceUnitPropertyId"
                      control={form.control}
                      options={options["PriceUnitPropertyId"]}
                      defaultSelectValue={
                        form.getValues("priceUnitPropertyId") ||
                        defaultPriceUnit
                      }
                      label="قیمت مد نظر"
                      placeholder="قیمت مد نظر را وارد کنید"
                      hasError={!!form.formState.errors.priceUnitPropertyId}
                    />
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
                      id="productGradeId"
                      control={form.control}
                      options={options["ProductGradeId"]}
                      label="درجه کالا"
                      placeholder="درجه کالا را انتخاب کنید"
                    />
                    <SelectInput
                      id="advertiseModeId"
                      control={form.control}
                      options={options["AdvertiseModeId"]}
                      label="حالت استعلام"
                      placeholder="حالت استعلام را انتخاب کنید"
                    />
                    <TextInput
                      name="technicalInfo"
                      control={form.control}
                      label="اطلاعات فنی"
                      placeholder="اطلاعات فنی را وارد کنید"
                      multiline={true}
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
              sx={{
                backgroundColor: "orange",
              }}
            >
              ثبت ویرایش
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditInquiryModal;
