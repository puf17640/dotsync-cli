import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Synchronizer } from './synchronize';
import { api } from '../helpers/api';

const ProjectInput = {
  type: 'input',
  name: 'project',
  message: 'Please give your project a name.',
};

const TokenInput = {
  type: 'input',
  name: 'token',
  message: 'Please input your encryption token.',
};

const getInputData = async (input, name) => {
  let value;
  do {
    value = (await inquirer.prompt(input))[name];
  } while (value.length === 0);
  return value;
};

const SyncChoice = {
  type: 'list',
  name: 'sync',
  message: 'Do you want to sync your .env now?',
  choices: [
    {
      name: 'Yes',
      value: true,
    },
    {
      name: 'No',
      value: false,
    },
  ],
};

class Initializer {
  static async initialize() {
    const project = await getInputData(ProjectInput, 'project');

    const { exists: projectExists } = await api.getProjectExists(project);

    const token = await getInputData(TokenInput, 'token');

    try {
      if (!projectExists) {
        const { success: initializeSuccess } = await api.initializeProject(project);
        console.log('\n' + chalk.green('Successfully initialized project!') + '\n');
      }
      fs.writeFileSync(path.join(process.cwd(), '.sync'), JSON.stringify({ project, token }));
      console.log(
        '\n' +
          chalk.green('Successfully created .sync file! Be sure add it to your .gitignore!') +
          '\n' +
          chalk.underline(path.join(process.cwd(), '.gitignore') + '\n')
      );
    } catch (e) {
      // handle file creation error and return message to user
    }

    const sync = (await inquirer.prompt(SyncChoice))['sync'];
    if (sync) {
      Synchronizer.sync();
    }
  }
}

export { Initializer };
