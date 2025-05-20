export interface ActionHistory {
  id?: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  action: string;
  date: string;
  details: string;
}
