export interface CompanyUserInterface {
  companyId: number;
  userId: number;
  isOwner: boolean;
  positionId: number;
  companyUserTypeId: number;
  isDefault: boolean;
  createdDate: string;
  companyTitle: string | null;
  companyCode: string | null;
  companyAvatar: string | null;
  shortIntroduction: string | null;
  userName: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  userVerifyStatus: number;
  userIsVerified: boolean;
  userAvatar: string | null;
  positionTitle: string;
  companyUserTypeTitle: string | null;
  createdDatePersian: string;
  accessTitles: string[] | null;
}
