import mongoose from 'mongoose';

const PASSWORD_MIN_LENGTH = 8;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxLength: 40,
    },
    email: {
      type: String,
      required: true,
      minLength: 2,
    },
    password: {
      type: String,
      minLength: PASSWORD_MIN_LENGTH,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export interface IUser extends mongoose.Schema {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export default mongoose.model<IUser>('User', userSchema);
