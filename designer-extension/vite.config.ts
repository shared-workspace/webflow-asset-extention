import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { exec, ChildProcess } from 'child_process';
import http from 'http';
import getPort from 'get-port';

interface PluginWebflowServeOptions {
  port: number;
}

// Retry function to wait for a port to become available
async function isPortAvailable(port: number, retries: number = 60, delay: number = 1000): Promise<boolean> {
  for (let attempt = 0; attempt < retries; attempt++) {
      const availablePort = await getPort({ port });
      if (availablePort === port) return true;
      console.log(`Checking port ${port} availability... (${attempt + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log(`Port ${port} is not available after ${retries} retries`);
  return false;
}

// A singleton process manager
function createProcessManager() {
  let currentProcess: ChildProcess | null = null;

  function startProcess(command: string, options?: Record<string, unknown>): ChildProcess {
    stopProcess(); // Ensure any existing process is stopped before starting a new one
    currentProcess = exec(command, options);
    return currentProcess;
  }

  function stopProcess(): void {
    if (currentProcess) {
      currentProcess.kill();
      currentProcess = null;
    }
  }

  // Ensure process cleanup on program exit
  const cleanup = () => stopProcess();
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGHUP', cleanup);

  return {
    startProcess,
    stopProcess,
  };
}

const processManager = createProcessManager();

async function getWebflowHTML(options: PluginWebflowServeOptions): Promise<string | undefined> {
  const ps = processManager.startProcess('webflow extension serve');
  console.log("Starting Webflow server again");
  let timeout: NodeJS.Timeout | undefined;

  const html = await new Promise<string | undefined>((resolve, reject) => {
    let promiseFulfilled = false;

    const fulfillPromise = (html: string) => {
      if (!promiseFulfilled) {
        promiseFulfilled = true;
        resolve(html);
        processManager.stopProcess();
      }
    };

    const rejectPromise = (error: Error) => {
      if (!promiseFulfilled) {
        promiseFulfilled = true;
        reject(error);
        processManager.stopProcess();
      }
    };

    ps.on('exit', () => rejectPromise(new Error('Process exited unexpectedly')));
    ps.on('close', () => rejectPromise(new Error('Process closed unexpectedly')));
    ps.on('error', (error) => rejectPromise(error));

    ps.stdout?.on('data', (data: Buffer) => {
      const match = data.toString().match(/http:\/\/localhost:(\d+)/);
      const port = match ? parseInt(match[1]) : NaN;

      if (port === options.port) {
        http.get(`http://127.0.0.1:${port}`, (res) => {
          let html = '';
          res.on('data', (chunk) => { html += chunk; });
          res.on('end', () => fulfillPromise(html));
        }).on('error', (err) => {
          console.error('HTTP Fetch Error:', err);
          rejectPromise(err);
        });
      }
    });

    ps.stderr?.on('data', (data: Buffer) => {
      console.error('Process stderr:', data.toString());
      rejectPromise(new Error(data.toString()));
    });

    timeout = setTimeout(() => {
      console.error('Timeout: Webflow server taking too long to start');
      rejectPromise(new Error('Timeout'));
    }, 60_000);
  });

  if (timeout) clearTimeout(timeout);

  processManager.stopProcess();

  return html;
}

const cache = { webflowHTML: undefined as string | undefined };

export default defineConfig({
  plugins: [
    vue(),
    ((options: PluginWebflowServeOptions): Plugin => {
      console.log('Creating plugin');
      return {
        name: '@vitejs/plugin-webflow-serve',
        async transformIndexHtml(html) {
          if (cache.webflowHTML) return cache.webflowHTML;
          if (await isPortAvailable(options.port)) {
            cache.webflowHTML = await getWebflowHTML(options);
            if (cache.webflowHTML) return cache.webflowHTML;
          }
          return html;
        },
      };
    })({ port: 1337 }),
  ],
});
