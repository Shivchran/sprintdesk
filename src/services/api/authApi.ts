import axios from "axios";

const AUTH_API_URL = "https://dummyjson.com/auth";

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${AUTH_API_URL}/login`,
    {
      username,
      password,
      expiresInMins: 30,
    }
  );

  return response.data;
}