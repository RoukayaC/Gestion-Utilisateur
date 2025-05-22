
export interface User {
  id?: number;
  name: string;
  email: string;
  // Changed from Role[] to string[]
  roles: string[];
  active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roles: string[];
}
