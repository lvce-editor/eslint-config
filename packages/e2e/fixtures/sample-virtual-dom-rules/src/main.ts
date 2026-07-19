const rawTextChildren = [
  {
    childCount: 1,
    type: VirtualDomElements.Div,
  },
  'hello',
]

const invalidChildCount = [
  {
    childCount: 2,
    type: VirtualDomElements.Div,
  },
  text('hello'),
]

const rawType = {
  childCount: 0,
  type: 4,
}

const rawRole = {
  childCount: 0,
  role: 'button',
  type: VirtualDomElements.Div,
}

const rawAriaBoolean = {
  ariaModal: 'true',
  childCount: 0,
  type: VirtualDomElements.Div,
}

const rawTabIndex = {
  childCount: 0,
  tabIndex: 0,
  type: VirtualDomElements.Div,
}

const inlineHandler = {
  childCount: 0,
  onClick: function handleClick(): void {},
  type: VirtualDomElements.Button,
}

const emptyClassName = {
  childCount: 0,
  className: '',
  type: VirtualDomElements.Div,
}

const inlineStyle = {
  childCount: 0,
  style: 'color: red',
  type: VirtualDomElements.Div,
}

const objectAttribute = {
  childCount: 0,
  dataset: {},
  type: VirtualDomElements.Div,
}

const clickableDiv = {
  childCount: 0,
  onClick: DomEventListenerFunctions.HandleClick,
  type: VirtualDomElements.Div,
}

const emptyAria = {
  ariaDescription: '',
  childCount: 0,
  type: VirtualDomElements.Div,
}

const multiClassName = {
  childCount: 0,
  className: 'ListItem ListItemInvalid',
  type: VirtualDomElements.Div,
}

const getSearchResultClassName = (focused: boolean): string => {
  if (focused) {
    return ClassNames.TreeItem + ' ' + ClassNames.TreeItemActive
  }
  return ClassNames.TreeItem
}

export const nodes = [
  rawTextChildren,
  invalidChildCount,
  rawType,
  rawRole,
  rawAriaBoolean,
  rawTabIndex,
  inlineHandler,
  emptyClassName,
  inlineStyle,
  objectAttribute,
  clickableDiv,
  emptyAria,
  multiClassName,
  getSearchResultClassName,
]
