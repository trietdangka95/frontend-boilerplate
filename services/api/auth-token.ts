export interface AccessTokenStore {
  get: () => string | null;
  set: (token: string | null) => void;
}

export function createAccessTokenStore(): AccessTokenStore {
  let accessToken: string | null = null;
  return {
    get: () => accessToken,
    set: (token) => {
      accessToken = token;
    },
  };
}

const browserTokens = createAccessTokenStore();

export function getAccessToken() {
  return browserTokens.get();
}

export function setAccessToken(token: string | null) {
  browserTokens.set(token);
}

export function clearAccessToken() {
  browserTokens.set(null);
}
