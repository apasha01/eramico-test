import React from "react";
import { Box, LinearProgress } from "@mui/material";
import Image from "next/image";

const LoaderComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        overflowY: "hidden",
        overflowX: "hidden",
        marginTop: "40px",
        gap: "20px",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/images/logo.svg"
          alt="Eranico Logo"
          width={115}
          
          height={46}
          priority
        />
      </Box>

      {/* Loading Bar */}
      <Box
        sx={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LinearProgress
          sx={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#fb8c00",
              borderRadius: "3px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoaderComponent;
