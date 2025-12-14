export interface ChatInterfaceData {
  otherId: number;
  otherAvatar: string | null;
  otherName: string;
  otherUserName: string;
  date: string;
  unread: number;
  lastContext: string;
  datePersian: string;
  timePast: string;
  messageTypeId: number;
}

export interface MessageInterface {
  id: number;
  messageTypeId: number;
  fromUserId: number;
  fromName: string;
  toUserId: number;
  entityTypeId: number | null;
  entityId: number | null;
  context: string;
  senderIP: string | null;
  senderFullName: string | null;
  senderEmail: string | null;
  senderCall: string | null;
  relatedURL: string | null;
  createdDate: string; // Assuming ISO 8601 format
  isRead: boolean;
  isDeleted: boolean;
  messageTypeTitle: string | null;
  fromUserName: string;
  fromUserFullName: string;
  fromUserAvatar: string | null;
  toUserName: string;
  toUserFullName: string;
  toUserAvatar: string | null;
  entityTypeTitle: string | null;
  otherUserId: number;
  entityTypeIdentity: string | null;
  createdDatePersian: string;
  advertise: any; // Adjust type as per actual data
  media: any; // Adjust type as per actual data
}