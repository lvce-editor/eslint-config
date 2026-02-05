import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { root } from './root.js'

const configPath = join(root, 'packages', 'plugin-github-actions', 'src', 'rules', 'config.ts')

interface GitHubRelease {
  tag_name: string
}

interface ActionUpdate {
  action: string
  from: string | null
  to: string
}

interface ActionsMap {
  [key: string]: string[]
}

const fetchLatestRelease = async (owner: string, repo: string): Promise<string | null> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Failed to fetch latest release for ${owner}/${repo}: ${response.status}`)
      return null
    }
    const data = (await response.json()) as GitHubRelease
    const tag = data.tag_name
    // Extract major version from tag (e.g., "v5.0.3" -> "v5")
    const majorMatch = tag.match(/^v(\d+)/)
    return majorMatch ? `v${majorMatch[1]}` : tag
  } catch (error) {
    console.warn(`Error fetching latest release for ${owner}/${repo}:`, (error as Error).message)
    return null
  }
}

const parseActionsFromConfig = (content: string): ActionsMap => {
  const actionsMatch = content.match(/export const actions = \{([^}]+)\}/s)
  if (!actionsMatch) {
    throw new Error('Could not find actions export in config.ts')
  }

  const actionsBlock = actionsMatch[1]
  const actionLines = actionsBlock.split('\n').filter((line) => line.trim() && !line.trim().startsWith('//'))

  const actions: ActionsMap = {}
  for (const line of actionLines) {
    const match = line.match(/'([^']+)':\s*\[([^\]]+)\]/)
    if (match) {
      const key = match[1]
      const values = match[2].match(/'[^']+'/g)?.map((v) => v.slice(1, -1)) || []
      actions[key] = values
    }
  }

  return actions
}

const updateActionVersion = (content: string, actionName: string, newVersion: string): string => {
  // Match the action line and capture the current version
  const regex = new RegExp(`('${actionName}':\\s*\\[)'${actionName}@v\\d+'(\\])`, 'g')
  return content.replace(regex, `$1'${actionName}@${newVersion}'$2`)
}

export const updateActionVersions = async (): Promise<void> => {
  console.log('Reading config.ts...')
  const content = await readFile(configPath, 'utf8')

  console.log('Parsing actions from config...')
  const actions = parseActionsFromConfig(content)

  let updatedContent = content
  const updates: ActionUpdate[] = []

  for (const [actionName, currentVersions] of Object.entries(actions)) {
    const [owner, repo] = actionName.split('/')
    if (!owner || !repo) {
      console.warn(`Invalid action name format: ${actionName}`)
      continue
    }

    console.log(`Checking ${actionName}...`)
    const latestTag = await fetchLatestRelease(owner, repo)

    if (!latestTag) {
      console.log(`  Skipped (no release found)`)
      continue
    }

    const currentVersion = currentVersions[0]
    const currentVersionMatch = currentVersion.match(/@(v\d+)/)
    const currentMajorVersion = currentVersionMatch ? currentVersionMatch[1] : null

    if (latestTag !== currentMajorVersion) {
      console.log(`  Updating from ${currentMajorVersion} to ${latestTag}`)
      updatedContent = updateActionVersion(updatedContent, actionName, latestTag)
      updates.push({ action: actionName, from: currentMajorVersion, to: latestTag })
    } else {
      console.log(`  Already up to date (${currentMajorVersion})`)
    }
  }

  if (updates.length > 0) {
    console.log('\nWriting updated config.ts...')
    await writeFile(configPath, updatedContent, 'utf8')
    console.log('\nUpdates applied:')
    for (const update of updates) {
      console.log(`  ${update.action}: ${update.from} -> ${update.to}`)
    }
  } else {
    console.log('\nNo updates needed. All actions are up to date.')
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateActionVersions().catch((error) => {
    console.error('Error updating action versions:', error)
    process.exit(1)
  })
}
