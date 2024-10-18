// src/background/supabasebg.ts

import { supabase } from "~src/core/supabase";

export async function handleSignInWithGoogle(sendResponse) {
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

    chrome.identity.launchWebAuthFlow({
      url: data.url,
      interactive: true
    }, async (responseUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Chrome runtime error:", chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else if (!responseUrl) {
        sendResponse({ error: "No response URL returned" });
      } else {
        console.log("Response URL:", responseUrl);
        const url = new URL(responseUrl);
        const params = new URLSearchParams(url.hash.slice(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            sendResponse({ error: error.message });
          } else {
            sendResponse({ data: data });
          }
        } else {
          sendResponse({ error: 'Failed to get tokens from response URL' });
        }
      }
    });
  } catch (error) {
    console.error("Error in handleSignInWithGoogle:", error);
    sendResponse({ error: error.message });
  }
}

export async function handleGetSession(sendResponse) {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      sendResponse({ error: error.message });
    } else {
      sendResponse({ data: data });
    }
  } catch (error) {
    sendResponse({ error: error.message });
  }
}
