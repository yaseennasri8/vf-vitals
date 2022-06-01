import {  Request, Response, NextFunction } from "express";

export const pagination = async (response:any, req: Request, res : Response, next: NextFunction) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const skipPage = (Number(page) - 1) * Number(limit);

      const result = await response.limit(limit).skip(skipPage);

      res.status(200).json({
          data: result,
          currentPage: page,
          nextPage: +page +1,
          limit: limit
      })

    }
 