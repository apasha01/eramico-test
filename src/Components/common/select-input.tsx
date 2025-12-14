import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

interface SelectInputProp {
  id: string;
  control: any;
  options: any[];
  label?: string;
  placeholder?: string;
  sm?: number;
  hasError?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  required?: boolean;
}

const SelectInput = ({
  id,
  control,
  options,
  label,
  placeholder,
  hasError,
  disabled,
  sm = 6,
  defaultValue,
  required = false,
}: SelectInputProp) => {
  return (
    <Grid item xs={12} sm={sm}>
      <Controller
        key={id}
        name={id}
        control={control}
        render={({ field }) => (
          <>
            <InputLabel
              className="fs-14 mb-2 fw-400"
              style={{ color: "#9E9E9E99" }}
            >
              {label}
              {required && <span className="red pe-2">(ضروری)</span>}
            </InputLabel>
            <FormControl fullWidth>
              <Select
                dir="rtl"
                className={`input-border ${hasError ? "input-error" : ""}`}
                {...field}
                value={field.value === 0 ? "" : field.value}
                renderValue={(selected) => {
                  if (selected === 0 || selected === "") {
                    return <>{defaultValue || placeholder}</>;
                  }
                  const selectedItem = options?.find(
                    (item) => item.id === selected
                  );
                  return selectedItem ? selectedItem.title : "";
                }}
                disabled={disabled}
                inputProps={{ "aria-label": placeholder }}
                displayEmpty
                endAdornment={
                  !required && field.value && !disabled ? (
                    <IconButton
                      sx={{
                        position: "absolute",
                        right: 5,
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "4px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange("");
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
                sx={{
                  "& .MuiInputBase-input": {
                    fontWeight: "normal",
                    paddingRight: "12px !important",
                  },
                  "& .MuiSelect-icon": {
                    right: !required && field.value ? "24px" : "8px",
                    left: "auto",
                  },
                }}
              >
                <MenuItem className="me-2" value="" disabled>
                  {placeholder}
                </MenuItem>
                {options?.length !== 0 ? (
                  options?.map((item: any) => (
                    <MenuItem className="me-2" key={item.id} value={item.id}>
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
    </Grid>
  );
};

export default SelectInput;
