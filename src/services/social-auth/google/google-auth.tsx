"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { useAuthGoogleLoginService } from "@/services/api/services/auth";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import useAuthActions from "@/services/auth/use-auth-actions";
import useLanguage from "@/services/i18n/use-language";
import { AuthUser } from "@/types/auth.types";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function GoogleAuth() {
  const { setUser } = useAuthActions();
  // setTokensInfo removed — auth now uses httpOnly cookies only
  const authGoogleLoginService = useAuthGoogleLoginService();
  const language = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async (tokenResponse: CredentialResponse) => {
    if (!tokenResponse.credential) return;

    setIsLoading(true);

    const { status, data } = await authGoogleLoginService({
      idToken: tokenResponse.credential,
    });

    if (status === HTTP_CODES_ENUM.OK) {
      setUser(data.user as unknown as AuthUser);
    }
    setIsLoading(false);
  };

  return (
    <>
      <GoogleLogin onSuccess={onSuccess}/>
      <FullPageLoader isLoading={isLoading} />
    </>
  );
}
