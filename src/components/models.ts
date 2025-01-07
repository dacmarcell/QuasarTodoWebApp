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
export type UpdateTask = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'finished_at'>>

export type TaskStatus = 'pending' | 'in-progress' | 'finished'

export interface Meta {
  totalCount: number
}
