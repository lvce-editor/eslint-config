import { execa } from 'execa'
import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')

const hasError = (file: any): boolean => {
  return file.errorCount > 0
}

const parseFile = (file: any, fixturePath: string): readonly any[] => {
  const fixtureUri = pathToFileURL(fixturePath).toString()
  const uri = pathToFileURL(file.filePath).toString()
  const relative = uri.slice(fixtureUri.length + 1)
  const parsed: any[] = Array.from(file.messages, (message) => ({
    // @ts-ignore
    filePath: `${relative}:${message.line}`,
    // @ts-ignore
    message: message.message,
  }))
  return parsed
}

const parseResult = (fixturePath: string, result: any): readonly any[] => {
  const parsed: any[] = []
  for (const file of result) {
    if (!hasError(file)) {
      continue
    }
    parsed.push(...parseFile(file, fixturePath))
  }
  return parsed
}

export const runFixture = async (name: string): Promise<{ readonly expected: any; readonly parsed: readonly any[] }> => {
  const fixturePath = join(root, 'packages', 'e2e', 'fixtures', name)
  await execa(`npm`, ['run', 'lint:ci'], {
    cwd: join(fixturePath),
    reject: false,
  })
  const resultFilePath = join(fixturePath, 'result.json')
  const expectedJsonPath = join(fixturePath, 'expected.json')
  const expectedJsonContent = await readFile(expectedJsonPath, 'utf8')
  const expected = JSON.parse(expectedJsonContent)
  const resultContent = await readFile(resultFilePath, 'utf8')
  const resultJson = JSON.parse(resultContent)
  const parsed = parseResult(fixturePath, resultJson)
  return { expected, parsed }
}
