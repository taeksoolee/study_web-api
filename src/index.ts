import indexedDBExam from './lib/indexedDBExam';
import batteryExam from './lib/batteryExam';
import { html, render } from 'lit-html';
import { renderInRoot } from './lib/_dom';

render(
  html`
    ${[
      indexedDBExam(),
      batteryExam()
    ]}
  `,
  document.getElementById('buttons') as HTMLElement,
)


renderInRoot(
  html`<div>No Selected</div>`
)

