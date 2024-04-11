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
    try {
      await axios.delete(
        `http://localhost:3333/deleteUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    } catch (error) {
      console.error('Erro ao excluir conta:', error);
     
    }
  },


  editUserInfo: async (
    token: string,
    newName: string,
    newEmail: string,
    newPassword: string,
    newBirthDate: string,
    newGender: string,
    newCountry: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3333/updateUser",
        {
          newName,
          newEmail,
          newPassword,
          newBirthDate,
          newGender,
          newCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return true; 
      } else {
        throw new Error("Erro ao editar informações do usuário");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Erro desconhecido ao editar informações do usuário");
      }
    }
  },
});