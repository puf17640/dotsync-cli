const c = require('centra');

const API_URL = 'https://dotsync-webapp.vercel.app/api';

const getProjectExists = async (projectName) => {
  return c(`${API_URL}/project-exists`)
    .query('projectName', projectName)
    .send()
    .then((res) => res.json());
};

const getProject = async (projectName) => {
  return c(`${API_URL}/get-project`)
    .query('projectName', projectName)
    .send()
    .then((res) => res.json());
};

const initializeProject = async (projectName) => {
  return c(`${API_URL}/initialize-project`)
    .query('projectName', projectName)
    .send()
    .then((res) => res.json());
};

const updateData = async (projectName, encryptedData) => {
  return c(`${API_URL}/update-data`, 'POST')
    .body({ projectName, data: encryptedData })
    .send()
    .then((res) => res.json());
};

export const api = {
  getProjectExists,
  getProject,
  initializeProject,
  updateData,
};
