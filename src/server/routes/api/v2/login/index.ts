import { Request, Response, RequestHandler } from 'express';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { BadRequest, Unauthorized, Forbidden } from 'http-errors';
import { getAuthPayloadByUsernameOrEmail } from '../../../../mongodb/users';
import { createTokens } from '../../../../utils/tokens';

const loginScheme = Joi.object({
  username: Joi.string()
    .required()
    .error(new Error('Username required.')),
  password: Joi.string()
    .required()
    .error(new Error('Password required.')),
});

export default (): RequestHandler => (
  async (req: Request, res: Response) => {
    const { error, value } = loginScheme.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { username, password } = <{ username: string, password: string }>value;

    const authPayload = await getAuthPayloadByUsernameOrEmail(username);
    if (!authPayload) {
      throw new Forbidden('This account has been deactivated.');
    }

    if (!(await Bcrypt.compare(password, authPayload.password))) {
      throw new Unauthorized('Invalid authorization.');
    }

    const tokens = await createTokens(authPayload);
    res.status(200).send({ message: 'Successfully logged in.', ...tokens });
  }
);
