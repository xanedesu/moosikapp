import request from 'supertest';
import { expect } from 'chai';
import Bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/mongodb/models/user.model';

describe('login', () => {
  beforeEach(async () => {
    await (new UserModel({
      username: 'testuser2',
      email: 'testuser2@domain.com',
      password: await Bcrypt.hash('supersecretpassword', 10),
    })).save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ username: 'testuser2' });
  });

  it('should return Status-Code 200 and correct body if user logged in', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser2',
        password: 'supersecretpassword',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end((err, res) => {
        expect(res.body.message).to.eq('Successfully logged in.');
        expect(res.body.token).to.be.a('string');
        expect(res.body.refreshToken).to.be.a('string');

        done();
      });
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send('string-instead-json')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Invalid body provided.' }, done);
  });

  it('should return Status-Code 400 and correct body if no username provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        password: 'supersecretpassword',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Username required.' }, done);
  });

  it('should return Status-Code 400 and correct body if no password provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser2',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Password required.' }, done);
  });

  it('should return Status-Code 403 and correct body if nonexistent account data provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'nonexistent-testuser',
        password: 'supersecretpassword',
      })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'This account has been deactivated.' }, done);
  });

  it('should return Status-Code 401 and correct body if invalid password provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser2',
        password: 'invalidpassword',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Invalid authorization.' }, done);
  });
});
