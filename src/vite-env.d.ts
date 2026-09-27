/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAGES_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
