import Extension from "~src/components/extension"
import Providers from "~src/components/providers"
import VideoOverlay from "~src/components/video-overlay"
import cssText from "data-text:@/src/style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import type { ThemeName } from "~src/styles/overlay-themes"
import { Storage } from "@plasmohq/storage"
import { useMessage } from "@plasmohq/messaging/hook"

const INJECTED_ELEMENT_ID = "#secondary.style-scope.ytd-watch-flexy"
const PRIMARY_CONTENT_SELECTOR = "#container.style-scope.ytd-player"

const storage = new Storage()

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(INJECTED_ELEMENT_ID),
  insertPosition: "afterbegin"
})

export const getShadowHostId = () => "plasmo-inline"

function PlasmoMainUI() {
  const [theme, setTheme] = useState<ThemeName>('dark');

  // Listen for theme change messages
  useMessage<{ theme: ThemeName }, void>(async (req, res) => {
    if (req.name === "themeChange") {
      setTheme(req.body.theme)
    }
  })

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await storage.get("theme") as ThemeName
      if (savedTheme) setTheme(savedTheme)
    }

    loadTheme()

    const primaryContent = document.querySelector(PRIMARY_CONTENT_SELECTOR) as HTMLElement;
    if (primaryContent) {
      const overlayRoot = document.createElement('div');
      overlayRoot.id = 'youtube-ai-overlay-root';
      overlayRoot.style.position = 'absolute';
      overlayRoot.style.top = '0';
      overlayRoot.style.left = '0';
      overlayRoot.style.width = '100%';
      overlayRoot.style.height = '100%';
      overlayRoot.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlayRoot.style.pointerEvents = 'none';
      overlayRoot.style.zIndex = '2000';
      primaryContent.style.position = 'relative';
      primaryContent.appendChild(overlayRoot);

      const root = createRoot(overlayRoot);
      root.render(<VideoOverlay isVisible={true} theme={theme} />);

      return () => {
        root.unmount();
        primaryContent.removeChild(overlayRoot);
      };
    }
  }, [theme]);

  return (
    <Providers>
      <Extension />
    </Providers>
  )
}

export default PlasmoMainUI
