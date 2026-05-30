"use client";

import Cookies from "js-cookie";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { cookieName, fallbackLanguage } from "./config";
import {
    Language,
    StoreLanguageActionsContext,
    StoreLanguageContext,
} from "./store-language-context";

function StoreLanguageProvider(props: PropsWithChildren<{}>) {
  const [language, setLanguageRaw] = useState<Language>(
    () => Cookies.get(cookieName) ?? fallbackLanguage.en
  );

  const setLanguage = useCallback((language: Language) => {
    Cookies.set(cookieName, language ?? fallbackLanguage.en);
    setLanguageRaw(language ?? fallbackLanguage.en);
  }, []);

  const contextValue = useMemo(() => ({ language }), [language]);

  const contextActionsValue = useMemo(
    () => ({
      setLanguage,
    }),
    [setLanguage]
  );

  return (
    <StoreLanguageContext.Provider value={contextValue}>
      <StoreLanguageActionsContext.Provider value={contextActionsValue}>
        {props.children}
      </StoreLanguageActionsContext.Provider>
    </StoreLanguageContext.Provider>
  );
}

export default StoreLanguageProvider;
