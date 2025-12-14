export interface CompanyUser {
  companyId: number;
  userId: number;
  companyAvatar: string;
  isOwner: boolean;
  positionId?: number | null;
  companyUserTypeId: number;
  isDefault: boolean;
  createdDate: string; // ISO date string
  companyTitle: string;
  companyCode: string;
  shortIntroduction: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  positionTitle: string;
  companyUserTypeTitle: string;
  createdDatePersian: string;
  accessTitles: string;
}
