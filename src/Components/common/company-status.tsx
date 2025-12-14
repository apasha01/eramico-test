import TheVerifyIcon from "./the-verify-icon";
import TheSubscriptionIcon from "./the-subscription-icon";
import TheSafeIcon from "./the-safe-icon";

interface CompanyStatusProps {
  verified?: boolean;
  subscriptionAvatar?: string | null;
  isSafe?: boolean;
}

const CompanyStatus = ({
  verified,
  subscriptionAvatar,
  isSafe,
}: CompanyStatusProps) => {
  return (
    <>
      {verified && <TheVerifyIcon />}
      {subscriptionAvatar && (
        <TheSubscriptionIcon subscriptionAvatar={subscriptionAvatar} />
      )}
      {isSafe && <TheSafeIcon />}
    </>
  );
};

export default CompanyStatus;
