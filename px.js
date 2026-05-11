#!/usr/bin/env node

const { loadProjects } = require('./px/store');
const { interactiveMode } = require('./px/cli');
const { dispatch } = require('./px/router');

const args = process.argv.slice(2);
const projects = loadProjects();

if (args.length === 0) interactiveMode(projects);
else dispatch(projects, args);
