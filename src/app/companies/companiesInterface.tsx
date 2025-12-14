export interface Company {
  id: number;
  title: string;
  companyTypeId: number;
  nationalCode: string;
  email: string | null;
  province: string | null;
  city: string | null;
  address: string;
  zipCode: string;
  telephone: string;
  cellphone: string | null;
  fax: string | null;
  webpage: string | null;
  avatarId: number | null;
  isDisabled: boolean;
  isAccepted: boolean;
  shortIntroduction: string;
  introduction: string;
  verifyStatus: number;
  verifyExpirationDate: Date | null;
  insuranceStatus: number;
  createdDate: Date;
  lastModifiedDate: Date;
  cultureId: number | null;
  avatar: any | null;
  companyTypeTitle: string;
  createdDatePersian: string;
  lastModifiedDatePersian: string;
  isMine: boolean;
}

export interface ApiResponse {
  data: Company[];
}
