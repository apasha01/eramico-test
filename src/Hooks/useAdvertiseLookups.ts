"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { LookupInterface } from "@/Helpers/LookupInterface";
import {
  ADVERTISE_MODE_LOOKUP,
  PRODUCT_GRADE_LOOKUP,
  PRODUCT_TYPE_LOOKUP,
  PROPERTY_LOOKUP_COUNTRY,
  PROPERTY_LOOKUP_DEAL_TYPE,
  PROPERTY_LOOKUP_DELIVERY,
  PROPERTY_LOOKUP_MONEY_UNIT,
  PROPERTY_LOOKUP_PACKING,
  PROPERTY_LOOKUP_PRICE_BASE,
  PROPERTY_LOOKUP_UNIT,
  SUBMIT_ADVERTISE_COMPANIES,
} from "@/lib/urls";
import { AxiosResponse } from "axios";

export type AdvertiseLookupOptions = {
  ProductTypeId: LookupInterface[];
  ProducerCountryPropertyId: LookupInterface[];
  DealTypePropertyId: LookupInterface[];
  PackingTypePropertyId: LookupInterface[];
  DeliveryLocationPropertyId: LookupInterface[];
  PriceBasePropertyId: LookupInterface[];
  ProductGradeId: LookupInterface[];
  AmountUnitPropertyId: LookupInterface[];
  PriceUnitPropertyId: LookupInterface[];
  AdvertiseModeId: LookupInterface[];
  CompanyId: LookupInterface[];
};

const emptyOptions: AdvertiseLookupOptions = {
  ProductTypeId: [],
  ProducerCountryPropertyId: [],
  DealTypePropertyId: [],
  PackingTypePropertyId: [],
  DeliveryLocationPropertyId: [],
  PriceBasePropertyId: [],
  ProductGradeId: [],
  AmountUnitPropertyId: [],
  PriceUnitPropertyId: [],
  AdvertiseModeId: [],
  CompanyId: [],
};

let cachedOptions: AdvertiseLookupOptions | null = null;
let pendingPromise: Promise<AdvertiseLookupOptions> | null = null;
let hasError = false;

type AxiosLookup = AxiosResponse<IAPIResult<LookupInterface[]>>;
type SettledLookup = PromiseSettledResult<AxiosLookup>;

const fetchLookups = async (): Promise<AdvertiseLookupOptions> => {
  const results = (await Promise.allSettled([
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PRODUCT_TYPE_LOOKUP),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_COUNTRY),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_DEAL_TYPE),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_PACKING),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_DELIVERY),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_PRICE_BASE),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PRODUCT_GRADE_LOOKUP),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_UNIT),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(PROPERTY_LOOKUP_MONEY_UNIT),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(ADVERTISE_MODE_LOOKUP),
    axiosInstance.get<IAPIResult<LookupInterface[]>>(SUBMIT_ADVERTISE_COMPANIES),
  ])) as SettledLookup[];

  const getData = (r: SettledLookup): LookupInterface[] => {
    if (r.status !== "fulfilled") return [];
    const payload = r.value.data;
    if (!payload || !payload.success || !Array.isArray(payload.data)) return [];
    return payload.data;
  };

  return {
    ProductTypeId: getData(results[0]),
    ProducerCountryPropertyId: getData(results[1]),
    DealTypePropertyId: getData(results[2]),
    PackingTypePropertyId: getData(results[3]),
    DeliveryLocationPropertyId: getData(results[4]),
    PriceBasePropertyId: getData(results[5]),
    ProductGradeId: getData(results[6]),
    AmountUnitPropertyId: getData(results[7]),
    PriceUnitPropertyId: getData(results[8]),
    AdvertiseModeId: getData(results[9]),
    CompanyId: getData(results[10]),
  };
};

export const useAdvertiseLookups = () => {
  const [options, setOptions] = useState<AdvertiseLookupOptions>(
    cachedOptions ?? emptyOptions
  );
  const [loading, setLoading] = useState(!cachedOptions && !hasError);

  useEffect(() => {
    if (cachedOptions || hasError) return;

    if (!pendingPromise) {
      pendingPromise = fetchLookups()
        .then((opts) => {
          cachedOptions = opts;
          return opts;
        })
        .catch(() => {
          hasError = true;
          cachedOptions = emptyOptions;
          return emptyOptions;
        });
    }

    pendingPromise.then((opts) => {
      setOptions(opts);
      setLoading(false);
    });
  }, []);

  return { options, loading };
};
