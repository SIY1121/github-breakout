export function createShape(type: string, attrs: { [key: string]: string | number }) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k].toString()));
  return el;
}

export function createButton(text: string, onClick: (e: MouseEvent) => void) {
  const el = document.createElement("button")
  el.className = "btn btn-sm btn-outline"
  el.textContent = text
  el.onclick = onClick
  return el
}