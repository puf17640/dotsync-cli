import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Synchronizer } from './synchronize';

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

    // check if project name has already been assigned - else create project

    const token = await getInputData(TokenInput, 'token');

    try {
      fs.writeFileSync(path.join(process.cwd(), '.sync'), JSON.stringify({ project, token }));
    } catch (e) {
      // handle file creation error and return message to user
    }

    console.log(
      '\n' +
        chalk.green('Successfully created .sync file! Be sure add it to your .gitignore!') +
        '\n' +
        chalk.underline(path.join(process.cwd(), '.gitignore') + '\n')
    );

    const sync = (await inquirer.prompt(SyncChoice))['sync'];
    if (sync) {
      Synchronizer.sync();
    }
  }
}

export { Initializer };
