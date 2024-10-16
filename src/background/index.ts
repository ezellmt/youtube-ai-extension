import { supabase } from "~src/core/supabase";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "signInWithGoogle":
      handleSignInWithGoogle(sendResponse);
      return true;
    case "getsession":
      handleGetSession(sendResponse);
      return true;
    default:
      sendResponse({ error: "Unknown action" });
      return false;
  }
});
async function handleSignInWithGoogle(sendResponse) {
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

async function handleGetSession(sendResponse) {
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

