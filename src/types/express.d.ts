declare namespace Express {
  interface Request {
    id?: string;
    meta?: {
      user?: {
        _id: string;
        email: string;
      };
    };
  }
}
