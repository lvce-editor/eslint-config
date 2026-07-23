const invalidEvent = {
  childCount: 0,
  onContextmenu: Events.ContextMenu,
  type: VirtualDomElements.Div,
}

const invalidTextProperty = {
  childCount: 0,
  text: 'settings',
  type: VirtualDomElements.Span,
}

const nullishAttribute = {
  childCount: 0,
  title: undefined,
  type: VirtualDomElements.Div,
}

const imageWithoutAlt = {
  childCount: 0,
  src: icon,
  type: VirtualDomElements.Img,
}

const invalidAriaProperty = {
  ariaActiveDescendant: id,
  childCount: 0,
  type: VirtualDomElements.Div,
}

const invalidAriaValue = {
  ariaLive: 'loud',
  childCount: 0,
  type: VirtualDomElements.Div,
}

const unnamedButton = {
  childCount: 0,
  type: VirtualDomElements.Button,
}

const positiveTabIndex = {
  childCount: 0,
  tabIndex: 2,
  type: VirtualDomElements.Div,
}

const literalClassName = {
  childCount: 0,
  className: 'Button',
  type: VirtualDomElements.Div,
}

const rawEventId = {
  ariaLabel: label,
  childCount: 0,
  onClick: 1,
  type: VirtualDomElements.Button,
}

const missingChildCount = {
  type: VirtualDomElements.Span,
}

export const nodes = [
  imageWithoutAlt,
  invalidAriaProperty,
  invalidAriaValue,
  invalidEvent,
  invalidTextProperty,
  literalClassName,
  missingChildCount,
  nullishAttribute,
  positiveTabIndex,
  rawEventId,
  unnamedButton,
]
