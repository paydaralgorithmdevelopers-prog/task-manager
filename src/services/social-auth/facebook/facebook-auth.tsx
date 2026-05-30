"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { useAuthFacebookLoginService } from "@/services/api/services/auth";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import { AuthUser } from "@/types/auth.types";
import Button from "@mui/material/Button";
import { useState } from "react";
import useFacebookAuth from "./use-facebook-auth";

export default function FacebookAuth() {
  const { setUser } = useAuthActions();
  // setTokensInfo removed — auth now uses httpOnly cookies only
  const authFacebookLoginService = useAuthFacebookLoginService();
  const facebook = useFacebookAuth();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    try {
      const loginResponse = await facebook.login();
      if (!loginResponse.authResponse) return;

      setIsLoading(true);

      const { status, data } = await authFacebookLoginService({
        accessToken: loginResponse.authResponse.accessToken,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        setUser(data.user as unknown as AuthUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={onLogin}>
        {t("common:auth.facebook.action")}
      </Button>
      <FullPageLoader isLoading={isLoading} />
    </>
  );
}
