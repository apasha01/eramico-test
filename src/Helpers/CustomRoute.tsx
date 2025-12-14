import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Redux_Interface } from "./Interfaces/Redux_Interface";
import { UseAppSelector } from "./CustomHooks/UseAppSelector";
import { getToken_Localstorage } from "./LocalStorageHandler/LocalStorageHelper";

export { CustomRoute };

function CustomRoute({ children }: any) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const Loginstate: boolean = UseAppSelector(
    (state: Redux_Interface) => state.Login.loginstate
  );

  useEffect(() => {
    function authCheck(url: string) {
      const publicPaths = [
        "/",
        "/404",
        "/Home",
        "/Login",
        "/Login/:id",
        "/News",
        "/News/:id/:title",
        "/InstallOnIOS",
        "/Privacy",
        "/AboutUs",
        "/ContactUs",
        "/FAQ",
        "/Page/{string}/{number}",
        "/Tags/{number}/{string}",
        "/C/:ShortLink",
      ];
      const path = url.split("?")[0];
      if (publicPaths.includes(path) === true) {
        setAuthorized(true);
      } else {
        if (Loginstate) {
          setAuthorized(true);
        } else {
          const token = String(getToken_Localstorage());
          if (token !== "null") {
          } else {
            setAuthorized(true);
          }
        }
      }
    }

    authCheck(router.asPath);

    const hideContent = () => setAuthorized(false);
    
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", (url) => authCheck(router.asPath));

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, Loginstate]);

  return authorized && children;
}
