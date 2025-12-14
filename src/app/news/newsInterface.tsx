export interface NewsMedia {
  id: number;
  entityTypeId: number;
  entityId: number;
  mediaId: number;
  mediaModeId: number;
  note: string | null;
  orderNo: number;
  createdDate: string;
  entityTypeTitle: string | null;
  mediaTitle: string | null;
  mediaModeTitle: string | null;
  mediaSourceFileName: string;
  mediaTypeId: number;
  mediaTypeTitle: string | null;
  entityTypeIdentity: string;
  mediaModeIdentity: string;
  mediaTypeIdentity: string;
  createdDatePersian: string;
  timePast: string | null;
  visitCount: number;
  isMine: boolean;
}

export interface NewsTag {
  tagId: number;
  tagTitle: string;
  entityId: number;
  entityTypeId: number;
}

export interface NewsCreator {
  contentId: number;
  userId: number;
  action: string;
  fullName: string;
  userName: string;
  email: string;
  userAvatar: string;
  userIsverified: boolean;
}

export interface NewsCategory {
  id: number;
  title: string;
  parentId: number;
  entityId: number;
  entityTypeId: number;
  code: string;
  iconId: number | null;
  categoryTypeId: number | null;
  categoryObjectTypeId: number | null;
  hasPrice: boolean;
  description: string | null;
  orderNo: number;
  isDisabled: boolean;
  cultureId: string | null;
}

export interface NewsArticle {
  id: number;
  entityTypeId: number;
  userId: number | null;
  companyId: number | null;
  contentTypeId: number;
  upperTitle: string | null;
  bottomTitle: string | null;
  title: string;
  lead: string;
  body: string;
  soustitre: string | null;
  abstract: string | null;
  note: string | null;
  hasGuestCreator: boolean;
  guestCreatorAction: string | null;
  guestCreatorName: string | null;
  version: number;
  isPublished: boolean;
  cultureId: number | null;
  entityTypeIdentity: string;
  contentTypeTitle: string;
  categories: NewsCategory[];
  categoryIds: number[];
  tags: NewsTag[];
  tagIds: number[];
  isLiked: boolean;
  nature: string;
  source: string;
  sourceURL: string;
  publishDate: string;
  createdDate: string;
  lastModifiedDate: string;
  publishDatePersian: string;
  createdDatePersian: string;
  lastModifiedDatePersian: string;
  image: string;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  visitCount: number;
  medias: NewsMedia[];
  creators: NewsCreator[];
  titleImageTitle: string | null;
  titleImagePath: string | null;
  timePast: string | null;
}
