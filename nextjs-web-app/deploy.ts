import { createDeployment } from '@vercel/client';
import { join } from 'path';

async function deploy() {
  try {
    const token = process.env.VERCEL_TOKEN;
    if (!token) {
      throw new Error('VERCEL_TOKEN environment variable is required');
    }

    const deployment = await createDeployment({
      token,
      path: join(process.cwd()),
      projectSettings: {
        framework: 'nextjs',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
      },
    });

    console.log('Deployment started:', deployment.url);
    
    // Wait for deployment to complete
    const status = await deployment.waitForReady();
    console.log('Deployment status:', status);
    console.log('Live URL:', `https://${deployment.url}`);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
