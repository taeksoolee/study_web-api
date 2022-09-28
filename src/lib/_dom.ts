import { html, render, TemplateResult } from "lit-html";

export function renderInRoot(template: TemplateResult<1>) {
  const root = document.getElementById('root');

  if(root) {
    render(
      template,
      root
    )
  } else {
    console.error('root not found');
  }
}

export const Button = (text: string, handler: Function) => html`
  <button @click="${handler}" >${text}</button>
`

export const renderTemplate = (text: string, container: HTMLElement) => {
  render(
    html`${text}`,
    container
  )
}