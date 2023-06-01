import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  const { password, password_confirm, ...body } = req.body;
  // The microservice validates the password
  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  //save the user to the user table
  const user = await getRepository(User).save({
    ...body,
    password: await bcryptjs.hash(password, 10),
  });

  //  Remove user password from response
  delete user.password;

  res.send(user);
};

export const Login = async (req: Request, res: Response) => {
  const user = await getRepository(User).findOne(
    { email: req.body.email },
    {
      select: ["id", "password"],
    }
  );

  if (!user) {
    return res.status(400).send({
      message: "invalid credentials!",
    });
  }

  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "invalid credentials!",
    });
  }

  const jwt = sign(
    {
      id: user.id,
      scope: req.body.scope,
    },
    process.env.SECRET_KEY
  );

  res.send({ jwt });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  res.send(req["user"]);
};
