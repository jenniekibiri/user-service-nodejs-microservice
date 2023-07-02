import axios, { Method } from "axios";
export class UserService {
  static async request(method: Method, url: string, data: {}, cookie: string) {
    let headers = {};
    if (cookie !== "") {
      headers = {
        Cookie: `jwt=${cookie}`,
      };
    }
    try {
      const response = await axios({
        method,
        url,
        baseURL: process.env.USERS_MS + "/api",
        headers,
        data,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
}
