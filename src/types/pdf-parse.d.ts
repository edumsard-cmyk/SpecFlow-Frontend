declare module 'pdf-parse' {
  export class PDFParse {
    constructor(options: { data?: Buffer | Uint8Array; CanvasFactory?: unknown; [key: string]: unknown })
    getText(): Promise<{ text: string }>
    destroy(): Promise<void>
  }
}

declare module 'pdf-parse/worker' {
  export class CanvasFactory {
    create(width: number, height: number): unknown
    reset(canvasAndContext: unknown, width: number, height: number): void
    destroy(canvasAndContext: unknown): void
  }
}
