import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY } from "./config";

export type TokensInfo = {
  token: string;
  tokenExpires: number;
  refreshToken: string;
} | null;

export function getTokensInfo() {
  return JSON.parse(Cookies.get(AUTH_TOKEN_KEY) ?? "null") as TokensInfo;
}

export function setTokensInfo(tokens: TokensInfo) {
  if (tokens) {
    Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokens));
  } else {
    Cookies.remove(AUTH_TOKEN_KEY);
  }
}
