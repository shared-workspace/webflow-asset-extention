import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { exec, ChildProcess } from 'child_process';
import http from 'http';
import getPort from 'get-port';

const webflowJsonPath = path.join(process.cwd(), 'webflow.json');
if (!fs.existsSync(webflowJsonPath)) throw new Error('webflow.json not found. in Root Directory');

interface Cache {
    webflowHTML: string | null;
    childPid: number;
}

let cache: Cache = {
    webflowHTML: null,
    childPid: 0,
};

const cachePath = path.join(__dirname, 'webflow.cache.json');

function loadCache(init = false): Cache {
    if (init) {
        fs.writeFileSync(cachePath, JSON.stringify(cache));
        return cache;
    }
    if (fs.existsSync(cachePath)) {
        const data = fs.readFileSync(cachePath, 'utf-8');
        return cache = {
            ...cache,
            ...JSON.parse(data),
        };
    }
    return loadCache(true);
}

function saveCache(data: Partial<Cache> = {}): void {
    cache = {
        ...cache,
        ...data,
    };
    fs.writeFileSync(cachePath, JSON.stringify(cache));
}

let envFlag = process.env.WEBFLOW_SERVE_PLUGIN_STARTING_FIRST_TIME !== 'false';
if (envFlag) {
    console.log('Using Webflow Serve Plugin Clean Start');
    process.env.WEBFLOW_SERVE_PLUGIN_STARTING_FIRST_TIME = 'false';
    loadCache(envFlag);
} else {
    console.log('Webflow Serve Plugin Using Cache. To use new webflow.json setting restart the server');
    loadCache();
}


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

async function fetchHTMLFromServer(port: number): Promise<string | null> {
    return new Promise((resolve) => {
        http.get(`http://127.0.0.1:${port}`, (res) => {
            if (res.statusCode !== 200) return resolve(null);
            let html = '';
            res.on('data', (chunk) => { html += chunk; });
            res.on('end', () => resolve(html));
        }).on('error', () => resolve(null));
    });
}

interface Options {
    port: number;
}

function startWebflowServer(waitTime = 60_000): Promise<ChildProcess | null> {
    const child = exec('webflow extension serve', { cwd: process.cwd() });
    return new Promise((resolve) => {
        let settled = false;
        let timeout: NodeJS.Timeout | null = null;
        const settle = (error?: Error, result?: ChildProcess) => {
            if (settled) return;
            settled = true;
            // console.log("webflow: ", error);
            if (error) return resolve(null);
            if (result) resolve(result);
            resolve(null);
        }
        child.on('error', settle);
        child.on('exit', (code, signal) => {
            settle(new Error(`Child process exited with code ${code} and signal ${signal}`));
        });
        child.on('spawn', () => {
            settle(undefined, child);
            if (child.pid) saveCache({ childPid: child.pid });
            timeout = setTimeout(() => {
                console.log('Exceed Wating Time. Exiting...');
                stopWebflowServer(child);
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            }, waitTime);
            child.addListener('exit', () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            });
            child.addListener('error', () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            });
            child.stderr?.on('data', () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            });
        });
    });
}

function stopWebflowServer(child: ChildProcess) {
    if (child.killed) return;
    if (!child.kill()) {
        // console.error('Failed to kill Webflow server by sending SIGTERM. Trying SIGKILL...');
        if (!child.kill('SIGKILL')) {
            // console.error('Failed to kill Webflow server by sending SIGKILL.');
        }
    }
    // if (child.killed) return console.log('Webflow server stopped.');
    // console.error('Failed to stop Webflow server.');
}

function alreadyRunningWebflowServer(pid: number): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        exec(`ps -p ${pid}`, (error, stdout, _stderr) => {
            if (error) {
                // console.error(`Error executing ps command: ${stderr}`);
                return resolve(false);
            }
            // If the output contains the PID, the process is running
            if (stdout.includes(pid.toString())) {
                return resolve(true);
            }
            return resolve(false);
        });
    });
}

function killWebflowServer(pid: number): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        exec(`kill ${pid}`, (error, _stdout, _stderr) => {
            if (error) {
                // console.error(`Error executing kill command: ${stderr}`);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function getWebflowHTML(options: Options): Promise<string | null> {

    if (cache.webflowHTML) return cache.webflowHTML;

    if (cache.childPid && await alreadyRunningWebflowServer(cache.childPid)) {
        console.log('Webflow server is already running. with previous pid: ', cache.childPid);
        console.log('Stopping Webflow server...');
        if (!await killWebflowServer(cache.childPid)) {
            console.error('Failed to stop Previous Webflow server.');
            return null;
        }
    }
    saveCache({ childPid: 0 });
    if (!await isPortAvailable(options.port)) return null;
    const child = await startWebflowServer();
    if (!child) return null;
    return new Promise((resolve) => {
        let settled = false;
        child?.stdout?.on('data', (data) => {

            const match = data.toString().match(/http:\/\/localhost:(\d+)/);
            const port = match ? parseInt(match[1], 10) : NaN;

            if (port === options.port) {
                console.log('Running Plugin Webflow Serve First Time. Generating webflow index.html wait for a moment...');
                console.log('Using setting from', webflowJsonPath);
                fetchHTMLFromServer(port)
                    .then((html) => {
                        settled = true;
                        resolve(html);
                    })
                    .catch(e => {
                        console.error('Error fetching HTML from Webflow server:', e);
                        settled = true;
                        resolve(null);
                    })
                    .finally(() => {
                        stopWebflowServer(child);
                    });
            }

        });

        child.addListener('exit', () => {
            if (!settled) {
                console.error('Webflow server exited unexpectedly.');
                resolve(null);
            }
        });

    })
}

export default function webflowServe(options: Options): Plugin {
    return {
        name: '@vitejs/plugin-webflow-serve',
        enforce: 'pre',
        apply: 'serve',
        async transformIndexHtml(html) {
            const webflowHTML = await getWebflowHTML(options);
            if (webflowHTML) {
                saveCache({ webflowHTML });
                console.log(webflowHTML);
                return webflowHTML;
            }
            return html;
        }
    };
}
