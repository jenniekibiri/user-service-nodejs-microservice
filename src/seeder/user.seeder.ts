import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/user.entity";

createConnection().then(async () => {
  //create old connection
  const oldConnection = await createConnection({
    name: "old",
    type: "mysql",
    host: "host.docker.internal",
    port: 33066,
    username: "root",
    password: "root",
    database: "ambassador",
    entities: [User],
  });
  const repository = getRepository(User);

  const users = await oldConnection.manager.find(User);

  for (let user of users) {
    await repository.save(user);
  }

  process.exit();
});
