import "@/src/style.css"
import { useState, useEffect } from "react"
import { Button } from "~src/components/ui/button"
import { Toaster } from "~src/components/ui/toaster"
import { useToast } from "~src/components/ui/use-toast"
import { supabase, getCurrentUser, signInWithGoogle } from "~src/core/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface AuthResult {
  session: Session | null;
  user: User | null;
}

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleOAuthLogin = async (provider: "github" | "google" | "twitter") => {
    setLoading(true)
    try {
      if (provider === "google") {
        const result = await signInWithGoogle() as AuthResult;
        console.log("Sign-in result:", result);
        if (result && result.session && result.user) {
          setUser(result.user);
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
        if (userData) {
          setUser(userData.user);
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

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true)
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData.user);
          toast({ description: `Welcome back, ${userData.user.email}!` })
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
      toast({ description: "Signed out successfully" })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({ description: `Error signing out: ${error instanceof Error ? error.message : String(error)}` })
    } finally {
      setLoading(false)
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
          <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <div className="space-y-2">
            <Button onClick={() => handleOAuthLogin("github")} className="w-full">Sign in with GitHub</Button>
            <Button onClick={() => handleOAuthLogin("google")} className="w-full">Sign in with Google</Button>
            <Button onClick={() => handleOAuthLogin("twitter")} className="w-full">Sign in with Twitter</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
