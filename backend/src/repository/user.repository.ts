import userModel, { IUser } from '../models/user.model';

export interface IOnBoardUserParams {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
}

export class UserRepository {
  private _model = userModel;

  async getUserByEmailId(email: string): Promise<IUser | null> {
    return this._model.findOne({ email });
  }

  async onBoardUser(params: IOnBoardUserParams): Promise<IUser> {
    const {
      firstName, lastName, email, role,
      password,
    } = params;

    return this._model.create({
      firstName, lastName,
      email, password,
    });
  }

  async getUserById(id: string) {
    return this._model.findById(id).select(' _id firstName lastName email createdAt updatedAt __v');
  }

}