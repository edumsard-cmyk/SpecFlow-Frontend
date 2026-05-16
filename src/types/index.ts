export type UserRole = 'admin' | 'company' | 'user'

export type ProjectStatus = 'briefing' | 'refinement' | 'specification' | 'documentation' | 'manual' | 'done'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company_id?: string
  avatar?: string
}

export interface Company {
  id: string
  name: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  company_id: string
  created_by: string
  created_at: string
  status: ProjectStatus
  progress: number
}

export interface UserStory {
  id: string
  project_id: string
  title: string
  description: string
  acceptance_criteria: string[]
}

export interface Document {
  id: string
  project_id: string
  type: 'spec' | 'manual' | 'doc'
  content: string
  created_at: string
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  briefing: 'Briefing',
  refinement: 'Refinamento',
  specification: 'Especificação',
  documentation: 'Documentação',
  manual: 'Manual',
  done: 'Concluído',
}

export const STATUS_STEPS: ProjectStatus[] = [
  'briefing',
  'specification',
  'documentation',
  'manual',
  'refinement',
  'done',
]
