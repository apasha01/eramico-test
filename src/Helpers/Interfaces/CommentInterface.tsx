export interface CommentReplyInterface {
  id: number;
  commentId: number;
  userId: number | null;
  body: string;
  senderName: string;
  senderEmail: string;
  senderURL: string;
  senderIP: string;
  yesCount: number;
  noCount: number;
  commentStatusId: number;
  statusDate: string;
  createdDate: string;
  commentStatusTitle: string;
  userName: string | null;
  userFullName: string | null;
  userAvatar: string | null;
}

export interface CommentInterface {
  id: number;
  entityTypeId: number;
  entityId: number;
  userId: number | null;
  body: string;
  senderName: string;
  senderEmail: string;
  senderURL: string;
  senderIP: string;
  yesCount: number;
  noCount: number;
  commentStatusId: number;
  statusDate: string;
  createdDate: string;
  commentStatusTitle: string;
  userName: string | null;
  userFullName: string | null;
  userAvatar: string | null;
  userIsVerified: boolean;
  userIsChosen: boolean;
  userIsSubscribed: boolean;
  subscriptionAvatar: string | null;
  userCompanyId: number;
  userCompanyTitle: string | null;
  userPositionTitle: string | null;
  entityTypeTitle: string | null;
  countReply: number;
  entityTypeIdentity: string;
  statusDatePersian: string;
  createdDatePersian: string;
  timePast: string | null;
  replies: CommentReplyInterface[];
}
