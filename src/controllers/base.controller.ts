import type { Model } from 'mongoose';
import type { Request, Response } from 'express';
import argon2 from 'argon2';
import _ from 'lodash';

import logger from '../logs/logger';
import jwtUtils from '../utils/jwt.utils';
import appRegistry from '../app.registry';
import appBroker from '../app.broker';

class BaseController {
  model: Model<any>;
  logger: typeof logger;
  jwt: typeof jwtUtils;
  registry: typeof appRegistry;
  hashStrategy: {
    hash: typeof argon2.hash;
    verify: typeof argon2.verify;
  };
  _: typeof _;
  broker: typeof appBroker;
  listeners?(): void;

  constructor(model: Model<any>) {
    this.model = model;
    this.logger = logger;
    this.jwt = jwtUtils;
    this.registry = appRegistry;
    this.hashStrategy = {
      hash: argon2.hash,
      verify: argon2.verify,
    };
    this._ = _;
    this.broker = appBroker;

    if (typeof this.listeners === 'function') this.listeners();
  }

  async create(req: Request, res: Response) {
    try {
      if ('meta' in req && req.meta?.user) {
        req.body.userId = req.meta.user._id;
      }

      const body = req.body;
      const newDoc = new this.model(body);
      const savedDoc = await newDoc.save();
      return res.status(201).json({
        message: 'Document created successfully',
        data: savedDoc,
      });
    } catch (error) {
      this.logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async list(req: Request, res: Response) {
    try {
      // const q = req.query
      // const { page = 1, limit = 10, ...filters } = q;

      const docs = await this.model.find();
      res.status(200).json({
        message: 'Documents retrieved successfully',
        data: docs,
        total: docs.length,
      });
    } catch (error) {
      this.logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async getById(req: Request, res: Response) {
    try {
      res.send('NOT IMPLEMENTED');
    } catch (error) {
      this.logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async update(req: Request, res: Response) {
    try {
      res.send('NOT IMPLEMENTED');
    } catch (error) {
      this.logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      res.send('NOT IMPLEMENTED');
    } catch (error) {
      this.logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default BaseController;
