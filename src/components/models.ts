export type Task = {
  id: number
  title: string
  description: string
  created_at: Date
  updated_at: Date
  finished_at: Date
  status: TaskStatus
  categories: Categories[]
}

type Categories = {
  id: number
  name: string
  task_id: number
  created_at: Date
  updated_at: Date
}

export type TaskStatus = 'pending' | 'in-progress' | 'finished'

export type CreateTask = Omit<
  Task,
  'id' | 'created_at' | 'updated_at' | 'finished_at' | 'categories'
> & {
  category_name: string
}
export type UpdateTask = Partial<
  Omit<Task, 'id' | 'created_at' | 'updated_at' | 'finished_at' | 'categories'>
>
