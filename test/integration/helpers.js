const supertest = require('supertest');
const chai = require('chai');
const app = require('./../../app');
const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};

global.app = app;
global.request = supertest(app);
global.chai = chai;