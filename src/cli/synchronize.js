import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Initializer } from './initialize';
import { api } from '../helpers/api';
import { Readable } from 'stream';

const safeMergeFiles = require('safe-merge-files');
const CryptoJS = require('crypto-js');

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
      const envLocation = path.join(process.cwd(), '.env');

      if (config.project && config.token) {
        const { project } = await api.getProject(config.project);

        const decryptedEnv = project.data
          ? CryptoJS.AES.decrypt(project.data, config.token).toString(CryptoJS.enc.Utf8)
          : undefined;

        if (fs.existsSync(envLocation)) {
          const { mtime: envLastModified } = fs.statSync(envLocation);
          const localNewer = new Date(project['updated_at']) < new Date(envLastModified);

          if (localNewer) {
            const encryptedEnv = CryptoJS.AES.encrypt(fs.readFileSync(envLocation).toString(), config.token).toString();

            const { success: updateSuccess } = await api.updateData(config.project, encryptedEnv);

            console.log('success: ' + updateSuccess);
          } else {
            // merge incoming and local env with safe-merge-files and output info to user
            const tmpLocation = path.join(process.cwd(), '.tmp.env');
            fs.writeFileSync(tmpLocation, decryptedEnv);
            const mergeResult = safeMergeFiles.Sync(envLocation, tmpLocation, {
              outputFile: envLocation,
            });
            console.log(mergeResult);
            switch (mergeResult) {
              case 0:
                // no change
                break;
              case 1:
                // no conflict
                break;
              case -1:
                // resolve conflict
                break;
            }
            fs.unlinkSync(tmpLocation);
          }
        } else {
          // save incoming env file
          if (decryptedEnv) {
            fs.writeFileSync(envLocation, decryptedEnv);
          } else {
            // prompt user to create .env file and sync
          }
        }
      } else {
        // invalid config
      }
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
