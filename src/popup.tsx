import "@/src/style.css"
import { API_BASE_URL } from "~/src/core/stripe"
import { useState, useEffect } from "react"
import { Button } from "~src/components/ui/button"
import { Toaster } from "~src/components/ui/toaster"
import { useToast } from "~src/components/ui/use-toast"
import { supabase, getCurrentUser, signInWithGoogle } from "~src/core/supabase"
import { getSubscriptionStatus, createStripeCheckoutSession, redirectToCheckout } from "~src/core/stripe"
import type { User, Session } from "@supabase/supabase-js"
import { RainbowButton } from "~src/components/ui/rainbow-button"

interface AuthResult {
  session: Session | null;
  user: User | null;
}

interface SubscriptionStatus {
  status: string;
  planId: string;
  currentPeriodEnd: number;
  videosAnalyzed: number;
  videoLimit: number;
}

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const { toast } = useToast()

  const handleOAuthLogin = async (provider: "github" | "google" | "twitter") => {
    setLoading(true)
    try {
      if (provider === "google") {
        const result = await signInWithGoogle() as AuthResult;
        console.log("Sign-in result:", result);
        if (result && result.session && result.user) {
          setUser(result.user);
          await createStripeCustomer(result.user.id);
          await checkSubscriptionStatus(result.user.id);
          toast({ description: `Signed in successfully as ${result.user.email}` });
        } else {
          throw new Error("No session returned after sign-in");
        }
      } else {
        const { error } = await supabase.auth.signInWithOAuth({ provider })
        if (error) {
          throw error;
        }
        const userData = await getCurrentUser();
        if (userData && userData.user) {
          setUser(userData.user);
          await createStripeCustomer(userData.user.id);
          await checkSubscriptionStatus(userData.user.id);
          toast({ description: `Signed in successfully as ${userData.user.email}` })
        }
      }
    } catch (error) {
      console.error(`Error with ${provider} login: `, error);
      toast({ description: `Error with ${provider} login: ${error instanceof Error ? error.message : String(error)}` })
    } finally {
      setLoading(false)
    }
  }

  const createStripeCustomer = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-stripe-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to create Stripe customer');
      const data = await response.json();
      console.log('Stripe customer created:', data);
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      toast({ description: 'Error creating customer account' });
    }
  }

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      const status = await getSubscriptionStatus(userId);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      toast({ description: "Error checking subscription status" });
    }
  }


  useEffect(() => {
    const checkSession = async () => {
      setLoading(true)
      try {
        const userData = await getCurrentUser();
        if (userData && userData.user) {
          setUser(userData.user);
          await checkSubscriptionStatus(userData.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false)
      }
    };

    checkSession();
  }, [])

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSubscriptionStatus(null);
      toast({ description: "Signed out successfully" })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({ description: `Error signing out: ${error instanceof Error ? error.message : String(error)}` })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) return;
    try {
      const { sessionId, clientSecret } = await createStripeCheckoutSession(user.id, 'price_1234567890'); // Replace with actual price ID
      await redirectToCheckout(clientSecret);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({ description: "Error creating checkout session" });
    }
  }

  return (
    <div className="w-80 p-4 bg-zinc-900 text-zinc-50">
      <Toaster />
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>
          <h1 className="text-xl font-bold mb-4">User Info</h1>
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Subscription: {subscriptionStatus?.status || 'Loading...'}</p>
          <p>Videos Analyzed: {subscriptionStatus?.videosAnalyzed || 0} / {subscriptionStatus?.videoLimit || 0}</p>
          <Button onClick={handleSignOut} className="mt-4 w-full">Sign Out</Button>
          {subscriptionStatus?.status !== 'active' && (
            <Button onClick={handleUpgrade} className="mt-4 w-full">Upgrade to Pro</Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <div className="space-y-2">
            <Button onClick={() => handleOAuthLogin("github")} className="w-full">Sign in with GitHub</Button>
            <Button onClick={() => handleOAuthLogin("google")} className="w-full">Sign in with Google</Button>
            <Button onClick={() => handleOAuthLogin("twitter")} className="w-full">Sign in with Twitter</Button>
          </div>
          <RainbowButton onClick={() => console.log("Sign up clicked")} className="w-full text-lg">
            Get Started for free
          </RainbowButton>
        </div>
      )}
    </div>
  )
}

export default IndexPopup