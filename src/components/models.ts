export type Task = {
  id: number
  title: string
  description: string
  created_at: Date
  updated_at: Date
  finished_at: Date
  status: TaskStatus
}

export type CreateTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'finished_at'>

enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Finished = 'finished',
}

export interface Meta {
  totalCount: number
}
