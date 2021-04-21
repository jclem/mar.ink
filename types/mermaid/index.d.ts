declare module 'mermaid/dist/mermaid' {
  import mermaid from 'mermaid'
  export default mermaid
  export interface IMermaidError {
    str: string
  }
}
