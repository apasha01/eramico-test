import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { toast } from "react-toastify";

export const useAuthCheck = () => {
  const checkAuth = (
    message: string = "برای این عملیات باید وارد شوید",
    showLoginModal: boolean = true
  ) => {
    const hasToken = !!getToken_Localstorage();

    if (!hasToken) {
      let el = document.getElementById("login-register-main-button");
      if (el && !el.classList.contains("opened") && showLoginModal) {
        document.getElementById("login-register-main-button")?.click();
      }
      toast.warning(message);
      return false;
    }

    return true;
  };

  return { checkAuth };
};
