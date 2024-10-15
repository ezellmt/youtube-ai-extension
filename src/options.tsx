import { useState } from "react"
import { Button } from "~src/components/ui/button"
import { Input } from "~src/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~src/components/ui/card"
import ExternalLink from "~src/components/external-link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~src/components/ui/select"
import { IconSparkles } from "~src/components/ui/icons"

function IndexOptions() {
  const [ageRange, setAgeRange] = useState("13+")
  const [flaggedWords, setFlaggedWords] = useState("")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-zinc-50">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-1">
            <span className="text-2xl font-bold">YouTube</span>
            <IconSparkles className="w-6 h-6" />
            <span className="text-2xl font-bold">AI</span>
          </CardTitle>
          <CardDescription>Configure your extension settings here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-zinc-200">Login with:</h3>
            <div className="space-y-2">
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
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#ffffff"/>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <ExternalLink href="https://github.com/yourusername/youtube-ai-extension" className="text-zinc-400 hover:text-zinc-300">
            Learn More
          </ExternalLink>
          <span className="text-sm text-zinc-400">Crafted with ❤️ by Your Name</span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default IndexOptions
