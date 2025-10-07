export interface IMenu {
  name: string;
  path: string;
}

export interface IProfile {
  name: string;
  role: string;
  email: string;
  website: string;
  phone: string;
  location: string;
}

export interface ITodo {
  task: string;
  completed: boolean;
}
