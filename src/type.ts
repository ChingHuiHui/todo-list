export enum STATUS {
  DEFAULT,
  COMPLETED,
}

export interface Todo {
  id: string
  content: string
  status?: STATUS
}
