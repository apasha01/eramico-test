import { axiosInstance } from "@/Helpers/axiosInstance";
import { SAVE_INQUIRY } from "@/lib/urls";
import {
  Box,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Radio,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useEffect, useState } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";

interface UserConfigResponse {
  advertiseSubmit: boolean;
  inquirySubmit: boolean;
}

interface NewInquiryFormProps {
  onModalClose: () => void;
  options: any;
  productId?: number;
  productTitle?: string;
  onSuccess?: () => void; // ✅ اضافه شد
}

const NewInquiryForm = ({
  onModalClose,
  options,
  productId,
  productTitle,
  onSuccess, // ✅ اضافه شد
}: NewInquiryFormProps) => {
  const defaultPriceUnit = options["PriceUnitPropertyId"]?.find(
    (item: any) => item.isDefault
  )?.id;
  const defaultAmountUnit = options["AmountUnitPropertyId"]?.find(
    (item: any) => item.isDefault
  )?.id;
  const defaultCompany =
    options["CompanyId"]?.find((item: any) => item.isOwner)?.id ||
    options["CompanyId"]?.[0]?.id;
  const [forMe, setForMe] = useState<boolean>(false);
  const [userConfig, setUserConfig] = useState<UserConfigResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);

  // TODO: it must be removed and handled in a global way
  useEffect(() => {
    const fetchUserConfig = async () => {
      setLoadingConfig(true);
      try {
        const response = await axiosInstance.get<
          IAPIResult<UserConfigResponse>
        >("/User/Config");
        if (response.data.success) {
          setUserConfig(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user config:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchUserConfig();
  }, []);

  const defaultValues = {
    productId: productId || 0,
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

  // ✅ این تابع تغییر کرده
  const saveAdvertise = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(SAVE_INQUIRY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        if (onSuccess) onSuccess(); // ✅ باعث رفرش لیست والد می‌شود
        onModalClose(); // ✅ بستن مودال بعد از موفقیت
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("خطا در ثبت استعلام");
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );
    saveAdvertise({ ...cleanObject, AdvertiseTypeId: 2 });
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
    <Box>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <Grid container spacing={2}>
          {!userConfig?.inquirySubmit && !loadingConfig && (
            <Grid item xs={12}>
              <Alert severity="warning" className="mb-4 p-4">
                جهت ثبت استعلام نسبت به خرید اشتراک اقدام نمایید.
              </Alert>
            </Grid>
          )}
          {/* Required (اصلی) fields */}
          <OnlineSearch
            name="productId"
            placeholder="نام کالا را جستجو کنید..."
            label="نام کالا"
            required
            control={form.control}
            hasError={!!form.formState.errors.productId}
            defaultValue={productId || ""}
            defaultTitle={productTitle || ""}
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
            defaultSelectValue={defaultAmountUnit}
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
              disabled={forMe}
            />
          )}

          <Grid item sm={12}>
            <Button
              variant="text"
              disableRipple
              sx={{
                color: "black",
              }}
              onClick={() => {
                setForMe(!forMe);
                form.setValue("companyId", forMe ? defaultCompany || 0 : 0);
              }}
              startIcon={
                <Radio
                  checked={forMe === true}
                  checkedIcon={
                    <ImCheckboxChecked size={24} style={{ color: "#FB8C00" }} />
                  }
                  style={{ color: "#E0E0E0" }}
                  icon={
                    <ImCheckboxUnchecked
                      size={24}
                      style={{ color: "#E0E0E0" }}
                    />
                  }
                />
              }
            >
              <Typography fontSize={12} fontWeight={500} color={"black"}>
                ارسال برای خودم
              </Typography>
            </Button>
          </Grid>

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
                    defaultSelectValue={defaultPriceUnit}
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
          <Button variant="contained" className="mt-5 w-100" type="submit">
            ثبت استعلام
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default NewInquiryForm;
