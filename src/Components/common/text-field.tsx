import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

const RtlTextField: React.FC<TextFieldProps> = (props) => {
  const { InputLabelProps, sx, ...rest } = props;
  return (
    <TextField
      {...rest}

      InputLabelProps={{
        sx: {
          color: "#000000",
          "&.Mui-focused, &.MuiInputLabel-shrink": { color: "#000000" },
          ...(InputLabelProps?.sx || {}),
        },
        ...InputLabelProps,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#ccc" },
          "&:hover fieldset": { borderColor: "#000000" },
          "&.Mui-focused fieldset": { borderColor: "#000000" },
        },
        ...(sx || {}),
      }}
    />
  );
};

export default RtlTextField;
