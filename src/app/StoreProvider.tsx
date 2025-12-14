"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { CacheProvider } from "@emotion/react";
import cacheRtl from "@/Helpers/rtlCache";
import { ThemeProvider, createTheme } from "@mui/material/styles";



const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "IRANSans, Roboto, Arial",
  },
});
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>
        <CacheProvider value={cacheRtl}>
       <ThemeProvider theme={theme}>

    
    {children}
       </ThemeProvider>
    </CacheProvider>
    
    </Provider>;
}
