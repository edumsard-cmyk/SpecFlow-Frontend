import { redirect } from 'next/navigation'
import SettingsPageShell from '@/components/configuracoes/SettingsPageShell'
import { getSettingsPageData } from '@/lib/data/settings-page'

export default async function ConfiguracoesPage() {
  const data = await getSettingsPageData()
  if (!data) redirect('/login')

  return <SettingsPageShell data={data} />
}
