import { FeedList } from "../../../Interfaces/Feed_interface";

export const SetLogin_Action = (data: FeedList) => {
  return {
    type: "SetFeed",
    payload: data,
  };
};
