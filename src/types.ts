export interface User {
  name: string;
  id: string;
}

export interface Message {
  id: string;
  text: string;
  user: User;
  timestamp: number;
}
