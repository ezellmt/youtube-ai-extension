import { createClient, type User } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
);

const chromeStorageKeys = {
  gauthAccessToken: "gauthAccessToken",
  gauthRefreshToken: "gauthRefreshToken"
}

export async function signInWithGoogle() {
  try {
    const redirectUrl = chrome.identity.getRedirectURL();
    console.log("Redirect URL:", redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) throw error;

    if (!data || !data.url) {
      throw new Error("No URL returned from Supabase OAuth initiation");
    }

    console.log("OAuth URL:", data.url);

    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({
        url: data.url,
        interactive: true
      }, async (responseUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Chrome runtime error:", chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
        } else if (!responseUrl) {
          reject(new Error("No response URL returned"));
        } else {
          console.log("Response URL:", responseUrl);
          const url = new URL(responseUrl);
          const params = new URLSearchParams(url.hash.slice(1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const expires_in = params.get('expires_in');

          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
              expires_in: parseInt(expires_in || '3600')
            });
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          } else {
            reject(new Error('Failed to get tokens from response URL'));
          }
        }
      });
    });
  } catch (error) {
    console.error("Error in signInWithGoogle:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<null | {
  user: User;
  accessToken: string;
}> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return { user: session.user, accessToken: session.access_token };
  }
  return null;
}
