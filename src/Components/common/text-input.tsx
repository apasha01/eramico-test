import { convertNumbersToEnglish } from "@/lib/utils";
import {
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Controller } from "react-hook-form";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

interface TextInputProp {
  name: string;
  control: any;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  type?: string;
  hasError?: boolean;
  xs?: number;
  sm?: number;
  disabled?: boolean;
  children?: any;
  adornment?: ReactNode;
  required?: boolean; 
  helperText?: string;
}

const TextInput = ({
  name,
  control,
  placeholder,
  label,
  multiline,
  type = "number",
  hasError,
  xs = 12,
  sm = 6,
  disabled,
  children,
  adornment,
  required = false, 
  helperText,
}: TextInputProp) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (value: string) => {
    if (type === "number") {
      const englishValue = convertNumbersToEnglish(value);
      return englishValue.replace(/[^0-9]/g, "");
    }
    return value;
  };

  const effectiveType = type === "number" ? "text" : type;

  return (
    <Grid item xs={xs} sm={sm}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <InputLabel
              className="fs-14 mb-2 fw-400"
              style={{ color: "#9E9E9E99" }}
            >
              {label}
            </InputLabel>
            <TextField
              {...field}
              className={`${multiline ? "area-border" : "input-border"} ${
                hasError ? "input-error" : ""
              }`}
              placeholder={placeholder}
              variant="outlined"
              onChange={(e) =>
                field.onChange(handleInputChange(e.target.value))
              }
              multiline={multiline}
              rows={4}
              disabled={disabled}
              InputProps={{
                startAdornment: required ? (
                  <InputAdornment position="start">
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </InputAdornment>
                ) : undefined,
                endAdornment:
                  type === "password" ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    adornment || null
                  ),
              }}
              fullWidth
              type={effectiveType}
              inputProps={{
                inputMode: type === "number" ? "numeric" : undefined,
                style: { textAlign: "right", textAlignLast: "right" },
              }}
              sx={{
                "& .MuiOutlinedInput-input": {
                  direction: "rtl",
                  textAlign: "right",
                },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            
            />
          </>
        
        )}
      />
      <span style={{fontSize:'12px' , color:'#9E9E9E99'}}>{helperText}</span>
      {children}
    </Grid>
  );
};

export default TextInput;