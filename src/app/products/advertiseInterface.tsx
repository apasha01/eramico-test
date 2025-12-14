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
  priority: any; // You may specify the actual type for priority if it's known
  price: number;
  priceUnitPropertyId: number;
  priceBasePropertyId: any; // You may specify the actual type for priceBasePropertyId if it's known
  minAmount: any; // You may specify the actual type for minAmount if it's known
  maxAmount: any; // You may specify the actual type for maxAmount if it's known
  basedPriceLocationPropertyId: any; // You may specify the actual type for basedPriceLocationPropertyId if it's known
  packingTypePropertyId: any; // You may specify the actual type for packingTypePropertyId if it's known
  producer: string;
  producerCountryPropertyId: number;
  deliveryCost: any; // You may specify the actual type for deliveryCost if it's known
  deliveryDate: any; // You may specify the actual type for deliveryDate if it's known
  deliveryLocationPropertyId: any; // You may specify the actual type for deliveryLocationPropertyId if it's known
  technicalInfo: string;
  description: string;
  expirationDate: any; // You may specify the actual type for expirationDate if it's known
  createdDate: any; // You may specify the actual type for createdDate if it's known
  lastModifiedDate: string; // It's represented as string for now, you may change it to Date type if needed
  cultureId: string;
  visitCount: number;
  deliveryDatePersian: string;
  expirationDatePersian: string;
  lastModifiedDatePersian: string;
  userName: string;
  userFullName: string;
  userAvatar: any; // You may specify the actual type for userAvatar if it's known
  companyTitle: string;
  companyAvatar: any; // You may specify the actual type for companyAvatar if it's known
  productTitle: string;
  productAvatar: any; // You may specify the actual type for productAvatar if it's known
  advertiseTypeTitle: string;
  advertiseTypeIdentity: string;
  advertiseStatusTitle: string;
  advertiseModeTitle: string;
  dealTypePropertyTitle: string;
  amountUnitPropertyTitle: string;
  priceUnitPropertyTitle: string;
  priceBasePropertyTitle: any; // You may specify the actual type for priceBasePropertyTitle if it's known
  basedPriceLocationPropertyTitle: any; // You may specify the actual type for basedPriceLocationPropertyTitle if it's known
  packingTypePropertyTitle: any; // You may specify the actual type for packingTypePropertyTitle if it's known
  producerCountryPropertyTitle: string;
  deliveryLocationPropertyTitle: any; // You may specify the actual type for deliveryLocationPropertyTitle if it's known
}

export interface ApiResponse {
  data: Advertise[];
}

export interface AdvertiseDetail {
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
  priority?: any; // The type of this property is not clear from the provided data
  price: number;
  priceUnitPropertyId: number;
  priceBasePropertyId?: any; // The type of this property is not clear from the provided data
  minAmount?: any; // The type of this property is not clear from the provided data
  maxAmount?: any; // The type of this property is not clear from the provided data
  basedPriceLocationPropertyId?: any; // The type of this property is not clear from the provided data
  packingTypePropertyId?: any; // The type of this property is not clear from the provided data
  producer: string;
  producerCountryPropertyId: number;
  deliveryCost?: any; // The type of this property is not clear from the provided data
  deliveryDate?: any; // The type of this property is not clear from the provided data
  deliveryLocationPropertyId?: any; // The type of this property is not clear from the provided data
  technicalInfo?: any; // The type of this property is not clear from the provided data
  description: string;
  expirationDate?: any; // The type of this property is not clear from the provided data
  createdDate?: any; // The type of this property is not clear from the provided data
  lastModifiedDate: string;
  cultureId: string;
  visitCount: number;
  deliveryDatePersian: string;
  expirationDatePersian: string;
  lastModifiedDatePersian: string;
  userName: string;
  userFullName: string;
  userAvatar?: any; // The type of this property is not clear from the provided data
  companyTitle: string;
  companyAvatar?: any; // The type of this property is not clear from the provided data
  productTitle: string;
  productAvatar?: any; // The type of this property is not clear from the provided data
  advertiseTypeTitle: string;
  advertiseTypeIdentity: string;
  advertiseStatusTitle: string;
  advertiseModeTitle: string;
  dealTypePropertyTitle: string;
  amountUnitPropertyTitle: string;
  priceUnitPropertyTitle: string;
  priceBasePropertyTitle?: any; // The type of this property is not clear from the provided data
  basedPriceLocationPropertyTitle?: any; // The type of this property is not clear from the provided data
  packingTypePropertyTitle?: any; // The type of this property is not clear from the provided data
  producerCountryPropertyTitle: string;
  deliveryLocationPropertyTitle?: any; // The type of this property is not clear from the provided data
}
