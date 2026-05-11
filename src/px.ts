#!/usr/bin/env node

import { interactiveMode } from './cli';
import { dispatch } from './router';
import { loadProjects } from './store';

const args = process.argv.slice(2);
const projects = loadProjects();

if (args.length === 0) interactiveMode(projects);
else dispatch(projects, args);
