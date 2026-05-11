#!/usr/bin/env node

import { interactiveMode } from './cli';
import { dispatch } from './router';
import { loadState } from './store';

const args = process.argv.slice(2);
const state = loadState();

if (args.length === 0) void interactiveMode(state);
else dispatch(state, args);
