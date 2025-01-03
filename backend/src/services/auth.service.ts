import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encode, encryptionKey } from './crypto.service';
import { encodedJWTCacheManager, profileCacheManager } from './cache/entities';

class AuthService {
  constructor(private readonly _userRepository: UserRepository) {
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(params: { email: string, password: string }) {
    const { email, password } = params;
    const user = await this._userRepository.getUserByEmailId(email);
    if (!user) throw new NotFoundError('User not found');
    if (!user.password) throw new BadRequestError('Reset password');

    // check if password is valid;
    const success = await this.verifyHashPassword(password, user.password);
    if (!success) throw new UnauthorizedError('Invalid Email or Password');

    // generate JWT token;
    const accessToken = await this.generateJWTToken(user._id);
    if (!accessToken) throw new InternalServerError('Failed to generate accessToken');

    return { accessToken };
  }

  async verifyHashPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashPassword(plainTextPassword: string) {
    return await bcrypt.hash(plainTextPassword, 10);
  }

  async generateJWTToken(userId: string) {
    const token = jwt.sign({
      _id: userId.toString(),
    }, config.JWT_SECRET, { expiresIn: '24h' });

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encryptedData = await encode(token, key);
    await encodedJWTCacheManager.set({ userId }, encryptedData);

    return token;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async signup(params: any) {
    const { firstName, lastName, email, password } = params;
    const existingUser = await this._userRepository.getUserByEmailId(email);

    if (existingUser) throw new BadRequestError('Email address already exists');

    // get hashedPassword
    const hashedPassword = await this.hashPassword(password);

    // send this verificationCode via email to verify.
    const user = await this._userRepository.onBoardUser({
      firstName, lastName, email, password: hashedPassword
    });
    if (!user) throw new InternalServerError('Failed to Onboard user');

    // generate JWT Token
    const accessToken = await this.generateJWTToken(user._id);
    if (!accessToken) throw new InternalServerError('Failed to generate accessToken');

    return { accessToken };
  }

  async profile(userId: string) {
    const cached = await profileCacheManager.get({ userId });
    if (!cached) {
      const user = await this._userRepository.getUserById(userId);
      if (!user) throw new NotFoundError('User not found');

      // set cache;
      await profileCacheManager.set({ userId }, user);
      return user;
    }
    return cached;
  }


}

export default new AuthService(new UserRepository());