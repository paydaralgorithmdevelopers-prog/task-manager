"use client";

import { Role } from "@/features/auth/constants/roles";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect } from "react";
import useLanguage from "../i18n/use-language";
import useAuth from "./use-auth";

type PageProps = {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};

type Options = {
  roles?: Role[];
};

function withPageRequiredAuth(
  Component: FunctionComponent<PageProps>,
  options?: Options
) {
  const allowedRoles = options?.roles ?? Object.values(Role);

  return function WithPageRequiredAuth(props: PageProps) {
    const { user, isLoaded } = useAuth();
    const router = useRouter();
    const language = useLanguage();

    useEffect(() => {
      if (!isLoaded) return;

      if (!user) {
        const currentPath = window.location.pathname + window.location.search;
        const params = new URLSearchParams({ returnTo: currentPath });
        router.replace(`/${language}/login?${params.toString()}`);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        router.replace(`/${language}/unauthorized`);
      }
    }, [user, isLoaded, router, language]);

    if (!isLoaded) return null;
    if (!user) return null;
    if (!allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}

export default withPageRequiredAuth;

