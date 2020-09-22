/**
 * create SVG element
 * @param type svg element type
 * @param attrs attributes
 * @param text textContent
 */
export function createShape(
  type: string,
  attrs: { [key: string]: string | number },
  text = ''
) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', type)
  Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k].toString()))
  el.textContent = text
  return el
}

/**
 * create button element
 * @param text textContent
 * @param onClick
 */
export function createButton(text: string, onClick: (e: MouseEvent) => void) {
  const el = document.createElement('button')
  el.className = 'btn btn-sm btn-outline'
  el.textContent = text
  el.onclick = onClick
  return el
}

/**
 * create div element
 * @param text textContent
 */
export function createDivElement(text: string) {
  const el = document.createElement('div')
  el.textContent = text
  return el
}
