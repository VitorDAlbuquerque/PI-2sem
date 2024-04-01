import axios from "axios";

export const useBackendApi = () => ({
  auth: async (email: string, password: string) => {
    const response = await axios.post(`http://localhost:3333/auth`, {
      email,
      password,
    });
    return {
      user: response.data.userExists,
      token: response.data.token,
    };
  },
  validateAuth: async (token: string) => {
    const response = await axios.get("http://localhost:3333/validateAuth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      user: response.data,
    };
  },
  logout: async () => {
    return {
      status: true,
    };
  },

  createNewUser: async (
    name: string,
    email: string,
    password: string,
    birthDate: string,
    gender: string,
    country: string,
  ) => {
    const response = await axios.post("http://localhost:3333/createNewUser", {
      name,
      email,
      password,
      birthDate,
      gender,
      country,
    });

    return {
      user: response.data.newUser,
      token: response.data.token,
    };
  },

  deleteUsers: async (token: string) => {
    await axios.post(
      `http://localhost:3333/deleteUsers`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },})
