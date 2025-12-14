"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { PRODUCT_LOOKUP } from "@/lib/urls";
import {
  Autocomplete,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";

interface ProductOption {
  id: string | number;
  title: string;
}

interface OnlineSearchProps {
  name: string;
  placeholder: string;
  label: string;
  control: any;
  hasError: boolean;
  required?: boolean;
  defaultValue?: any;
  defaultTitle?: string;
  sm?: number;
}

const OnlineSearch = ({
  name,
  placeholder,
  label,
  control,
  hasError,
  required,
  defaultValue,
  defaultTitle,
  sm = 6,
}: OnlineSearchProps) => {
  const defaultItemRef = useRef<ProductOption | null>(
    defaultValue != null && defaultTitle
      ? { id: defaultValue, title: defaultTitle }
      : null
  );

  const [searchText, setSearchText] = useState<string>(
    defaultItemRef.current?.title ?? ""
  );

  const [data, setData] = useState<ProductOption[]>(
    defaultItemRef.current ? [defaultItemRef.current] : []
  );

  const [loading, setLoading] = useState(false);

  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(
    defaultItemRef.current
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const resetToDefault = () => {
    const d = defaultItemRef.current ? [defaultItemRef.current] : [];
    setData(d);
  };

  const fetchData = async (text: string) => {
    if (!mountedRef.current) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await axiosInstance.get<any>(
        `${PRODUCT_LOOKUP}?text=${encodeURIComponent(text)}`,
        { signal: controller.signal }
      );

      if (!mountedRef.current) return;

      const list: ProductOption[] = res?.data?.data || [];
      if (list.length) {
        setData(list);
      } else {
        resetToDefault();
      }
    } catch (e: any) {
      if (!mountedRef.current) return;
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      console.error("Error fetching data:", e);
      resetToDefault();
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const term = searchText.trim();

      if (!term) {
        resetToDefault();
        return;
      }

      if (term === (selectedOption?.title ?? "")) {
        if (selectedOption) setData([selectedOption]);
        else resetToDefault();
        return;
      }

      defaultItemRef.current = null;
      fetchData(term);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, selectedOption]);

  return (
    <Grid item xs={12} sm={sm}>
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
              {required && <span className="red pe-2">(ضروری)</span>}
            </InputLabel>

            <Autocomplete
              dir="rtl"
              options={data}
              value={selectedOption}
              inputValue={searchText}
              onInputChange={(_, newValue, reason) => {
                if (reason === "reset") return;
                setSearchText(newValue ?? "");
              }}
              onChange={(_, newValue: ProductOption | null) => {
                setSelectedOption(newValue);
                field.onChange(newValue?.id ?? null);

                if (newValue) {
                  setSearchText(newValue.title);
                  setData([newValue]);
                } else {
                  setSearchText("");
                  resetToDefault();
                }
              }}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              getOptionLabel={(option) => option?.title || ""}
              filterOptions={(x) => x}
              className={`input-border ${hasError ? " input-error" : ""}`}
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  display: "none !important",
                },
                "& .MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              }}
              noOptionsText="موردی یافت نشد"
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  variant="outlined"
                  dir="rtl"
                  error={hasError}
                  InputProps={{
                    ...params.InputProps,
                    dir: "rtl",
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SearchIcon style={{ color: "#b0b0b0" }} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </>
        )}
      />
    </Grid>
  );
};

export default OnlineSearch;
