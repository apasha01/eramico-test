"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { PRODUCT_LOOKUP } from "@/lib/urls";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface ProductOption {
  id: string | number;
  title: string;
}

interface MultiOnlineSearchProps {
  name: string;
  placeholder: string;
  label: string;
  control: any;
  sm?: number;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultiOnlineSearch = ({
  name,
  placeholder,
  label,
  control,
  sm = 6,
}: MultiOnlineSearchProps) => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);

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
      setData(list);
    } catch (e: any) {
      if (!mountedRef.current) return;
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      console.error("Error fetching data:", e);
      setData([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const term = searchText.trim();
      if (!term) {
        setData([]);
        return;
      }
      fetchData(term);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

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
            </InputLabel>

            <Autocomplete
              multiple
              disablePortal
              options={data}
              disableCloseOnSelect
              filterOptions={(x) => x}
              getOptionLabel={(option) => option?.title || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={(_, value) => {
                field.onChange(value.map((item) => item.id));
              }}
              className="multi-input-border"
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  display: "none !important",
                },
                "& .MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              }}
              noOptionsText="موردی یافت نشد"
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props as any;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginLeft: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={field.value?.length ? undefined : placeholder}
                  variant="outlined"
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: field.value?.length ? null : (
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

export default MultiOnlineSearch;
