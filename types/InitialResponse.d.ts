export interface Response {
  msg: string;
  info: Info;
  testCache: any[];
}

export interface Info {
  hooks: string;
  timeHash: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  stat: string;
}
