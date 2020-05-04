import request from 'supertest';
import { expect } from 'chai';
import JWT from 'jsonwebtoken';

import app from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import RefreshTokenModel from '../src/server/mongodb/models/refreshToken.model';

const { JWT_SECRET } = process.env;

let refreshToken: string;

describe('refresh token', () => {
  beforeEach(async () => {
    await (
      new UserModel({
        _id: 'testuser5-uuid',
        username: 'testuser5',
        email: 'testuser5@domain.tld',
        password: 'supersecretpassword',
      })
    ).save();

    const { _id: id } = await (new RefreshTokenModel({ userId: 'testuser5-uuid' })).save();

    const refreshTokenPayload = {
      userId: 'testuser5-uuid',
      id,
    };

    refreshToken = JWT.sign(refreshTokenPayload, String(JWT_SECRET));
  });

  afterEach(async () => {
    await UserModel.deleteOne({ username: 'testuser5' });

    await RefreshTokenModel.deleteMany({ userId: 'testuser5-uuid' });
  });

  it('should return Status-Code 200 and correct body if tokens successfully refreshed', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(200);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.accessToken).to.be.a('string');
    expect(res.body.refreshToken).to.be.a('string');
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken });

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 400 and correct body if invalid refresh token provided', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken: 'invalid-refresh-token' })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid refresh token provided.');
  });

  it('should return Status-Code 400 and correct body if refresh token expired', async () => {
    await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Refresh token expired.');
  });

  it('should return Status-Code 400 and correct body if trying to refresh tokens for deactivated user', async () => {
    await UserModel.deleteOne({ _id: 'testuser5-uuid' });

    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Trying to get pair of tokens for deactivated user.');
  });
});
