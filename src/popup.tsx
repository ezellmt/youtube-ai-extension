import "@/src/style.css"
import { useState } from "react"
import type { PlasmoCSConfig } from "plasmo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconSparkles } from "@/components/ui/icons"
import ExternalLink from "@/components/external-link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

function IndexPopup() {
  const [ageRange, setAgeRange] = useState("13+")
  const [flaggedWords, setFlaggedWords] = useState("")

  return (
    <div className="w-80 p-4 bg-zinc-900 text-zinc-50">
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center space-x-1">
            <span className="text-xl font-bold text-zinc-50">YouTube</span>
            <IconSparkles className="w-5 h-5 text-zinc-50" />
            <span className="text-xl font-bold text-zinc-50">AI</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-200">Login with:</p>
            <Button variant="outline" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff"/>
              </svg>
              GitHub
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff"/>
              </svg>
              X
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Set Age Range:</label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                {["4+", "7+", "10+", "13+", "17+"].map((age) => (
                  <SelectItem key={age} value={age}>{age}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Flagged Words:</label>
            <Input
              value={flaggedWords}
              onChange={(e) => setFlaggedWords(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder-zinc-400"
              placeholder="Enter flagged words"
            />
          </div>
          <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-50">
            Save Settings
          </Button>
          <div className="text-center text-xs text-zinc-400">
            <ExternalLink href="https://github.com/yourusername/youtube-ai-extension" className="hover:text-zinc-300">
              Learn More
            </ExternalLink>
            <span className="mx-2">•</span>
            <span>Crafted with ❤️ by Your Name</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IndexPopup
