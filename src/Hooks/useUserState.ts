import { useEffect, useReducer, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { store } from "@/lib/store";
import { fetchUserData } from "@/lib/features/user/userSlice";

export const useUserState = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect to fetch user data on mount if token exists
  useEffect(() => {
    const token = getToken_Localstorage();
    if (token && !user.userId) {
      dispatch(fetchUserData());
    }
  }, [dispatch, user.userId]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const waitForUserId = () =>
      new Promise<void>((resolve) => {
        // If already available, resolve immediately
        const current = store.getState();
        if (current?.user?.userId > 0) {
          resolve();
          return;
        }

        // Otherwise, subscribe to store changes and resolve when ready
        unsubscribe = store.subscribe(() => {
          const state = store.getState();
          if (state?.user?.userId > 0) {
            unsubscribe?.();
            unsubscribe = null;
            resolve();
          }
        });
      });

    const checkUserState = async () => {
      const hasToken = !!getToken_Localstorage();

      if (!hasToken) {
        // No token, user definitely not authenticated
        setIsAuthenticated(false);
        setIsUserLoaded(true);
        return;
      }

      setIsAuthenticated(true);
      if (user.userId > 0) {
        setIsUserLoaded(true);
        return;
      }

      // Wait (asynchronously) until user.userId > 0 without using timers
      await waitForUserId();
      if (!cancelled) setIsUserLoaded(true);
    };

    checkUserState();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [user.userId]);

  return {
    user,
    isUserLoaded,
    isAuthenticated,
  };
};
