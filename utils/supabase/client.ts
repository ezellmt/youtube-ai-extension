// Browser extension codebase utils/supabase/client.ts

import { supabase } from "~/src/core/supabase"

export function setupAuthStateChange() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const redirectTo = `chrome-extension://${chrome.runtime.id}/options.html`;
        chrome.tabs.create({ url: redirectTo });
      }
    });
  }