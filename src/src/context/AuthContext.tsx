import { useBackendApi } from "@/api/useBackendApi";
import { createContext, useState, useEffect } from "react";

interface AuthContextProps {
    user: UserProps | null;
    signin: (username: string, password: string) => Promise<boolean>
    signout: () => void
}
  
interface UserProps {
    id:        String,
    name:      String,
    username: boolean,
    password:  String,
}

export const LoginContext = createContext<AuthContextProps>(null!);

export const AuthProvider = ({children}: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProps | null>(null)

    const api = useBackendApi();

    useEffect(() => {
        const validateToken = async ()=> {
            const storageData = localStorage.getItem('authToken')
            if(storageData){          
                const data = await api.validateAuth(storageData);
                if(data.user){
                  setUser(data.user)
                }
            }
        }
        validateToken();
    }, [])

    const signin = async (username: string, password: string) => {
        const data = await api.auth(username, password);
        if(data?.user){
          setUser(data.user)
          setToken(data.token)
          return true
        }
        return false 
    }

    const signout = async () => {
        await api.logout();
        setUser(null)
        setToken('')
      }

    const setToken = (token: string) => {
        localStorage.setItem('authToken', token)
    }

    return(
        <LoginContext.Provider value={{ user, signin, signout }}>
          {children}
        </LoginContext.Provider>
    );
}