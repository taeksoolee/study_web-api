
import { html } from "lit-html";
import { Button, renderInRoot } from "./utils/dom";

export default () => {
  return Button('battery', main);
}

function main() {
  console.log('🚀 battery');  
  renderInRoot(html``);
}