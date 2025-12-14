import React from "react";
import IndividualCard from "./IndividualCard";
import NothingFound from "./nothingFound";
import { COMPANY, PROFILE } from "@/lib/internal-urls";

interface inquires {
  id: number;
  companyId: number;
  companyCode?: string;
  userId: number;
  productTitle: string;
  productEngTitle: string;
  userFullName: string;
  companyTitle: string;
  amount: number;
  amountUnitPropertyTitle: string;
  companyIsVerified: boolean;
  userIsVerified: boolean;
  companyIsSafe: boolean;
  subscriptionAvatar: string;
  type: "sell" | "buy";
}

interface InquiresProps {
  inquires: inquires[];
  onClose?: () => void;
}

const InquiresList: React.FC<InquiresProps> = ({ inquires, onClose }) => {
  return (
    <div>
      {inquires?.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          {inquires.map((item: inquires) => (
            <IndividualCard
              key={item.id}
              id={item.id}
              onClose={onClose}
              profileLink={
                item.companyId
                  ? COMPANY(item.companyCode ?? item.companyId.toString())
                  : PROFILE(item.userId.toString())
              }
              name={item.companyTitle || item.userFullName}
              productTitle={item.productTitle}
              productEngTitle={item.productEngTitle}
              amountUnit={item.amountUnitPropertyTitle}
              isVerified={
                item.companyId ? item.companyIsVerified : item.userIsVerified
              }
              isSafe={item.companyIsSafe}
              subscriptionAvatar={item.subscriptionAvatar}
              type="sell"
            />
          ))}
        </>
      )}
    </div>
  );
};

export default InquiresList;
