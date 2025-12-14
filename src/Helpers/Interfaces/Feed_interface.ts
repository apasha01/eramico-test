export interface Data {
  id: number;
  entityTypeId: number;
  entityId?: number;
  targetUserId?: number;
  weight?: number;
  createdDate?: string;
  post?: Post;
  advertise?: Advertise;
  vote?: Vote;
  content?: Content;
  repost?: Repost;
  banner?: Banner;
  isMine?: boolean;
  lead?: string;
  isFollow: boolean;
  isRead: boolean;
  isLiked: boolean;
  userFullName?: string;
  entityTypeIdentity: string;
  createdDatePersian?: string;
}

export interface TagFeedItem {
  tagId: number;
  tagTitle: string;
  entityTypeId: number;
  entityId: number;
  isLiked: boolean;
  entityTypeIdentity: string;
  post?: Post;
  advertise?: Advertise;
  vote?: Vote;
  content?: Content;
  repost?: Repost;
  banner?: Banner;
}

export interface Banner {
  background: any;
  title: string;
  description: string;
  buttonTitle: string;
  link: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  context: string;
  createdDatePersian: string;
  userFullName: string;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  visitCount: number;
  userId: number;
  userAvatar?: string;
  companyId?: number;
  companyAvatar?: string;
  createdDate: string;
  userName: string;
  isMine?: boolean;
  companyTitle?: string;
  userCompanyId?: number;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  timePast?: string;
  subscriptionAvatar: string | null;
  companyCode?: string;
  entityTypeId: number;
  entityTypeIdentity: string;
  isLiked: boolean;
  medias: any;
  companyIsVerified: boolean;
  userIsVerified: boolean;
}

export interface Advertise {
  id: number;
  userId: number;
  companyId: number;
  userFullName: string;
  productId: number;
  advertiseTypeId: number;
  advertiseStatusId: number;
  advertiseModeId: number;
  dealTypePropertyId?: number;
  amount: number;
  price: number;
  advertiseTypeTitle: "استعلام خرید" | "آگهی فروش";
  companyTitle: string;
  productTitle: string;
  productEngTitle: string;
  companyIsVerified: boolean;
  userIsVerified: boolean;
  deliveryPeriod?: string;
  priceUnitPropertyTitle?: string;
  amountUnitPropertyTitle?: string;
  companyIsSubscribed: boolean;
  userIsSubscribed: boolean;
  userCompanyId?: number;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  timePast?: string;
  subscriptionAvatar: string | null;
  companyIsSafe: boolean | null;
  expirationRemained?: string;
}

export interface Vote {
  id: number;
  userId?: number;
  userName?: string;
  userFullName?: string;
  companyId?: number;
  title: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  isDisabled: boolean;
  participantCount: number;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  visitCount: number;
  createdDatePersian: string;
  companyTitle?: string;
  options: Option[];
  userCompanyId?: number;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  timePast?: string;
  companyCode: string;
  companyAvatar?: string;
  userAvatar?: string;
  entityTypeIdentity: string;
  entityTypeId: number;
  isLiked: boolean;
  userIsVerified: boolean;
  companyIsVerified: boolean;
  subscriptionAvatar: string | null;
  companyIsSafe: boolean | null;
  isParticipated?: boolean | null;
}

export interface Option {
  id: number;
  voteId: number;
  title: string;
  percentage: number;
  orderNo: number;
  chosenCount: number;
  isSelected: boolean;
}

export interface Content {
  id: number;
  title: string;
  contentTypeId: number;
  upperTitle?: string;
  bottomTitle?: string;
  lead: string;
  body: string;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  visitCount: number;
  createdDatePersian: string;
  userId?: number;
  companyId?: number;
  userCompanyId?: number;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  timePast?: string;
  image: string | null;
  isLiked: boolean;
  publishDate?: string;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedDatePersian?: string;
  userFullName?: string;
  userName?: string;
  companyTitle?: string;
  companyCode?: string;
  entityTypeIdentity: string;
  entityTypeId: number;
  medias: any;
  userAvatar?: string;
  companyAvatar?: string;
  userIsVerified: boolean;
  companyIsVerified: boolean;
  subscriptionAvatar: string | null;
  companyIsSafe: boolean | null;
  publishDatePersian?: string;
  nature: "company" | "user" | "none";
}

export interface Repost {
  id: number;
  title: string;
  body: string;
  context: string;
  createdDatePersian: string;
  userFullName: string;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  visitCount: number;
  userId: number;
  userAvatar?: string;
  companyId?: number;
  companyAvatar?: string;
  createdDate: string;
  userName: string;
  companyTitle?: string;
  userCompanyId?: number;
  userCompanyTitle?: string;
  userPositionTitle?: string;
  timePast?: string;
  post: Post;
  companyCode?: string;
  content: Content;
  vote: Vote;
  repost: Repost;
  entityTypeIdentity?: string;
  entityTypeId: number;
  repostedEntityTypeIdentity: string;
  repostedEntityTypeId?: number;
  medias: any;
  userIsVerified: boolean;
  companyIsVerified: boolean;
  subscriptionAvatar: string | null;
  companyIsSafe: boolean | null;
}

export interface FeedList {
  data: Data[];
}
