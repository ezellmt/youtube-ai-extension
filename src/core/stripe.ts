// Browser extension codebase src/core/stripe.ts

export const API_BASE_URL = 'https://youtube-parental-control.vercel.app/api';

export async function getOrCreateStripeCustomer(userId: string, email: string) {
  console.log(`Attempting to get or create Stripe customer for user: ${userId}`);
  const response = await fetch(`${API_BASE_URL}/create-stripe-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error in getOrCreateStripeCustomer:', errorData);
    throw new Error(errorData.error || 'Failed to get or create Stripe customer');
  }

  const data = await response.json();
  console.log('Stripe customer data:', data);
  return data;
}

export async function createStripeCheckoutSession(userId: string, priceId: string) {
  const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, priceId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create payment intent');
  }

  return response.json();
}

export async function getSubscriptionStatus(userId: string) {
  console.log(`Fetching subscription status for user: ${userId}`);
  const response = await fetch(`${API_BASE_URL}/subscription-status?userId=${userId}`);
  console.log('API Response status:', response.status);
  console.log('API Response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    throw new Error(`Failed to get subscription status: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Parsed API response data:', data);
  return formatSubscriptionData(data);
}

function formatSubscriptionData(data: any) {
  const formattedData = {
    status: data.status || 'inactive',
    planId: data.planId || '',
    currentPeriodEnd: data.currentPeriodEnd || 0,
    videosAnalyzed: data.videosAnalyzed || 0,
    videoLimit: data.videoLimit || 0
  };
  console.log('Formatted subscription data:', formattedData);
  return formattedData;
}

export async function redirectToCheckout(clientSecret: string) {
  if (!clientSecret) {
    console.error('Client secret is null or undefined');
    return;
  }

  const checkoutUrl = `${API_BASE_URL}/create-checkout-session?client_secret=${clientSecret}`;
  chrome.tabs.create({ url: checkoutUrl }, (tab) => {
    if (tab.id) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.url) {
          if (info.url.includes('/api/payment-success')) {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.runtime.sendMessage({ type: 'PAYMENT_SUCCESSFUL' });
            chrome.tabs.remove(tabId);
          } else if (info.url.includes('/api/payment-cancelled')) {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.runtime.sendMessage({ type: 'PAYMENT_CANCELLED' });
            chrome.tabs.remove(tabId);
          }
        }
      });
    }
  });
}

export async function incrementVideosAnalyzed(userId: string) {
  const response = await fetch(`${API_BASE_URL}/increment-videos-analyzed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to increment videos analyzed');
  }

  return response.json();
}