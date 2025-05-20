import { Role } from "./role.model";

export interface User {
  id?: number;
  name: string;
  email: string;
  roles: Role[];
  active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roles: string[];
}
