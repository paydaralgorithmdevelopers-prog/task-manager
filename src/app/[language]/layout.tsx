import ResponsiveAppBar from "@/components/app-bar";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import ToastContainer from "@/components/snackbar-provider";
import AuthProvider from "@/services/auth/auth-provider";
import { getServerTranslation } from "@/services/i18n";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function LanguageLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const { language } = params;
  const { children } = props;

  return (
    <StoreLanguageProvider>
      <ConfirmDialogProvider>
        <AuthProvider>
          <GoogleAuthProvider>
            <FacebookAuthProvider>
              <LeavePageProvider>
                <ResponsiveAppBar />
                {children}
                <ToastContainer
                  position="bottom-left"
                  hideProgressBar
                />
              </LeavePageProvider>
            </FacebookAuthProvider>
          </GoogleAuthProvider>
        </AuthProvider>
      </ConfirmDialogProvider>
    </StoreLanguageProvider>
  );
}

