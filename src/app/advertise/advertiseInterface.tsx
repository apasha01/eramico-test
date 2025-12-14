export interface Advertise {
  id: number;
  userId: number;
  companyId: number;
  productId: number;
  advertiseTypeId: number;
  advertiseStatusId: number;
  advertiseModeId: number;
  dealTypePropertyId: number;
  amount: number;
  amountUnitPropertyId: number;
  priority: any;
  price: number;
  priceUnitPropertyId: number;
  priceBasePropertyId: any;
  minAmount: any;
  maxAmount: any;
  basedPriceLocationPropertyId: any;
  packingTypePropertyId: any;
  producer: string;
  producerCountryPropertyId: number;
  deliveryCost: any;
  deliveryDate: any;
  deliveryLocationPropertyId: any;
  technicalInfo: string;
  description: string;
  expirationDate: any;
  createdDate: any;
  lastModifiedDate: string; // It's represented as string for now, you may change it to Date type if needed
  cultureId: string;
  visitCount: number;
  deliveryDatePersian: string;
  expirationDatePersian: string;
  lastModifiedDatePersian: string;
  userName: string;
  userFullName: string;
  userAvatar: any;
  companyTitle: string;
  companyAvatar: any;
  productTitle: string;
  productEngTitle: string;
  productAvatar: any;
  advertiseTypeTitle: string;
  advertiseTypeIdentity: string;
  advertiseStatusTitle: string;
  advertiseModeTitle: string;
  dealTypePropertyTitle: string;
  amountUnitPropertyTitle: string;
  priceUnitPropertyTitle: string;
  priceBasePropertyTitle: any;
  basedPriceLocationPropertyTitle: any;
  packingTypePropertyTitle: any;
  producerCountryPropertyTitle: string;
  deliveryLocationPropertyTitle: any;
}

export interface ApiResponse {
  data: Advertise[];
}

export interface AdvertiseDetail {
  id: number;
  userId: number;
  companyId: number;
  productId: number;
  productTypeId?: number;
  productGradeId?: number;
  advertiseTypeId: number;
  advertiseStatusId: number;
  advertiseModeId: number;
  dealTypePropertyId: number;
  amount: number;
  amountUnitPropertyId: number;
  priority?: any;
  price: number;
  priceUnitPropertyId: number;
  priceBasePropertyId?: any;
  minAmount?: any;
  maxAmount?: any;
  basedPriceLocationPropertyId?: any;
  packingTypePropertyId?: any;
  producer: string;
  producerCountryPropertyId?: number;
  deliveryCost?: any;
  deliveryDate?: any;
  deliveryLocationPropertyId?: any;
  technicalInfo?: any;
  description: string;
  expirationDate?: any;
  createdDate?: any;
  lastModifiedDate: string;
  cultureId: string;
  visitCount: number;
  hasUnread: boolean;
  deliveryDatePersian: string;
  deliveryPeriod: string;
  expirationDatePersian: string;
  lastModifiedDatePersian: string;
  userName: string;
  userFullName: string;
  userAvatar?: any;
  userVerifyStatus: number;
  userIsVerified: boolean;
  userIsChosen: boolean;
  userIsSubscribed: boolean;
  userProvince?: string;
  userCity?: string;
  userEmail?: string;
  userTelephone?: string;
  userCellphone?: string;
  contactNumber ?: string;
  companyTitle: string;
  companyCode?: string;
  companyAvatar?: any;
  companyProvince?: string;
  companyCity?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyTelephone?: string;
  companyCellphone?: string;
  companyIsChosen: boolean;
  companyVerifyStatus: number;
  companyIsVerified: boolean;
  companyInsuranceStatus: number;
  companyIsSafe: boolean;
  companyIsSubscribed: boolean;
  userPositionTitle?: string;
  subscriptionAvatar?: string | null;
  productTitle: string;
  productAvatar?: string;
  productCode: string;
  productEngTitle: string;
  productAbbr: string;
  productTypeTitle: string;
  productGradeTitle: string;
  advertiseTypeTitle: string;
  advertiseTypeIdentity: string;
  advertiseStatusTitle: string;
  advertiseModeTitle: string;
  isSpecialOffer:boolean,
  isPinSeller:boolean,
  dealTypePropertyTitle: string;
  amountUnitPropertyTitle: string;
  priceUnitPropertyTitle: string;
  priceBasePropertyTitle?: string;
  basedPriceLocationPropertyTitle?: string;
  packingTypePropertyTitle?: string;
  producerCountryPropertyTitle: string;
  deliveryLocationPropertyTitle?: string;
  chart?: ChartData;
  expirationRemained?: string;
  isMine?: boolean;
}

export interface ChartData {
  dateFrom: string;
  dateTo: string;
  data: ChartDataItem[];
}

export interface ChartDataItem {
  datePersian: string;
  visit: number;
  click: number;
}
