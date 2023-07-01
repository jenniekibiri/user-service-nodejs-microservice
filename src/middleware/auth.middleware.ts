import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { MoreThanOrEqual, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const jwt = req.cookies["jwt"];

    const payload: any = verify(jwt, process.env.SECRET_KEY);
    console.log(payload);

    if (!payload) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    const user = await getRepository(User).findOne(payload.id);

    const userToken = await getRepository(Token).findOne({
      user_id: user.id,
      expired_at: MoreThanOrEqual(new Date()), // if expired_at is greater than than or equal to today then it is valid
    });

    if (!userToken) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    // const is_ambassador = req.path.indexOf('api/ambassador') >= 0;

    // if ((is_ambassador && payload.scope !== 'ambassador') || (!is_ambassador && payload.scope !== 'admin')) {
    //     return res.status(401).send({
    //         message: 'unauthorized'
    //     });
    // }

    req["user"] = user;

    next();
  } catch (e) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};
