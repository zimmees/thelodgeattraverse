/* globals HTMLElement */
import populateSlots from '../../utilities/light-slots.js';
import html from 'bundle-text:./copy-card.tpl.html';

class CopyCard extends HTMLElement {
  constructor() {
    super();
    // Insert template.
    populateSlots(this, html);
    // Cache dom.
    this.dom = {
      content: this.querySelector('.copy-card__content'),
      label: this.querySelector('.copy-card__label'),
      copy: this.querySelector('.copy-card__copy'),
    };
    // Set local state.
    this.value = this.getAttribute('value');
    // Attach events.
    this.addEventListener('click', this.handleClick);
    // Render.
    // this.render();
  }

  handleClick() {
    const oldContent = this.dom.copy.textContent;
    navigator.clipboard.writeText(this.value).then(() => {
      this.dom.copy.textContent = 'copied!';
      setTimeout(() => {
        this.dom.copy.textContent = oldContent;
      }, 2500);
    });
  }

  // render() {
  //   this.dom.demo.style.backgroundColor = `var(--c-${this.label}, ${this.color})`;
  //   this.dom.value.textContent = this.color;
  //   this.dom.name.textContent = this.label;
  // }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attr, oldValue, value) {
    if (value === oldValue) return;
    this[attr] = value;
    // this.render();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }
}

export default CopyCard;
