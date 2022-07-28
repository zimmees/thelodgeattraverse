const CACHE = {};

function createTemplate(string) {
  if (CACHE[string]) return CACHE[string];
  const template = document.createElement('template');
  template.innerHTML = string.trim();
  CACHE[string] = template;
  return template;
}

export default function createSlots(root, template) {
  // Do not support shadow DOM.
  if (root.shadowRoot) return;
  // Ensure template is a DOM node.
  if (typeof template === 'string') {
    template = createTemplate(template);
  }
  // Clone template node.
  template = template.content.cloneNode(true);
  // Replace all slot children with corresponding slotted content.
  const slottedContents = Array.from(root.querySelectorAll('[slot]'));
  slottedContents.forEach((content) => {
    const id = content.getAttribute('slot');
    const slot = template.querySelector(`slot[name="${id}"]`);
    slot.replaceChildren(content);
  });
  // Replace default slot children with default content.
  const defaultSlot = template.querySelector('slot:not([name])');
  defaultSlot.replaceChildren(...root.children);
  // Root should now have zero children. Append template to root.
  root.appendChild(template);
}
