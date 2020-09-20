export function createShape(type: string, attrs: { [key: string]: string | number }) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k].toString()));
  return el;
}
