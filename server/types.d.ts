// Type declarations to resolve Vite server options compatibility
declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: boolean | true | string[];
  }
}

export {};