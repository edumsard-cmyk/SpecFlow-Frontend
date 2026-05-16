/** Limite de projetos por empresa no plano gratuito (alinhado à landing). */
export const FREE_PROJECT_LIMIT = 3

export const PROJECT_LIMIT_REACHED_CODE = 'PROJECT_LIMIT_REACHED' as const

export class ProjectLimitError extends Error {
  readonly code = PROJECT_LIMIT_REACHED_CODE

  constructor(
    public readonly used: number,
    public readonly limit: number
  ) {
    super(
      `Limite de ${limit} projetos atingido (${used}/${limit}). Apague um projeto existente ou entre em contacto para ampliar o plano.`
    )
    this.name = 'ProjectLimitError'
  }
}

export type ProjectQuota = {
  limit: number
  used: number
  remaining: number
  canCreate: boolean
  /** Administradores da plataforma não entram no limite por empresa. */
  isUnlimited: boolean
}
