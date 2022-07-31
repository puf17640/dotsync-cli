import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Initializer } from './initialize';

const InitChoice = {
  type: 'list',
  name: 'init',
  message: 'Do you want to initialize a project now?',
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

class Synchronizer {
  static async sync() {
    const syncLocation = path.join(process.cwd(), '.sync');
    if (fs.existsSync(syncLocation)) {
      const config = JSON.parse(fs.readFileSync(syncLocation));
      console.log('sync: ' + JSON.stringify(config));
    } else {
      console.log('\n' + chalk.red('No .sync file found.') + '\n');

      const init = (await inquirer.prompt(InitChoice))['init'];
      if (init) {
        Initializer.initialize();
      }
    }
  }
}

export { Synchronizer };
