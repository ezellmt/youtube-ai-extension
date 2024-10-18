// src/core/stripe.ts

const API_BASE_URL = 'https://youtube-parental-control.vercel.app/api';

export async function createOrRetrieveStripeCustomer(userId: string, planName: string) {
  const response = await fetch(`${API_BASE_URL}/create-stripe-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, planName }),
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
    throw new Error('Failed to create payment intent');
  }

  return response.json();
}

export async function getSubscriptionStatus(userId: string) {
  const response = await fetch(`${API_BASE_URL}/subscription-status?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to get subscription status');
  }

  return response.json();
}

export async function redirectToCheckout(clientSecret: string) {
  const checkoutUrl = `https://youtube-parental-control.vercel.app/checkout?client_secret=${clientSecret}`;
  chrome.tabs.create({ url: checkoutUrl });
}
