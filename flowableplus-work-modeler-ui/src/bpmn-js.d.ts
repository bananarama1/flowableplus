declare module 'bpmn-js/lib/NavigatedViewer' {
  export default class NavigatedViewer {
    constructor(options: { container: HTMLElement })
    importXML(xml: string): Promise<{ warnings: unknown[] }>
    destroy(): void
  }
}