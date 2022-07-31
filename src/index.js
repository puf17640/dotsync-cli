import { Initializer, Synchronizer } from './cli';
import inquirer from 'inquirer';

const CommandChoice = {
  type: 'list',
  name: 'command',
  message: 'What do you want to do?',
  choices: [
    {
      name: 'Sync my .env',
      value: 'sync',
    },
    {
      name: 'Initialize a project',
      value: 'init',
    },
  ],
};

const requireCommand = () => {
  inquirer.prompt(CommandChoice).then(({ command }) => {
    switch (command) {
      case 'sync':
        Synchronizer.sync();
        break;
      case 'init':
        Initializer.initialize();
        break;
      default:
        process.exit(-1);
    }
  });
};

requireCommand();
