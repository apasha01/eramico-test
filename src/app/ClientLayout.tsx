"use client";

import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import Navbar from "@/Components/Shared/navbar/navbar";
import BottomNav from "@/Components/BottomNav";
import { RouteProgressProvider } from "@/Components/RouteProgressProvider";
import RouteProgressBar from "@/Components/RouteProgressBar";
import LivePrices from "@/Components/Shared/navbar/live-prices/live-prices";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUserData } from "@/lib/features/user/userSlice";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  // Initialize user data when the app loads if a token exists
  useEffect(() => {
    const token = getToken_Localstorage();
    if (token) {
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  const theme = createTheme({
    direction: "rtl",
    typography: {
      fontFamily: "IRANYekanX",
      body1: {
        fontSize: "0.8rem",
        fontWeight: "bold",
        color: "#212121",
      },
      body2: {
        fontSize: "13px",
        color: "#616161",
      },
      caption: {
        fontSize: "13px",
        color: "#616161",
        textAlign: "justify",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        overflow: "hidden",
        maxHeight: "5em",
        lineHeight: "1.8em",
      },
    },
    components: {
      MuiSvgIcon: {
        variants: [
          {
            props: { color: "primary" },
            style: {
              color: "white",
            },
          },
          {
            props: { color: "secondary" },
            style: {
              color: "#FB8C00",
            },
          },
        ],
      },
      MuiInputLabel: {
        variants: [
          {
            props: { variant: "standard" },
            style: {},
          },
        ],
      },
      MuiTextField: {
        variants: [
          {
            props: { variant: "standard" },
            style: {},
          },
          {
            props: { variant: "outlined" },
            style: {
              borderColor: "#9E9E9E",
              ":focus": {
                borderColor: "#9E9E9E",
              },
              ":hover": {
                borderColor: "#9E9E9E",
              },
            },
          },
        ],
      },
      MuiButton: {
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              borderColor: "#0D47A1",
              color: "#0D47A1",
              borderRadius: "100px",
              ":hover": {
                borderColor: "#0D47A1",
                color: "#0D47A1",
              },
            },
          },
          {
            props: { variant: "text" },
            style: {
              color: "#424242",
              fontSize: "14px",
            },
          },
          {
            props: { variant: "contained" },
            style: {
              color: "white",
              backgroundColor: "#FB8C00",
              borderRadius: "12px",
              height: "48px",
              ":hover": {
                backgroundColor: "#d37807",
              },
            },
          },
        ],
      },
      MuiChip: {
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              borderColor: "#EEEEEE",
            },
          },
        ],
      },
      MuiSelect: {
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              borderRadius: "100px",
              ":focus": {},
            },
          },
        ],
      },
      MuiFormLabel: {
        variants: [
          {
            props: {},
            style: {
              color: "black",
              ":focus": {
                color: "black",
              },
            },
          },
        ],
      },
    },
    palette: {
      background: {
        default: "rgb(226, 226, 226)",
      },
      primary: {
        main: "#ffffff",
      },
      secondary: {
        main: "#212121",
      },
    },
  });

  return (
    //  <CacheProvider value={clientSideEmotionCache}>

    <RouteProgressProvider>
      <RouteProgressBar height={3} />
      <ThemeProvider theme={theme}>
        <header dir="rtl">
        <Navbar />
        <LivePrices />
        </header>
        <div>{children}</div>
        <BottomNav />
      </ThemeProvider>
      <ToastContainer
        position="top-left"
        className="Toaster"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </RouteProgressProvider>
        // </CacheProvider>
  );
}
