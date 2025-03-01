import { useState, useEffect } from "react";
import Playground from "@e2b/sdk";

interface AppPreviewProps {
  title: string;
  code: string;
}

export default function AppPreview({ title, code }: AppPreviewProps) {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [playground, setPlayground] = useState<Playground | null>(null);

  useEffect(() => {
    const initPlayground = async () => {
      try {
        const pg = await Playground.create({
          template: "nextjs",
          apiKey: process.env.NEXT_PUBLIC_E2B_API_KEY,
          options: {
            sandboxConfig: {
              iframePermissions: {
                forms: true,
                scripts: true,
                sameOrigin: true,
                modals: true,
                popups: true,
                presentation: true,
                topNavigation: true,
              },
            },
          },
        });
        setPlayground(pg);
      } catch (error) {
        console.error("Failed to initialize playground:", error);
      }
    };

    initPlayground();

    return () => {
      if (playground) {
        playground.close();
      }
    };
  }, []);

  useEffect(() => {
    const updatePreview = async () => {
      if (!playground) return;

      try {
        await playground.filesystem.write("/app/page.tsx", code);
        await playground.reload();
      } catch (error) {
        console.error("Failed to update preview:", error);
      }
    };

    updatePreview();
  }, [code, playground]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">{title}</h3>

      <button
        onClick={() => setIsCodeVisible(!isCodeVisible)}
        className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
      >
        {isCodeVisible ? "Hide Code" : "View Code"}
      </button>

      {isCodeVisible && (
        <div className="mb-4 overflow-auto max-h-[300px] rounded-md">
          <pre className="bg-gray-50 p-4 text-sm">
            <code>{code}</code>
          </pre>
        </div>
      )}

      <div className="border rounded-md overflow-hidden h-[400px]">
        {playground ? (
          <Playground.Preview
            playground={playground}
            className="w-full h-full"
            sandboxAttributes="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-top-navigation"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            Loading preview...
          </div>
        )}
      </div>
    </div>
  );
}
