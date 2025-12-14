"use client";

// NOTE: This component must be client-side only because the underlying library
// touches browser globals (window / document) which caused hydration errors when
// pre-rendered on the server. Also removed Math.random-based ids that created
// server/client markup mismatches inside Suspense boundaries.

import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import type { CalendarProps } from "react-multi-date-picker";
import dynamic from "next/dynamic";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import moment from "jalali-moment";
import { InputLabel } from "@mui/material";
import React, { forwardRef, useId, useMemo } from "react";

// Dynamic import to fully disable SSR for the picker component
const PersianDatePicker: any = dynamic(
  () => import("react-multi-date-picker"),
  { ssr: false }
);

interface DatePickerProps {
  value?: moment.MomentInput;
  onChange?: (date: string) => void;
  minDate?: CalendarProps["minDate"];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  hasError?: boolean;
  required?: boolean;
  wrapperClassName?: string;
  name?: string;
  id?: string;
}

const DatePicker = forwardRef<any, DatePickerProps>(
  (
    {
      value,
      onChange,
      minDate,
      disabled = false,
      className = "",
      placeholder = "",
      label,
      hasError,
      required,
      wrapperClassName = "",
      name,
      id,
    },
    ref
  ) => {
    const reactId = useId();
    // Stable deterministic ids so server & client markup align
    const computedName = name || `datepicker_${reactId}`;
    const computedId = id || `datepicker_${reactId}`;

    // Memoize numeric value to avoid unnecessary re-renders
    const pickerValue = useMemo(
      () => (value ? moment(value).valueOf() : undefined),
      [value]
    );

    return (
      <div className={`rtl w-full ${wrapperClassName || ""}`}>
        {label && label.length > 0 && (
          <InputLabel
            className="fs-14 mb-2 fw-400"
            style={{ color: "#9E9E9E99" }}
          >
            {label}
            {required && <span className="red pe-2">(ضروری)</span>}
          </InputLabel>
        )}
        <PersianDatePicker
          // @ts-ignore library internal typing for ref
          ref={ref}
          calendar={persian}
          buttons={true}
          hideOnScroll={true}
          calendarPosition="bottom-right"
          containerClassName={`w-100 d-flex align-items-center input-border ${
            hasError ? " input-error" : ""
          }`}
          disabled={disabled}
          editable={true}
          format="YYYY/MM/DD"
          inputClass={`border-none date-input w-100 ${className}`}
          locale={persianFa}
          minDate={minDate}
          onChange={(date) => {
            if (!date) {
              onChange?.("");
              return;
            }
            const formattedDate = moment((date as any).toDate()).format(
              "YYYY-MM-DD"
            );
            onChange?.(formattedDate);
          }}
          onOpenPickNewDate={false}
          placeholder={placeholder}
          plugins={[weekends()]}
          scrollSensitive
          value={pickerValue}
          name={computedName}
          id={computedId}
        />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
