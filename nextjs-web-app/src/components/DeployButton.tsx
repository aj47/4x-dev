import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeployButtonProps {
  code: string;
  title: string;
}

export default function DeployButton({ code, title }: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string>("");

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      setError(null);
      setDeploymentUrl(null);
      setDeploymentStatus("Starting deployment...");

      // Validate code
      if (!code.trim()) {
        throw new Error("No code to deploy");
      }

      // Create a temporary project with the code
      setDeploymentStatus("Creating deployment...");
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          title: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deployment failed");
      }

      if (!data.url) {
        throw new Error("No deployment URL received");
      }

      setDeploymentStatus("Deployment successful!");
      setDeploymentUrl(data.url);
    } catch (err) {
      console.error("Deployment error:", err);
      setError(err instanceof Error ? err.message : "Failed to deploy");
      setDeploymentUrl(null);
      setDeploymentStatus("");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          {isDeploying ? "Deploying..." : "Deploy to Vercel"}
        </Button>
        {deploymentStatus && !error && (
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {deploymentStatus}
          </span>
        )}
        {error && (
          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      {deploymentUrl && (
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md w-full">
          <span className="text-sm text-gray-600">Deployed at:</span>
          <a
            href={`https://${deploymentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 break-all"
          >
            {`https://${deploymentUrl}`}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-gray-500 hover:text-gray-700 shrink-0"
            onClick={() => {
              if (deploymentUrl) {
                navigator.clipboard.writeText(`https://${deploymentUrl}`);
              }
            }}
          >
            Copy URL
          </Button>
        </div>
      )}
    </div>
  );
}
