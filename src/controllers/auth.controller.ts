import BaseController from './base.controller';

import { Auth } from '../models';

class AuthController extends BaseController {
  constructor() {
    super(Auth);
  }

  // async login() {}
  // async signup() {}
  // async logout() {}
  // async refresh() {}
  // async forgotPassword() {}
  // async verifyEmail() {}
}

const authController = new AuthController();

export default authController;
