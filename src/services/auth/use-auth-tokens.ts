// Legacy stub — social auth no longer uses cookie-based tokens.
// Kept for backward compatibility with social auth components.
function useAuthTokens() {
  return { setTokensInfo: (_tokens: unknown) => {} };
}

export default useAuthTokens;
