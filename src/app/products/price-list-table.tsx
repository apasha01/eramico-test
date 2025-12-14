import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PriceChart from "@/Components/Shared/Charts/price-chart";
import { numberWithCommas } from "@/lib/utils";
import LoaderComponent from "@/Components/LoaderComponent";

interface RowProps {
  row: any;
  category: string;
}

function Row({ row, category }: RowProps) {
  const [open, setOpen] = useState(false);

  const detailItem = (label: string, value: string) => {
    return (
      <div className="d-flex flex-column px-4">
        <span>{label}</span>
        <span className="text-center">{value || "-"}</span>
      </div>
    );
  };

  return (
    <>
      <TableRow className="rtl">
        <TableCell align="right" component="th" scope="row">
          {row.supplierCompanyTitle}
        </TableCell>
        <TableCell align="right">
          {numberWithCommas(row.price)} {row.priceUnitPropertyTitle}
        </TableCell>
        <TableCell align="right">{row.priceChange}</TableCell>
        <TableCell align="right">{row.priceBasePropertyTitle || "-"}</TableCell>
        <TableCell align="right">{row.lastModifiedDatePersian}</TableCell>
        <TableCell align="right">{category}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="py-0 px-1 border-0" colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="d-flex justify-content-between py-3">
                <span className="text-end fs-19 fw-bold">
                  نمودار قیمت {row.productTitle} در {row.supplierCompanyTitle}
                </span>
                <div className="d-flex justify-content-start">
                  {detailItem("محل تحویل", row.deliveryLocationPropertyTitle)}
                  {detailItem("نوع معامله", row.dealTypePropertyTitle)}
                  {detailItem("واحد فروش", row.amountUnitPropertyTitle)}
                  {detailItem("واحد قیمت", row.priceUnitPropertyTitle)}
                </div>
              </div>
              <PriceChart
                productId={row.productId}
                supplierId={row.supplierCompanyId}
                producerId={row.producerCompanyId}
                priceType={row.priceTypeId}
                priceUnit={row.priceUnitPropertyTitle}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
const PriceListTable = ({
  priceList,
  category,
  loading,
}: {
  priceList: any;
  category: string;
  loading: boolean;
}) => {
  return (
    <TableContainer component={Paper} className="shadow-none">
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="right">عرضه‌کننده</TableCell>
            <TableCell align="right">قیمت</TableCell>
            <TableCell align="right">تغییرات قیمت</TableCell>
            <TableCell align="right">مبنای قیمت</TableCell>
            <TableCell align="right">تاریخ بروزرسانی</TableCell>
            <TableCell align="right">دسته‌بندی</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <LoaderComponent />
          ) : priceList.length > 0 ? (
            priceList.map((row: any) => (
              <Row key={row.id} row={row} category={category} />
            ))
          ) : (
            <tr>
              <td className="text-center pt-3" colSpan={7}>
                موردی یافت نشد
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceListTable;
