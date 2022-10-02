import indexedD from './example/indexedDB';
import battery from './example/battery';
import { html, render } from 'lit-html';
import { renderInRoot } from './lib/utils/dom';

render(
  html`
    ${[
      indexedD(),
      battery()
    ]}
  `,
  document.getElementById('buttons') as HTMLElement,
);

renderInRoot(
  html`<div>No Selected</div>`
);


