import { handleSignInWithGoogle, handleGetSession } from "./supabasebg";
import { getSubscriptionStatus } from "~src/core/stripe";
import { supabase, setupAuthStateChange } from "~src/core/supabase";


// Set up auth state change listener
setupAuthStateChange();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "signInWithGoogle":
      handleSignInWithGoogle(sendResponse);
      return true;
    case "getsession":
      handleGetSession(sendResponse);
      return true;
    case "checkSubscription":
      checkSubscription(sendResponse);
      return true;
    default:
      sendResponse({ error: "Unknown action" });
      return false;
  }
});

async function checkSubscription(sendResponse) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData || !sessionData.session || !sessionData.session.user) {
      sendResponse({ error: "User not authenticated" });
      return;
    }

    const userId = sessionData.session.user.id;
    const subscriptionStatus = await getSubscriptionStatus(userId);

    sendResponse({ data: subscriptionStatus });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}