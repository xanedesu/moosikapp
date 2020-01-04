import Mongoose, { Schema } from 'mongoose';
import UUID from 'uuid';

import roles from '../../../config/roles.json';

const schema = new Schema({
  _id: {
    type: String,
    default: UUID.v4,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: roles.user,
  },
}, { id: false, versionKey: false, timestamps: true });

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const { _id, ...data } = ret;

    return { ...data, uuid: _id };
  },
});

export default Mongoose.model('user', schema);