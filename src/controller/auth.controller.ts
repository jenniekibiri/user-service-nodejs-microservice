import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";

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
