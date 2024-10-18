// src/background/supabasebg.ts

import { supabase } from "~src/core/supabase";

export async function handleSignInWithGoogle(sendResponse) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: chrome.identity.getRedirectURL()
      }
    });

    if (error) throw error;

    chrome.identity.launchWebAuthFlow({
      url: data.url,
      interactive: true
    }, async (redirectUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          sendResponse({ error: error.message });
        } else {
          sendResponse({ data: data });
        }
      }
    });
  } catch (error) {
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
