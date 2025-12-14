import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAppSelector } from "@/lib/hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const paymentGateways = [
  { id: "zarinpal", name: "زرین‌پال", logo: "/images/zarinpal.svg" },
  // { id: "shaparak", name: "شاپرک", logo: "/images/shaparak.jpeg" },
  // { id: "payping", name: "پی‌پینگ", logo: "/images/payping.png" },
];

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  item:any;
  message?: string | null;
  onPaymentSelect?: (method: string) => void;
  onPayLater?: () => void;
}

const SuccessModal = ({
  open,
  onClose,
  message,
  item,
  onPaymentSelect,
  onPayLater,
}: SuccessModalProps) => {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const path = usePathname();
  const [payment_id,setPaymentId] = useState<number | null>(null);
  const {userId} = useAppSelector((state) => state.user);
  const handlePaymentSelect = () => {
    




    if (selectedGateway) {
      onPaymentSelect?.(selectedGateway);
      axiosInstance
        .get("/subscription/get-unpaid/")
        .then((res) => {
          if(res.data.success){
           setPaymentId(res.data.data.id)
          }
        })
        .catch((err) => console.error(err));
       
    }
  };


  useEffect(()=>{
     if(payment_id){
          axiosInstance.get("/subscription/pay-online/"+payment_id).then((res) => {
            if(res.data.success){
              window.location.href = res.data.data
            }
          }).catch((err) => console.error(err));
        }
  },[payment_id])


  const handlePayLater = () => {
    onPayLater?.();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText id="alert-dialog-description">
          <Typography
            dangerouslySetInnerHTML={{
              __html:
                message ||
                "درخواست اشتراک با موفقیت ثبت شد. لطفاً روش پرداخت خود را انتخاب کنید یا بعداً پرداخت نمایید.",
            }}
          />
        </DialogContentText>

        {/* نمایش آیکون‌های درگاه پرداخت */}
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          mt={3}
          flexWrap="wrap"
        >
          {paymentGateways.map((gateway) => (
            <Tooltip key={gateway.id} title={gateway.name}>
              <IconButton
                onClick={() => setSelectedGateway(gateway.id)}
                sx={{
                  border:
                    selectedGateway === gateway.id
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  borderRadius: 3,
                  p: 1.5,
                  transition: "0.2s",
                  backgroundColor:
                    selectedGateway === gateway.id ? "#e3f2fd" : "white",
                }}
              >
                <Image
                  src={gateway.logo}
                  alt={gateway.name}
                  width={55}
                  loading="lazy"
                  height={55}
                  style={{ objectFit: "contain" }}
                />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pb: 3,
        }}
      >
        <Button
          onClick={handlePaymentSelect}
          color="primary"
          variant="contained"
          fullWidth
          sx={{
            borderRadius:9999
          }}
          disabled={!selectedGateway}
        >
          پرداخت با{" "}
          {selectedGateway
            ? paymentGateways.find((g) => g.id === selectedGateway)?.name
            : "درگاه انتخابی"}
        </Button>

        <Button
          onClick={handlePayLater}
          color="secondary"
          variant="outlined"
          fullWidth
        >
          بعداً پرداخت می‌کنم
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
