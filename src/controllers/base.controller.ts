import type { Model } from 'mongoose';
import type { Request, Response } from 'express';

import logger from '../logs/logger';

class BaseController {
  model: Model<any>;
  logger: typeof logger;

  constructor(model: Model<any>) {
    this.model = model;
    this.logger = logger;
  }

  async create(req: Request, res: Response) {
    try {
      const body = req.body;
      const newDoc = new this.model(body);
      const savedDoc = await newDoc.save();
      res.status(201).json({
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
