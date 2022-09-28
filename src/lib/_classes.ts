import { render, TemplateResult } from "lit-html";
import { getRandomNumber } from "./_utils";

/**
 * 컴포넌트 내에 contentId 클래스를 가진 element가 있다고 가정한다.
 * @Method renderInContent - contentId를 가진 element 안에 전달받은 template을 렌더링한다.
 */
export class HTMLElementWithContent extends HTMLElement {
  contentId = `${getRandomNumber()}_check-content`;

  constructor() {
    super();
  }

  renderInContent(template: TemplateResult<1> | TemplateResult<1>[] | string) {
    const $content = this.getElementsByClassName(this.contentId)[0] as HTMLElement;

    render(
      template,
      $content,
    );
  }
} 