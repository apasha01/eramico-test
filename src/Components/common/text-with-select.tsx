import { convertNumbersToEnglish } from "@/lib/utils";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

interface TextWithSelectProp {
  name: string;
  id: string;
  control: any;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  type?: string;
  hasError?: boolean;
  xs?: number;
  sm?: number;
  disabled?: boolean;
  options?: any;
  defaultSelectValue?: any;
}

const TextWithSelect = ({
  name,
  id,
  control,
  placeholder,
  label,
  multiline,
  type = "number",
  hasError,
  xs = 12,
  sm = 6,
  disabled,
  options,
  defaultSelectValue,
}: TextWithSelectProp) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (value: string) => {
    if (type === "number") {
      const englishValue = convertNumbersToEnglish(value);
      return englishValue.replace(/[^0-9]/g, "");
    }
    return value;
  };

  return (
    <Grid item xs={xs} sm={sm}>
      <InputLabel className="fs-14 mb-2 fw-400" style={{ color: "#9E9E9E99" }}>
        {label}
      </InputLabel>
      <div className={`d-flex input-border ${hasError ? "input-error" : ""}`}>
        <div
          style={{
            flex: "0 0 70%",
            paddingRight: "8px",
          }}
        >
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  variant="outlined"
                  onChange={(e) =>
                    field.onChange(handleInputChange(e.target.value))
                  }
                  multiline={multiline}
                  rows={4}
                  disabled={disabled}
                  placeholder={placeholder}
                  InputProps={
                    type === "password"
                      ? {
                          endAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="start"
                              >
                                {showPassword ? (
                                  <VisibilityOutlinedIcon />
                                ) : (
                                  <VisibilityOffOutlinedIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : undefined
                  }
                  fullWidth
                  type={
                    type !== "password"
                      ? type
                      : showPassword
                      ? "text"
                      : "password"
                  }
                  inputProps={
                    type === "number" ? { inputMode: "numeric" } : undefined
                  }
                />
              </>
            )}
          />
        </div>
        <div
          style={{
            flex: "0 0 30%",
            borderRight: "1px solid #ccc",
            paddingRight: "8px",
          }}
        >
          <Controller
            key={`${id}-${defaultSelectValue ?? ""}`}
            name={id}
            control={control}
            defaultValue={defaultSelectValue ?? ""}
            render={({ field }) => (
              <>
                <FormControl fullWidth>
                  <Select
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? field.value
                        : defaultSelectValue ?? ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value as any;
                      const parsed = raw === "" ? "" : Number(raw);
                      field.onChange(parsed);
                    }}
                    renderValue={(selected) => {
                      if (
                        selected === "" ||
                        selected === null ||
                        selected === undefined
                      ) {
                        return <>{placeholder}</>;
                      }
                      const normalized =
                        typeof selected === "string" ? Number(selected) : selected;
                      const selectedItem = options?.find(
                        (item: any) => item.id === normalized
                      );
                      return selectedItem ? selectedItem.title : "";
                    }}
                    disabled={disabled}
                    inputProps={{ "aria-label": placeholder }}
                    displayEmpty
                    sx={{
                      "& .MuiInputBase-input": {
                        color: field.value ? "black" : "#b0b0b0",
                        fontWeight: "normal",
                        paddingRight: "12px !important",
                      },

                      "& .MuiSelect-icon": {
                        color: field.value ? "black" : "#b0b0b0",
                        right: "8px",
                        left: "auto",
                      },
                    }}
                  >
                    <MenuItem className="me-2" value="" disabled>
                      {placeholder}
                    </MenuItem>
                    {options?.length !== 0 ? (
                      options?.map((item: any) => (
                        <MenuItem
                          className="me-2"
                          key={item.id}
                          value={item.id}
                        >
                          {item.title}
                        </MenuItem>
                      ))
                    ) : (
                      <span className="d-block w-100 text-center">
                        موردی یافت نشد
                      </span>
                    )}
                  </Select>
                </FormControl>
              </>
            )}
          />
        </div>
      </div>
    </Grid>
  );
};

export default TextWithSelect;
