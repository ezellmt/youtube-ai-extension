// src/core/stripe.ts

export const API_BASE_URL = 'https://youtube-parental-control.vercel.app/api';

export async function createOrRetrieveStripeCustomer(userId: string) {
  const response = await fetch(`${API_BASE_URL}/create-stripe-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create or retrieve Stripe customer');
  }

  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/subscription-status?userId=${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get subscription status');
  }

  const data = await response.json();
  return {
    status: data.status,
    planId: data.planId,
    currentPeriodEnd: data.currentPeriodEnd,
    videosAnalyzed: data.videosAnalyzed,
    videoLimit: data.videoLimit
  };
}

export async function redirectToCheckout(clientSecret: string) {
  const checkoutUrl = `https://youtube-parental-control.vercel.app/checkout?client_secret=${clientSecret}`;
  chrome.tabs.create({ url: checkoutUrl });
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