declare module 'pdfmake' {
  type Fonts = Record<string, { normal: string; bold: string; italics: string; bolditalics: string }>;
  const pdfMake: {
    setFonts(fonts: Fonts): void;
    setUrlAccessPolicy(policy: (url: string) => boolean): void;
    createPdf(definition: unknown): { getBuffer(): Promise<Buffer> };
  };
  export default pdfMake;
}
