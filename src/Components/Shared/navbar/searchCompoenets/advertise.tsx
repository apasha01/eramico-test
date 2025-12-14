import React from "react";
import IndividualCard from "./IndividualCard";
import NothingFound from "./nothingFound";
import { COMPANY, PROFILE } from "@/lib/internal-urls";

interface advertise {
  id: number;
  companyId: number;
  companyCode?: string;
  userId: number;
  productTitle: string;
  productEngTitle: string;
  userFullName: string;
  companyTitle: string;
  price: number;
  priceUnitPropertyTitle: string;
  amountUnitPropertyTitle: string;
  companyIsVerified: boolean;
  userIsVerified: boolean;
  companyIsSafe: boolean;
  subscriptionAvatar: string;
  type: "sell" | "buy";
}

interface AdvertiseProps {
  advertise: advertise[];
  onClose?: () => void;
}

const Advertise: React.FC<AdvertiseProps> = ({ advertise, onClose }) => {
  return (
    <div>
      {advertise?.length === 0 ? (
        <NothingFound />
      ) : (
        <>
          {advertise.map((item: advertise) => (
            <IndividualCard
              key={item.id}
              id={item.id}
              onClose={onClose}
              name={item.companyTitle || item.userFullName}
              profileLink={
                item.companyId
                  ? COMPANY(item.companyCode ?? item.companyId.toString())
                  : PROFILE(item.userId.toString())
              }
              productTitle={item.productTitle}
              productEngTitle={item.productEngTitle}
              price={item.price}
              priceUnit={item.priceUnitPropertyTitle}
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

export default Advertise;
