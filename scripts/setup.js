#!/usr/bin/env node

/**
 * Firebase Template Setup Script
 *
 * Prompts for port configuration and performs simple find-replace across
 * specified files. Tracks previous values in .setup-config.json for re-runnability.
 *
 * Usage: npm run setup
 */

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')

// Configuration file path
const CONFIG_FILE = path.join(__dirname, '../.setup-config.json')

// Default port values
const DEFAULTS = {
  ui: 3010,
  api: 5010,
  firestoreEmulator: 8410,
  authEmulator: 9410,
}

// Port validation ranges
const PORT_RANGES = {
  ui: { min: 3010, max: 3100 },
  api: { min: 5010, max: 5100 },
  firestoreEmulator: { min: 8410, max: 8500 },
  authEmulator: { min: 9410, max: 9500 },
}

// Which files contain which ports (for targeted replacements)
const FILE_PORT_MAPPING = {
  'firebase.json': ['authEmulator', 'api', 'firestoreEmulator'],
  'src/fire/index.js': ['authEmulator', 'firestoreEmulator'],
  'package.json': ['ui', 'api'],
  'vite.config.js': ['ui'],
  'scripts/seedEmulators.js': ['authEmulator', 'firestoreEmulator'],
}

/**
 * Load existing configuration if it exists
 */
function loadExistingConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
      return config
    } catch (err) {
      console.log(
        chalk.yellow('⚠️  Could not read existing config, using defaults')
      )
      return null
    }
  }
  return null
}

/**
 * Save configuration to file
 */
function saveConfig(ports) {
  const config = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    ports,
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

/**
 * Validate port number is within allowed range
 */
function validatePort(portType) {
  return value => {
    const num = parseInt(value, 10)
    const range = PORT_RANGES[portType]
    if (isNaN(num)) {
      return 'Please enter a valid number'
    }
    if (num < range.min || num > range.max) {
      return `Port must be between ${range.min} and ${range.max}`
    }
    return true
  }
}

/**
 * Prompt user for port configuration
 */
async function promptForPorts(existingConfig) {
  const defaults = existingConfig?.ports || DEFAULTS

  console.log(chalk.blue.bold('\n🚀 Firebase Template Setup Script\n'))

  if (existingConfig) {
    console.log(chalk.green('✓ Found existing configuration'))
    console.log(
      chalk.gray(
        `  Last updated: ${new Date(
          existingConfig.lastUpdated
        ).toLocaleString()}\n`
      )
    )
    console.log(chalk.cyan('Current ports:'))
    console.log(chalk.gray(`  • UI: ${defaults.ui}`))
    console.log(chalk.gray(`  • API: ${defaults.api}`))
    console.log(
      chalk.gray(`  • Firestore Emulator: ${defaults.firestoreEmulator}`)
    )
    console.log(chalk.gray(`  • Auth Emulator: ${defaults.authEmulator}\n`))
  }

  const answers = await inquirer.prompt([
    {
      type: 'number',
      name: 'ui',
      message: 'UI Port (3010-3100):',
      default: defaults.ui,
      validate: validatePort('ui'),
    },
    {
      type: 'number',
      name: 'api',
      message: 'API/Functions Port (5010-5100):',
      default: defaults.api,
      validate: validatePort('api'),
    },
    {
      type: 'number',
      name: 'firestoreEmulator',
      message: 'Firestore Emulator Port (8410-8500):',
      default: defaults.firestoreEmulator,
      validate: validatePort('firestoreEmulator'),
    },
    {
      type: 'number',
      name: 'authEmulator',
      message: 'Auth Emulator Port (9410-9500):',
      default: defaults.authEmulator,
      validate: validatePort('authEmulator'),
    },
  ])

  return answers
}

/**
 * Replace port values in files using simple string replacement
 */
function replaceInFiles(newPorts, oldPorts) {
  console.log(chalk.blue('\n📝 Updating files...\n'))

  const filesChanged = []

  for (const [filePath, portTypes] of Object.entries(FILE_PORT_MAPPING)) {
    const absolutePath = path.join(__dirname, '..', filePath)

    try {
      let content = fs.readFileSync(absolutePath, 'utf8')
      let changed = false

      // Replace each port type in this file
      for (const portType of portTypes) {
        const oldPort = oldPorts[portType]
        const newPort = newPorts[portType]

        if (oldPort && oldPort !== newPort) {
          // Simple string replacement - replace all occurrences of old port with new port
          const regex = new RegExp(oldPort.toString(), 'g')
          if (regex.test(content)) {
            content = content.replace(regex, newPort.toString())
            changed = true
          }
        }
      }

      if (changed) {
        fs.writeFileSync(absolutePath, content)
        filesChanged.push(filePath)
        console.log(chalk.green(`  ✓ ${filePath}`))
      } else {
        console.log(chalk.gray(`  - ${filePath} (no changes)`))
      }
    } catch (err) {
      console.log(chalk.red(`  ✗ ${filePath}: ${err.message}`))
    }
  }

  return filesChanged
}

/**
 * Display success summary
 */
function showSummary(ports, filesChanged) {
  console.log(chalk.green.bold('\n🎉 Setup Complete!\n'))
  console.log(chalk.cyan('Your configuration:'))
  console.log(chalk.gray(`  • UI Port: ${ports.ui}`))
  console.log(chalk.gray(`  • API Port: ${ports.api}`))
  console.log(chalk.gray(`  • Firestore Emulator: ${ports.firestoreEmulator}`))
  console.log(chalk.gray(`  • Auth Emulator: ${ports.authEmulator}`))

  if (filesChanged.length > 0) {
    console.log(chalk.blue(`\n✓ Updated ${filesChanged.length} file(s)`))
  }

  console.log(chalk.blue('\nNext steps:'))
  console.log(chalk.gray('  1. npm run start:functions:emulators'))
  console.log(
    chalk.gray('  2. npm run seed:emulators:init (in another terminal)')
  )
  console.log(
    chalk.gray('  3. npm run start:emulators (in another terminal)\n')
  )
}

/**
 * Main execution
 */
async function main() {
  try {
    const existingConfig = loadExistingConfig()
    const newPorts = await promptForPorts(existingConfig)

    // Use existing ports as "old" values, or defaults if first run
    const oldPorts = existingConfig?.ports || DEFAULTS

    const filesChanged = replaceInFiles(newPorts, oldPorts)
    saveConfig(newPorts)

    showSummary(newPorts, filesChanged)
  } catch (err) {
    console.error(chalk.red('\n❌ Setup failed:'), err.message)
    process.exit(1)
  }
}

main()
