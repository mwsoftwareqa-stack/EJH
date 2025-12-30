import { Local } from 'browserstack-local';

let bsLocal: Local;

export async function startLocal() {
  return new Promise<void>((resolve, reject) => {
    bsLocal = new Local();
    bsLocal.start({ key: process.env.BROWSERSTACK_ACCESS_KEY || '' }, (error) => {
      if (error) return reject(error);
      console.log('✅ BrowserStackLocal started');
      resolve();
    });
  });
}

export async function stopLocal() {
  return new Promise<void>((resolve, reject) => {
    if (bsLocal) {
      bsLocal.stop(() => {
        console.log('🛑 BrowserStackLocal stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}
