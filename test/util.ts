import { execa } from 'execa'
import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '../')

const hasError = (file) => {
  return file.errorCount > 0
}

const parseFile = (fixturesPath: string, file: any, name: string): readonly any[] => {
  const fixturesUri = pathToFileURL(fixturesPath).toString()
  const uri = pathToFileURL(file.filePath).toString()
  const relative = uri.slice(fixturesUri.length + 1 + name.length + 1)
  console.log({ fixturesUri, uri, relative })
  const parsed: any[] = []
  for (const message of file.messages) {
    parsed.push({
      filePath: `${relative}:${message.line}`,
      message: message.message,
    })
  }
  return parsed
}

const parseResult = (fixturePath: string, result: any): readonly any[] => {
  const parsed: any[] = []
  for (const file of result) {
    if (!hasError(file)) {
      continue
    }
    parsed.push(...parseFile(fixturePath, file))
  }
  return parsed
}

export const runFixture = async (name: string) => {
  const fixturePath = join(root, 'packages', 'e2e', 'fixtures', name)
  await execa(`npm`, ['run', 'lint:ci'], {
    cwd: fixturePath,
    reject: false,
  })
  const resultFilePath = join(fixturePath, 'result.json')
  const expectedJsonPath = join(fixturePath, 'expected.json')
  const expectedJsonContent = await readFile(expectedJsonPath, 'utf-8')
  const expected = JSON.parse(expectedJsonContent)
  const resultContent = await readFile(resultFilePath, 'utf-8')
  const resultJson = JSON.parse(resultContent)
  const parsed = parseResult(fixturePath, resultJson)
  return { parsed, expected }
}
