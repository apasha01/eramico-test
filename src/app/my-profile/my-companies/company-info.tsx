import ActivityContext from '@/app/my-profile/dashboard/@componenets/setCompanyComponents/activity-context';
import RtlTextField from '@/Components/common/text-field';
import { axiosInstance } from '@/Helpers/axiosInstance';
import { IAPIResult } from '@/Helpers/IAPIResult';
import { SAVE_COMPANY } from '@/lib/urls';
import { Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type BaseInfo = {
  title?: string;
  code?: string | null;
  address?: string | null;
  telephone?: string | null;
  fax?: string | null;
  ceoName?: string | null;
  ceoPhone?: string | null;
  webpage?: string | null;
  shortIntroduction?: string | null;
  zipCode?: string | null;
  city?: string | null;
  province?: string | null;
  economyCode?: string | null;
  registrationCode?: string | null;
  categoryIds?: number[] | null;
  nationalCode?: string | null;
};

const CompanyEditInfo = ({ props }) => {
  const [form, setForm] = useState<BaseInfo>({});
  const [saving, setSaving] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number[]>(props?.categoryIds ?? []); // زمینه فعالیت

  useEffect(() => {
    setForm({
      title: props?.title ?? "",
      code: props?.code ?? "",
      address: props?.address ?? "",
      telephone: props?.telephone ?? "",
      fax: props?.fax ?? "",
      ceoName: props?.ceoName ?? "",
      ceoPhone: props?.ceoPhone ?? "",
      webpage: props?.webpage ?? "",
      shortIntroduction: props?.shortIntroduction ?? "",
      zipCode: props?.zipCode ?? "",
      city: props?.city ?? "",
      province: props?.province ?? "",
      economyCode: props?.economyCode ?? "",
      registrationCode: props?.registrationCode ?? "",
      nationalCode: props?.nationalCode ?? "",
    });
  }, [props]);

  const handleChange =
    (key: keyof BaseInfo) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
      };

  const handleSave = async () => {
    if (!form.title || !String(form.title).trim()) {
      toast.warning("عنوان شرکت الزامی است.");
      return;
    }
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("Id", props.companyId?.toString() || "");
      payload.append("Title", form.title || "");
      payload.append("Address", form.address || "");
      payload.append("Telephone", form.telephone || "");
      payload.append("CEOPhone", form.ceoPhone || "");
      payload.append("Code", form.code || "");
      payload.append("ShortIntroduction", form.shortIntroduction || "");
      payload.append("Fax", form.fax || "");
      payload.append("CEOName", form.ceoName || "");
      payload.append("Webpage", form.webpage || "");
      payload.append("ZipCode", form.zipCode || "");
      payload.append("City", form.city || "");
      payload.append("Province", form.province || "");
      payload.append("EconomyCode", form.economyCode || "");
      payload.append("RegistrationCode", form.registrationCode || "");
      payload.append("NationalCode", form.nationalCode || "");

      // زمینه‌های فعالیت
      selectedValue.forEach((cid) => {
        payload.append("CategoryIds[]", String(cid));
      });

      const res = await axiosInstance.post<IAPIResult<any>>(
        SAVE_COMPANY,
        payload
      );

      if (res?.data?.success) {
        toast.success(res.data.message || "اطلاعات با موفقیت ذخیره شد.");
      } else {
        toast.warning(res?.data?.message || "ذخیره اطلاعات ناموفق بود.");
      }
    } catch {
      toast.error("در ذخیره اطلاعات خطایی رخ داد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='p-4'>
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} md={6}>
          <RtlTextField
            label="عنوان شرکت *"
            value={form.title ?? ""}
            
            onChange={handleChange("title")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="کد شرکت"
            value={form.code ?? ""}
            onChange={handleChange("code")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <RtlTextField
            label="آدرس"
            
            value={form.address ?? ""}
            onChange={handleChange("address")}
            fullWidth
            multiline
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="تلفن"
            value={form.telephone ?? ""}
            onChange={handleChange("telephone")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="فکس"
            value={form.fax ?? ""}
            onChange={handleChange("fax")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="نام مدیرعامل"
            value={form.ceoName ?? ""}
            onChange={handleChange("ceoName")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="تلفن مدیرعامل"
            value={form.ceoPhone ?? ""}
            onChange={handleChange("ceoPhone")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="وب‌سایت"
            value={form.webpage ?? ""}
            onChange={handleChange("webpage")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <RtlTextField
            label="معرفی کوتاه"
            value={form.shortIntroduction ?? ""}
            onChange={handleChange("shortIntroduction")}
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="کدپستی"
            value={form.zipCode ?? ""}
            onChange={handleChange("zipCode")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="شهر"
            value={form.city ?? ""}
            onChange={handleChange("city")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="استان"
            value={form.province ?? ""}
            onChange={handleChange("province")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="کد اقتصادی"
            value={form.economyCode ?? ""}
            onChange={handleChange("economyCode")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="کد ثبت"
            value={form.registrationCode ?? ""}
            onChange={handleChange("registrationCode")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RtlTextField
            label="کد ملی"
            value={form.nationalCode ?? ""}
            onChange={handleChange("nationalCode")}
            fullWidth
          />
        </Grid>
      </Grid>

      <ActivityContext
        selectedValues={selectedValue}
        setSelectedValues={setSelectedValue}
      />

      <Button
        onClick={handleSave}
        disabled={saving}
        variant="contained"
        sx={{ mt: 2 }}
      >
        {saving ? "در حال ذخیره..." : "ذخیره"}
      </Button>
    </div>
  );
};

export default CompanyEditInfo;
