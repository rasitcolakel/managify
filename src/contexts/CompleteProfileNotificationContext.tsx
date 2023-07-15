// create a context for CompleteProfileNotificationContext

import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "src/services/users";
import { Profile } from "src/types";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { useRouter } from "next/router";

type CompleteProfileNotificationContextType = {
  user: Profile | null;
  loading: boolean;
  execute: () => void;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
};

export const CompleteProfileNotificationContext =
  createContext<CompleteProfileNotificationContextType>(
    {} as CompleteProfileNotificationContextType
  );

export const useCompleteProfileNotification = () => {
  return useContext(CompleteProfileNotificationContext);
};

type Props = {
  children: React.ReactNode;
};

export const CompleteProfileNotificationContextProvider: React.FC<Props> = ({
  children,
}) => {
  const router = useRouter();

  const {
    execute,
    data: user,
    loading,
  } = useAsyncFunction<any, Profile>(getMyProfile);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (user && router.pathname) {
      if (
        user.status === "created" &&
        router.pathname !== "/profile/update" &&
        !loading
      ) {
        setOpen(true);
      }
    }
  }, [user, router.pathname, loading, router]);

  return (
    <CompleteProfileNotificationContext.Provider
      value={{ user, loading, execute, open, setOpen }}
    >
      {children}
    </CompleteProfileNotificationContext.Provider>
  );
};
