export interface Session {
  id?: string;
  username: string;
  password: string;
}

export interface ISession {
  users: Session[];
}
