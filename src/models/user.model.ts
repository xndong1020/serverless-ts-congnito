import * as dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { UserRole } from "src/interfaces/user.interface";

class User extends Item {
  PK: string; // User#{sub}
  SK: string; // #
  GSI1PK: string; // User -> query all users
  GSI1SK: string; // createTime number
  name?: string;
  email?: string;
  username?: string;
  defaultProvider?: string;
  role?: UserRole;
}

const schema = new dynamoose.Schema(
  {
    PK: {
      type: String,
      hashKey: true,
    },
    SK: {
      type: String,
      rangeKey: true,
    },
    GSI1PK: String, // User -> query all users
    GSI1SK: String, // createTime number
    name: String,
    email: String,
    username: String,
    defaultProvider: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

const UsersModel = dynamoose.model<User>(
  "serverless-todo-users-table-dev",
  schema,
  {
    create: false,
    throughput: {
      read: 1,
      write: 1,
    },
  }
);

export default UsersModel;
