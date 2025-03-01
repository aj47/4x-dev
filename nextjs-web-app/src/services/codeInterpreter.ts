import 'server-only';
import { Sandbox } from '@e2b/code-interpreter';

const E2B_API_KEY = process.env.E2B_API_KEY;
if (!E2B_API_KEY) {
  throw new Error('E2B_API_KEY environment variable not found');
}

const sandboxTimeout = 5 * 60 * 1000; // 5 minutes in ms

export async function previewCode(code: string, sessionID: string) {
  const sandbox = await getSandbox(sessionID);

  // Create a simple HTML file with the code
  const htmlFilePath = '/tmp/preview.html';
  await sandbox.filesystem.write(htmlFilePath, code);

  // Start a simple HTTP server to serve the file
  const port = 3001;
  const serverCommand = await sandbox.process.start({
    cmd: `python3 -m http.server ${port}`,
    cwd: '/tmp',
  });

  // Return the URL where the preview is available
  return `http://localhost:${port}/preview.html`;
}

async function getSandbox(sessionID: string) {
  const sandboxes = await Sandbox.list();
  const sandboxID = sandboxes.find(sandbox => sandbox.metadata?.sessionID === sessionID)?.sandboxId;

  if (sandboxID) {
    const sandbox = await Sandbox.connect(sandboxID, {
      apiKey: E2B_API_KEY,
    });
    await sandbox.setTimeout(sandboxTimeout);
    return sandbox;
  } else {
    const sandbox = await Sandbox.create({
      apiKey: E2B_API_KEY,
      metadata: {
        sessionID,
      },
      timeoutMs: sandboxTimeout,
    });
    return sandbox;
  }
}
