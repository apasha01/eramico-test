"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../styles.module.css";
import {
  InputAdornment,
  TextField,
  Typography,
  Pagination,
  Skeleton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  IconButton,
  Button,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CiSearch } from "react-icons/ci";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Link from "next/link";
import SamanBank from "@/app/img/BankSaman.png";
import MelatBank from "@/app/img/BankMelat.png";
import UploadBankReceiptDialog from "../@componenets/UploadBankReceiptDialog";
import TransactionIcon from "@/Components/Icons/TransactionIcon";
import { axiosInstance } from "@/Helpers/axiosInstance";
import InvoiceDialog from "@/Components/common/extra/SubscribeHistory/InvoiceDialog";
import SuccessModal from "@/app/plans/@components/SuccessModal";
import { toast } from "react-toastify";

/**
 * مپ وضعیت تیبل از روی subscriptionTypeId
 * هر عدد را به یکی از "success" | "pending" | "failure" مپ کن.
 * این‌ها نمونه‌اند—طبق بک‌اند خودت تغییر بده.
 */
const TYPE_STATUS_MAP: Record<number, "success" | "pending" | "failure"> = {
  1: "success",
  2: "pending",
  3: "failure",
  4: "success",
};

interface ApiItem {
  id: number;
  finalPrice: number | string | null;

  paymentTypeTitle: string;

  subscriptionStatusId: number;
  subscriptionStatusIdentity?: string;
  subscriptionStatusTitle: string;

  subscriptionTypeId: number;
  subscriptionTypeTitle: string;
  subscriptionTypeMonths: number;

  subscriptionNatureTitle: string;

  createdDatePersian: string;
  deadlineDatePersian?: string;

  description: string | null;

  companyTitle?: string | null;
  userFullName?: string | null;
}

export interface TransactionData {
  id: number;
  finalPrice: number;
  date: string;
  time: string;

  /** از روی subscriptionTypeId ساخته می‌شود */
  status: "success" | "failure" | "pending";

  bank: string;
  bankImage: any;

  title: string;

  paymentTypeTitle: string;

  subscriptionStatusId: number;
  subscriptionStatusIdentity?: string;
  subscriptionStatusTitle: string;

  subscriptionTypeId: number;

  deadlineDatePersian?: string;

  companyTitle?: string | null;
  userFullName?: string | null;
}

const ITEMS_PER_PAGE = 6;

const splitPersianDateTime = (createdDatePersian: string) => {
  if (!createdDatePersian) return { date: "", time: "" };
  const parts = createdDatePersian.split("ساعت");
  if (parts.length === 2) {
    return { date: parts[0].trim(), time: parts[1].trim() };
  }
  return { date: createdDatePersian.trim(), time: "" };
};

const mapStatusFromIdentity = (
  identity?: string,
  title?: string
): "success" | "pending" | "failure" => {
  const id = (identity || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (id === "unpaid" || t.includes("پرداخت نشده")) return "pending";
  if (id === "expired" || t.includes("پایان") || t.includes("منقضی"))
    return "failure";
  if (id === "paid" || t.includes("موفق") || t.includes("فعال"))
    return "success";
  return "failure";
};

const pickBank = (description: string | null) => {
  const desc = (description || "").toLowerCase();
  if (desc.includes("سامان") || desc.includes("saman")) {
    return { bank: "بانک سامان", bankImage: SamanBank };
  }
  return { bank: "بانک ملت", bankImage: MelatBank };
};

const formatPriceFa = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "۰";
  return num.toLocaleString("fa-IR");
};

const isWithdrawn = (title?: string, identity?: string) => {
  const t = (title || "").trim();
  const i = (identity || "").trim().toLowerCase();
  return t.includes("منصرف") || i === "withdrawn";
};

export default function TransactionInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const [invoiceDialog, setInvoiceDialog] = useState<number | null>(null);

  const [openUploadFor, setOpenUploadFor] = useState<number | null>(null);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [item, setItem] = useState<any>(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axiosInstance.get("Subscription/list");
      const data: ApiItem[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      const mapped: TransactionData[] = data.map((item) => {
        const { date, time } = splitPersianDateTime(item.createdDatePersian);
        const { bank, bankImage } = pickBank(item.description);

        return {
          id: item.id,
          finalPrice: Number(item.finalPrice ?? 0),
          date,
          time,
          status: mapStatusFromIdentity(
            item.subscriptionStatusIdentity,
            item.subscriptionStatusTitle
          ),
          bank,
          bankImage,
          title: `خرید اشتراک ${item.subscriptionTypeTitle} - ${item.subscriptionNatureTitle} (${item.subscriptionTypeMonths} ماه)`,
          paymentTypeTitle: item.paymentTypeTitle,
          subscriptionStatusId: item.subscriptionStatusId,
          subscriptionStatusIdentity: item.subscriptionStatusIdentity,
          subscriptionStatusTitle: item.subscriptionStatusTitle,
          subscriptionTypeId: item.subscriptionTypeId,
          deadlineDatePersian: item.deadlineDatePersian,
          companyTitle: item.companyTitle,
          userFullName: item.userFullName,
        };
      });

      setRows(mapped);
    } catch (e: any) {
      setErr("دریافت اطلاعات تراکنش‌ها با خطا مواجه شد.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (page: number) => setCurrentPage(page);

  const filteredData = useMemo(() => {
    if (!searchTerm) return rows;
    const q = searchTerm.trim();
    return rows.filter((item) => item.id.toString().includes(q));
  }, [rows, searchTerm]);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={styles.transactionInfoMainDiv} dir="rtl">
      <div className={styles.rowSpaceBetween}>
        <Typography className="fs-24 fw-500">سوابق اشتراک</Typography>
      </div>

      <TextField
        name="search"
        className="col-12 w-full fs-16 fw-500 mt-2 border rounded-4 customStyleTextField"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" className="mx-1">
              <CiSearch size={22} />
            </InputAdornment>
          ),
          style: { textAlignLast: "right" },
        }}
        placeholder="جستجو بر اساس شناسه درخواست (ID) ..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* جدول رسپانسیو */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ mt: 2, borderRadius: 3, border: "1px solid #eee" }}
      >
        <Table
          size={isMdUp ? "medium" : "small"}
          aria-label="transaction table"
        >
          {/* هِدر — بعضی ستون‌ها فقط در دسکتاپ نمایش داده می‌شوند */}
          <TableHead>
            <TableRow>
              <TableCell>عنوان / وضعیت</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                تاریخ
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                نام شخص / شرکت
              </TableCell>

              <TableCell>مبلغ</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              !err &&
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={5}>
                    <Box className="d-flex align-items-center gap-2">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && err && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography className="mt-2 text-danger fs-14">
                    {err}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && !err && paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography className="py-3 text-center">
                    موردی یافت نشد.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !err &&
              paginatedData.map((item) => {
                const canUpload =
                  (item.paymentTypeTitle?.includes("فیش بانکی") ?? false) &&
                  !isWithdrawn(
                    item.subscriptionStatusTitle,
                    item.subscriptionStatusIdentity
                  ) &&
                  !(
                    item.subscriptionStatusTitle?.includes("پایان") ||
                    item.subscriptionStatusTitle?.includes("منقضی") ||
                    item.subscriptionStatusIdentity?.toLowerCase() === "expired"
                  );
                const displayName = item.companyTitle
                  ? item.companyTitle
                  : item.userFullName;
                return (
                  <TableRow key={item.id} hover>
                    <TableCell align="left">
                      <Box className="d-flex gap-2">
                        <TransactionIcon status={item.status} />
                        <Box>
                          <Typography className="fs-14 fw-500">
                            {item.title}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 0.5 }}
                            useFlexGap
                          >
                            {item.subscriptionStatusTitle && (
                              <Chip
                                size="small"
                                label={item.subscriptionStatusTitle}
                              />
                            )}
                            {item.paymentTypeTitle && (
                              <Chip
                                size="small"
                                variant="outlined"
                                label={item.paymentTypeTitle}
                              />
                            )}
                          </Stack>

                          <Box
                            sx={{ display: { xs: "block", md: "none" }, mt: 1 }}
                          >
                            <Typography className="fs-12">
                              {item.date}
                              {item.time ? ` - ${item.time}` : ""}
                            </Typography>

                            <Typography className="fs-12">
                              {displayName}
                            </Typography>

                            <Typography className="fs-12">
                              مبلغ: {formatPriceFa(item.finalPrice)} تومان
                            </Typography>
                            {item.subscriptionStatusTitle?.includes(
                              "پرداخت نشده"
                            ) && (
                              <Typography className="fs-12">
                                مهلت: {item.deadlineDatePersian || "-"}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Typography className="fs-14">
                        {item.date}
                        {item.time ? ` - ${item.time}` : ""}
                      </Typography>
                      {item.subscriptionStatusTitle?.includes(
                        "پرداخت نشده"
                      ) && (
                        <Typography
                          className="fs-12 labelColor"
                          sx={{ mt: 0.5 }}
                        >
                          مهلت: {item.deadlineDatePersian || "-"}
                        </Typography>
                      )}
                    </TableCell>

             
                    <TableCell
                      align="left"
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Typography className="fs-14">{displayName}</Typography>
                    </TableCell>

                    {/* مبلغ */}
                    <TableCell align="left">
                      <Typography className="fs-14">
                        {formatPriceFa(item.finalPrice)} تومان
                      </Typography>
                    </TableCell>

                    {/* عملیات */}
                    <TableCell align="left">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-start"
                      >
                        <Tooltip title="مشاهده فاکتور">
                          <IconButton
                            aria-label="مشاهده فاکتور"
                            className="goldoutline"
                            size="small"
                            onClick={() => setInvoiceDialog(item.id)}
                          >
                            <ReceiptLongOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        {canUpload && (
                          <Button
                            variant="outlined"
                            color="primary"
                            className="goldoutline"
                            size="small"
                            onClick={() => setOpenUploadFor(item.id)}
                            sx={{
                              borderRadius: "999px",
                              px: 1.5,
                              whiteSpace: "nowrap",
                            }}
                          >
                            آپلود فیش بانکی
                          </Button>
                        )}

                        {item.status === "pending" && (
                          <>
                            <Button
                              onClick={() => {
                                axiosInstance
                                  .get(`/subscription/pay-online/${item.id}`)
                                  .then((res) => {
                                    if (res.data?.success && res.data?.data) {
                                      window.location.href = res.data.data;
                                    } else {
                                      toast.error(
                                        "پرداخت با خطا مواجه شد:",
                                        res.data?.message
                                      );
                                    }
                                  })
                                  .catch((err) =>
                                    toast.error("خطا در درخواست پرداخت")
                                  );
                              }}
                              sx={{
                                borderRadius: 9999,
                                backgroundColor: "#028d20",
                                ":hover": {
                                  backgroundColor: "#028d20",
                                },
                                color: "white",
                              }}
                            >
                              پرداخت
                            </Button>
                            <Button
                              onClick={() => {
                                axiosInstance
                                  .post(`/subscription/withdraw/${item.id}`)
                                  .then((res) => {
                                    if (res.data.success) {
                                      toast.success(res.data.message);
                                      fetchData();
                                    } else {
                                      toast.error(
                                        "عملیات با خطا مواجه شد:",
                                        res.data?.message
                                      );
                                    }
                                  })
                                  .catch((err) =>
                                    toast.error("خطا در درخواست لغو")
                                  );
                              }}
                              sx={{
                                border: "1px solid red",
                                borderRadius: 9999,
                                backgroundColor: "transparent",
                                ":hover": {
                                  backgroundColor: "red",
                                  color: "white",
                                },
                                color: "red",
                              }}
                            >
                              لغو
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center overflow-hidden w-100 flex-column mt-4">
        {!loading && !err && filteredData.length > 0 && (
          <Pagination
            className="mypagination"
            color="secondary"
            dir="rtl"
            count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
            onChange={(_event, value: number) => handleChange(value)}
            page={currentPage}
            siblingCount={0}
            boundaryCount={2}
          />
        )}
      </div>

      <UploadBankReceiptDialog
        open={!!openUploadFor}
        onClose={() => {
          setOpenUploadFor(null);
          fetchData();
        }}
        subscriptionId={openUploadFor || 0}
      />

      <InvoiceDialog
        open={!!invoiceDialog}
        onClose={() => setInvoiceDialog(null)}
        subscriptionId={invoiceDialog}
      />
      {showSuccessModal && (
        <SuccessModal
          open={showSuccessModal}
          item={item}
          onClose={() => setShowSuccessModal(false)}
          message={"پرداخت"}
        />
      )}
    </div>
  );
}
