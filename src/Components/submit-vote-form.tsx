import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  CATEGORY_LOOKUP_MAIN,
  SUBMIT_VOTE,
  SUBMIT_VOTE_COMPANIES,
  VOTE_DETAILS,
} from "@/lib/urls";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectInput from "@/Components/common/select-input";
import TextInput from "@/Components/common/text-input";
import { SubmitVote, submitVoteSchema } from "@/Helpers/schemas/submit-social";
import MultiSelect from "./common/multi-select";
import { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "@/lib/hooks";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

interface SubmitVoteFormProps {
  onModalClose: () => void;
  isEditMode?: boolean;
  voteId?: number | string;
  onSuccess?: () => void;
}

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SubmitVoteForm = ({
  onModalClose,
  isEditMode = false,
  voteId,
  onSuccess,
}: SubmitVoteFormProps) => {
  const [voteOptions, setVoteOptions] = useState<
    { id?: number; title: string }[]
  >([{ title: "" }, { title: "" }]);
  const [voteOptionsErrors, setVoteOptionsErrors] = useState("");
  const [forMe, setForMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [options, setOptions] = useState<any>({
    CategoryId: [],
    VoteCompanyId: [],
    PostCompanyId: [],
  });

  const form = useForm<SubmitVote>({
    resolver: zodResolver(submitVoteSchema),
    defaultValues: {
      companyId: 0,
      categoryIds: [],
      title: "",
    },
  });

  const fetchVoteDetails = async () => {
    if (!isEditMode || !voteId) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`${VOTE_DETAILS}/${voteId}`);
      if (res.data.success) {
        const data = res.data.data;

        form.reset({
          companyId: data.companyId,
          title: data.title,
          categoryIds: data.categoryIds || [],
        });

        const fetchedOptions =
          data.options?.map((o: any) => ({
            id: o.id,
            title: o.title,
          })) || [];

        setVoteOptions(
          fetchedOptions.length > 0
            ? fetchedOptions
            : [{ title: "" }, { title: "" }]
        );
        setForMe(data.companyId === 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(CATEGORY_LOOKUP_MAIN),
          axiosInstance.get(SUBMIT_VOTE_COMPANIES),
        ]);

        results.forEach((result, index) => {
          const optionKeys = ["CategoryId", "PostCompanyId", "VoteCompanyId"];

          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            setOptions((prev: any) => ({
              ...prev,
              [optionKey]: result.value.data.success
                ? result.value.data.data
                : [],
            }));

            if (!isEditMode && index === 1) {
              const defaultCompanyId =
                result.value.data.data.find((item: any) => item.isOwner)?.id ||
                result.value.data.data[0]?.id ||
                0;

              form.reset({
                ...form.getValues(),
                companyId: defaultCompanyId,
              });
            }
          } else {
            setOptions((prev: any) => ({
              ...prev,
              [optionKey]: [],
            }));
          }
        });

        if (isEditMode) {
          await fetchVoteDetails();
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [isEditMode, voteId]);

  const addOption = () => {
    setVoteOptions([...voteOptions, { title: "" }]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...voteOptions];
    updatedOptions[index].title = value;
    setVoteOptions(updatedOptions);
  };

  const deleteOption = (index: number) => {
    if (voteOptions.length > 2) {
      const updatedOptions = voteOptions.filter((_, i) => i !== index);
      setVoteOptions(updatedOptions);
    }
  };

  const saveVote = async (data: any) => {
    const formData = new FormData();

    if (isEditMode && voteId) {
      formData.append("Id", voteId.toString());
    }

    formData.append("companyId", data.companyId.toString());
    formData.append("title", data.title);

    if (data.categoryIds && data.categoryIds.length > 0) {
      data.categoryIds.forEach((id: number) => {
        formData.append("CategoryIds[]", id.toString());
      });
    }

    voteOptions.forEach(
      (option: { id?: number; title: string }, index: number) => {
        if (option.title.trim()) {
          if (option.id) {
            formData.append(`Options[${index}].id`, option.id.toString());
          }
          formData.append(`Options[${index}].title`, option.title);
        }
      }
    );

    try {
      const response = await axiosInstance.post(SUBMIT_VOTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess?.();
        document.getElementById("refresh-posts")?.click();
        onModalClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const emptyOptions = voteOptions.filter((option) => !option.title.trim());

    if (voteOptions.length < 2) {
      setVoteOptionsErrors("تعداد گزینه‌های نظرسنجی باید حداقل دو باشد.");
      return;
    }

    if (emptyOptions.length > 0) {
      setVoteOptionsErrors("تمام گزینه‌های نظرسنجی باید عنوان داشته باشند.");
      return;
    }

    setVoteOptionsErrors("");
    saveVote(values);
  };

  const defaultCompany =
    options["PostCompanyId"]?.find((item: any) => item.isOwner)?.id ||
    options["PostCompanyId"]?.[0]?.id;

  return (
    <Modal
      open={true}
      onClose={onModalClose}
      aria-labelledby="delete-modal-name"
      dir="rtl"
      className="modal-box"
    >
      <Box sx={{ ...modalStyle, width: { xs: "90%", sm: "80%", md: 700 } }}>
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onModalClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">
            {isEditMode ? "ویرایش نظرسنجی" : "ثبت نظرسنجی"}
          </h3>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={1}
            style={{ maxHeight: 500, overflowY: "auto" }}
          >
            {defaultCompany && (
              <SelectInput
                id="companyId"
                control={form.control}
                options={options["PostCompanyId"]}
                label="شرکت"
                placeholder="شرکت را انتخاب کنید"
                sm={12}
                disabled={forMe || isEditMode}
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
                  if (!isEditMode) {
                    setForMe(!forMe);
                    form.setValue("companyId", forMe ? defaultCompany || 0 : 0);
                  }
                }}
                disabled={isEditMode}
                startIcon={
                  <Radio
                    checked={forMe === true}
                    checkedIcon={
                      <ImCheckboxChecked
                        size={24}
                        style={{ color: "#FB8C00" }}
                      />
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
                  ارسال توسط خودم
                </Typography>
              </Button>
            </Grid>

            <TextInput
              name="title"
              control={form.control}
              label="عنوان نظرسنجی"
              placeholder="عنوان نظرسنجی را وارد کنید"
              hasError={!!form.formState.errors.title}
              type="text"
              sm={12}
            />

            <MultiSelect
              id="categoryIds"
              control={form.control}
              label="دسته‌بندی"
              placeholder="دسته‌بندی را انتخاب کنید"
              options={options["CategoryId"]}
              sm={12}
            />

            <Grid item xs={12}>
              <InputLabel
                className="fs-14 mb-2 fw-400"
                style={{ color: "#9E9E9E99" }}
              >
                گزینه‌های نظرسنجی
              </InputLabel>

              {voteOptions.map((option, index) => (
                <div
                  key={option.id || index}
                  className="d-flex align-items-center mb-2"
                >
                  <TextField
                    fullWidth
                    className="input-border"
                    placeholder={
                      !option.title ? `گزینه ${index + 1}` : undefined
                    }
                    value={option.title}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {voteOptions.length > 2 && (
                    <IconButton
                      onClick={() => deleteOption(index)}
                      color="error"
                      className="p-"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}

              <IconButton
                onClick={addOption}
                color="primary"
                className="px-0 m-0"
              >
                <AddCircleIcon sx={{ color: "#fb8c00" }} />
                <Typography variant="body2" className="fs-12 me-2">
                  افزودن گزینه
                </Typography>
              </IconButton>

              <p className="red fs-13">{voteOptionsErrors}</p>
            </Grid>
          </Grid>

          <div className="d-flex justify-content-center">
            <Button variant="contained" className="w-100" type="submit">
              {isEditMode ? "ویرایش و ذخیره" : "ثبت نظرسنجی"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default SubmitVoteForm;
