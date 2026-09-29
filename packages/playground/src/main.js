import { lintSource } from './lint.js'

const ruleSelect = document.querySelector('#rule')
const sourceInput = document.querySelector('#source')
const description = document.querySelector('#rule-description')
const diagnosticsList = document.querySelector('#diagnostics')
const resultCount = document.querySelector('#result-count')

const ruleOptions = await fetch('./rule-catalog.json').then((response) => response.json())

const setDescription = () => {
  const rule = ruleOptions.find(({ id }) => id === ruleSelect.value)
  description.textContent = rule?.description || ''
}

const renderDiagnostics = () => {
  diagnosticsList.replaceChildren()

  let diagnostics
  try {
    diagnostics = lintSource(sourceInput.value, ruleSelect.value)
  } catch (error) {
    resultCount.textContent = 'ESLint could not run'
    const item = document.createElement('li')
    item.className = 'error'
    item.textContent = error instanceof Error ? error.message : String(error)
    diagnosticsList.append(item)
    return
  }

  resultCount.textContent = `${diagnostics.length} ${diagnostics.length === 1 ? 'issue' : 'issues'}`

  if (!diagnostics.length) {
    const item = document.createElement('li')
    item.className = 'success'
    item.textContent = 'No issues found.'
    diagnosticsList.append(item)
    return
  }

  for (const diagnostic of diagnostics) {
    const item = document.createElement('li')
    item.className = diagnostic.fatal ? 'error' : ''
    const location = diagnostic.line ? `${diagnostic.line}:${diagnostic.column}` : 'Source'
    const rule = diagnostic.ruleId ? `${diagnostic.ruleId}: ` : ''
    item.textContent = `${location} ${rule}${diagnostic.message}`
    diagnosticsList.append(item)
  }
}

for (const { id } of ruleOptions) {
  const option = document.createElement('option')
  option.value = id
  option.textContent = id
  ruleSelect.append(option)
}

ruleSelect.value = 'no-alert'
ruleSelect.addEventListener('change', () => {
  setDescription()
  renderDiagnostics()
})
sourceInput.addEventListener('input', renderDiagnostics)
setDescription()
renderDiagnostics()
