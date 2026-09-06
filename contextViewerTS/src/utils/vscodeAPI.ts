// lineageViewerTS/src/utils/vscodeApi.ts

interface VsCodeApi {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

// Declare acquireVsCodeApi as optionally existing on the global window object
declare global {
  interface Window {
    acquireVsCodeApi?: () => VsCodeApi;
  }
}

let vscodeApi: VsCodeApi | undefined;

export let isMock = false

export function getVsCodeApi(): VsCodeApi {
  if (!vscodeApi) {
    // Check if acquireVsCodeApi is available (i.e., we are inside a VS Code webview)
    if (typeof window !== 'undefined' && typeof window.acquireVsCodeApi === 'function') {
      vscodeApi = window.acquireVsCodeApi();
    } else {
      // Fallback mock implementation for outside of VS Code (browser debugging)
      console.warn('acquireVsCodeApi is not available. Using mock VS Code API.');
      
      let mockState: unknown = {};
      isMock = true
      vscodeApi = {
        postMessage: (message: unknown) => {
          console.log('[Mock VS Code API] postMessage:', message);
        },
        getState: () => {
          console.log('[Mock VS Code API] getState:', mockState);
          return mockState;
        },
        setState: (state: unknown) => {
          console.log('[Mock VS Code API] setState:', state);
          mockState = state;
        },
      };
    }
  }
  
  return vscodeApi;
}