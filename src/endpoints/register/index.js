import Crypto from 'crypto';
import Uuid from 'uuid';
import { createUser } from '../../apis/mongodb/users';


export default function () {
  return async (req, res) => {
    if (!req.body) {
      req.status(400).send({ message: 'No body provided.' });
    }

    const { email, username, password } = req.body;
    if (!email || !/^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(email)) {
      res.status(400).send({ message: 'Invalid e-mail address provided.' });
      return;
    }

    const salt = Crypto.randomBytes(16).toString('hex');
    const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

    try {
      const user = await createUser({
        uuid: Uuid(),
        username,
        email,
        password: `${salt}.${hash}`,
      });
      res.status(200).send({ message: 'You have successfully created a new account.', id: user.uuid });
    } catch (e) {
      if (e.errmsg.startsWith('E11000')) {
        res.status(400).send({ message: 'An account with that email address and/or username already exists.' });
        return;
      }
      res.status(500).send();
    }
  };
}
