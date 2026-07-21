import BaseController from "./base.controller";
import { User } from "../models";

class UsersController extends BaseController {
  constructor() {
    super(User);
  }
}

const usersController = new UsersController();

export default usersController;
