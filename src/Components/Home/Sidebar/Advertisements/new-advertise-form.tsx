import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {
  ImCheckboxChecked,
  ImCheckboxUnchecked,
  ImRadioUnchecked,
  ImUnlocked,
} from "react-icons/im";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { SAVE_ADVERTISE } from "@/lib/urls";
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
  type NewAdvertiseForm,
  newAdvertiseFormSchema,
} from "@/Helpers/schemas/new-advertise-form";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import DatePicker from "@/Components/common/date-picker";
import OnlineSearch from "@/Components/common/online-search";
import TextWithSelect from "@/Components/common/text-with-select";
import { useEffect, useState } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";

interface NewAdvertiseFormProps {
  onModalClose: () => void;
  options: any;
  productTitle?: string;
  productId?: number;
}

interface UserConfigResponse {
  advertiseSubmit: boolean;
  inquirySubmit: boolean;
}

const NewAdvertiseForm = ({
  onModalClose,
  options,
  productTitle,
  productId,
}: NewAdvertiseFormProps) => {
  const defaultPriceUnit = options["PriceUnitPropertyId"]?.find(
    (item: any) => item.isDefault
  )?.id;
  const defaultAmountUnit = options["AmountUnitPropertyId"]?.find(
    (item: any) => item.isDefault
  )?.id;
  const defaultCompany =
    options["CompanyId"]?.find((item: any) => item.isOwner)?.id ||
    options["CompanyId"]?.[0]?.id;

  const [forMe, setForMe] = useState(false);
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
    packingTypePropertyId: 0,
    deliveryLocationPropertyId: 0,
    priceBasePropertyId: 0,
    productGradeId: 0,
    amountUnitPropertyId: defaultAmountUnit || 0,
    priceUnitPropertyId: defaultPriceUnit || 0,
    advertiseModeId: 0,
    companyId: defaultCompany || 0,
    minAmount: null,
    maxAmount: null,
    deliveryCost: null,
    price: null,
    description: "",
    technicalInfo: "",
    expirationDate: "",
    deliveryDate: "",
    producer: "",
    contactNumber : ""
  };

  const form = useForm<NewAdvertiseForm>({
    resolver: zodResolver(newAdvertiseFormSchema),
    defaultValues,
  });

  const saveAdvertise = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(SAVE_ADVERTISE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        onModalClose();
      } else {
        toast.error(response.data.message);
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );

    saveAdvertise({ ...cleanObject, AdvertiseTypeId: 1 });
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
          {!userConfig?.advertiseSubmit && !loadingConfig && (
            <Grid item xs={12}>
              <Alert severity="warning" className="mb-4 p-4">
                جهت ثبت آگهی نسبت به خرید اشتراک اقدام نمایید.
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
                    placeholder="هزینه ارسال را وارد کنید"
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
                    helperText="درصورتیکه می خواهید برای این آگهی شماره تماس مختص به آن ثبت کنید این قسمت را پر نمایید."
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
            style={{ background: "#0d47a1" }}
          >
            ثبت آگهی
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default NewAdvertiseForm;
