'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import RefinamentoTab from '@/components/projects/RefinamentoTab'
import { MOCK_PROJECTS } from '@/lib/mock-data'
import { type ProjectStatus, STATUS_LABELS, STATUS_STEPS } from '@/types'
import { getStatusColor } from '@/lib/utils'

/* ── Briefing ─────────────────────────────────────────────── */

function BriefingTab() {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(
    'Precisamos de um sistema para gerenciar agendamentos de clínicas médicas. O paciente deve conseguir marcar consultas online, receber confirmação por e-mail e lembrete 24h antes. O médico precisa visualizar a agenda do dia e bloquear horários quando necessário. Também é importante ter um painel para a secretária confirmar, remarcar ou cancelar consultas.'
  )
  const [draft, setDraft] = useState(text)

  const save = () => { setText(draft); setEditing(false) }
  const cancel = () => { setDraft(text); setEditing(false) }

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#374151]">Briefing recebido</h3>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Editar
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={8}
            autoFocus
            className="w-full rounded-lg border border-[#3B82F6] bg-white px-4 py-3 text-sm text-[#111827] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF]">{draft.length} caracteres</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={cancel}>Cancelar</Button>
              <Button size="sm" onClick={save}>Salvar</Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#6B7280] leading-relaxed bg-[#F8FAFC] rounded-lg p-4 border border-[#E5E7EB]">
          {text}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recebido em 10 mar 2024 às 10:00
      </div>
    </Card>
  )
}

const MOCK_BRIEFING = 'Precisamos de um sistema para gerenciar agendamentos de clínicas médicas. O paciente deve conseguir marcar consultas online, receber confirmação por e-mail e lembrete 24h antes. O médico precisa visualizar a agenda do dia e bloquear horários quando necessário. Também é importante ter um painel para a secretária confirmar, remarcar ou cancelar consultas.'

/* ── Especificação ────────────────────────────────────────── */

interface Story {
  id: string
  title: string
  description: string
  criteria: string[]
}

const INITIAL_STORIES: Story[] = [
  {
    id: 'US-01',
    title: 'Agendamento online pelo paciente',
    description: 'Como paciente, quero agendar uma consulta médica online para evitar ligar para a clínica.',
    criteria: [
      'Paciente pode selecionar especialidade, médico, data e horário disponível',
      'Sistema deve exibir apenas horários não ocupados',
      'Confirmação deve ser enviada por e-mail em até 2 minutos',
      'Agendamento só é confirmado após validação do convênio (se aplicável)',
    ],
  },
  {
    id: 'US-02',
    title: 'Lembrete automático de consulta',
    description: 'Como paciente, quero receber um lembrete 24h antes da consulta para não esquecer.',
    criteria: [
      'Notificação enviada por e-mail e SMS 24h antes',
      'Mensagem deve conter data, horário, médico e endereço da clínica',
      'Paciente pode confirmar ou cancelar diretamente pelo link do lembrete',
    ],
  },
  {
    id: 'US-03',
    title: 'Gestão da agenda pelo médico',
    description: 'Como médico, quero visualizar minha agenda diária e bloquear horários para controlar minha disponibilidade.',
    criteria: [
      'Médico visualiza agenda em formato diário, semanal e mensal',
      'Pode bloquear intervalos de tempo com justificativa',
      'Recebe notificação para novos agendamentos em tempo real',
      'Pode visualizar dados básicos do paciente antes da consulta',
    ],
  },
]

function StoryCard({ story, index, onUpdate, onDelete }: {
  story: Story
  index: number
  onUpdate: (s: Story) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(story)
  const [newCriteria, setNewCriteria] = useState('')

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(story); setEditing(false) }

  const updateCriteria = (i: number, val: string) =>
    setDraft(d => ({ ...d, criteria: d.criteria.map((c, ci) => ci === i ? val : c) }))

  const removeCriteria = (i: number) =>
    setDraft(d => ({ ...d, criteria: d.criteria.filter((_, ci) => ci !== i) }))

  const addCriteria = () => {
    if (!newCriteria.trim()) return
    setDraft(d => ({ ...d, criteria: [...d.criteria, newCriteria.trim()] }))
    setNewCriteria('')
  }

  if (editing) {
    return (
      <Card padding="md" className="space-y-4 border-[#3B82F6]/40 ring-1 ring-[#3B82F6]/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded">{story.id}</span>
          <input
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            placeholder="Título da história"
            autoFocus
            className="flex-1 text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#374151] mb-1 block">Descrição</label>
          <textarea
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            rows={2}
            className="w-full text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#374151] mb-2 block">Critérios de aceite</label>
          <div className="space-y-2">
            {draft.criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <input
                  value={c}
                  onChange={e => updateCriteria(i, e.target.value)}
                  className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button onClick={() => removeCriteria(i)} className="text-[#EF4444] hover:text-red-600 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <input
                value={newCriteria}
                onChange={e => setNewCriteria(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCriteria()}
                placeholder="Adicionar critério (Enter)"
                className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
          <button onClick={onDelete} className="text-xs text-[#EF4444] hover:underline">
            Excluir história
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>Cancelar</Button>
            <Button size="sm" onClick={save}>Salvar</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="md" className="space-y-3 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded">{story.id}</span>
          <h3 className="font-semibold text-[#111827] text-sm">{story.title}</h3>
        </div>
        <button
          onClick={() => { setDraft(story); setEditing(true) }}
          className="text-[#9CA3AF] hover:text-[#1D4ED8] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-[#6B7280] italic">"{story.description}"</p>

      <div>
        <p className="text-xs font-semibold text-[#374151] mb-2">Critérios de aceite:</p>
        <ul className="space-y-1.5">
          {story.criteria.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
              <svg className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function EspecificacaoTab() {
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES)
  const [addingNew, setAddingNew] = useState(false)
  const [newStory, setNewStory] = useState<Omit<Story, 'id'>>({ title: '', description: '', criteria: [] })
  const [newCriteria, setNewCriteria] = useState('')

  const updateStory = (index: number, s: Story) =>
    setStories(prev => prev.map((st, i) => i === index ? s : st))

  const deleteStory = (index: number) =>
    setStories(prev => prev.filter((_, i) => i !== index))

  const addNewCriteria = () => {
    if (!newCriteria.trim()) return
    setNewStory(s => ({ ...s, criteria: [...s.criteria, newCriteria.trim()] }))
    setNewCriteria('')
  }

  const saveNew = () => {
    if (!newStory.title.trim()) return
    const id = `US-${String(stories.length + 1).padStart(2, '0')}`
    setStories(prev => [...prev, { id, ...newStory }])
    setNewStory({ title: '', description: '', criteria: [] })
    setNewCriteria('')
    setAddingNew(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">{stories.length} histórias de usuário</p>
        <Button variant="outline" size="sm" onClick={() => setAddingNew(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova história
        </Button>
      </div>

      {stories.map((story, i) => (
        <StoryCard
          key={story.id}
          story={story}
          index={i}
          onUpdate={s => updateStory(i, s)}
          onDelete={() => deleteStory(i)}
        />
      ))}

      {addingNew && (
        <Card padding="md" className="space-y-4 border-[#3B82F6]/40 ring-1 ring-[#3B82F6]/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded">
              US-{String(stories.length + 1).padStart(2, '0')}
            </span>
            <input
              value={newStory.title}
              onChange={e => setNewStory(s => ({ ...s, title: e.target.value }))}
              placeholder="Título da história"
              autoFocus
              className="flex-1 text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#374151] mb-1 block">Descrição</label>
            <textarea
              value={newStory.description}
              onChange={e => setNewStory(s => ({ ...s, description: e.target.value }))}
              rows={2}
              placeholder='Como [ator], quero [ação] para [benefício].'
              className="w-full text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#374151] mb-2 block">Critérios de aceite</label>
            <div className="space-y-2">
              {newStory.criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="flex-1 text-sm text-[#374151]">{c}</span>
                  <button
                    onClick={() => setNewStory(s => ({ ...s, criteria: s.criteria.filter((_, ci) => ci !== i) }))}
                    className="text-[#EF4444] hover:text-red-600 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <input
                  value={newCriteria}
                  onChange={e => setNewCriteria(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNewCriteria()}
                  placeholder="Adicionar critério (Enter)"
                  className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" onClick={() => { setAddingNew(false); setNewStory({ title: '', description: '', criteria: [] }); setNewCriteria('') }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={saveNew} disabled={!newStory.title.trim()}>
              Adicionar história
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

/* ── Documentação ─────────────────────────────────────────── */

interface DocSection {
  id: string
  title: string
  content: string
  type: 'text' | 'list' | 'grid'
  items?: string[]
}

const INITIAL_DOC: DocSection[] = [
  {
    id: 'overview',
    title: 'Visão geral do sistema',
    type: 'text',
    content: 'O sistema de agendamento para clínicas médicas é uma plataforma web responsiva que permite o gerenciamento completo de consultas entre pacientes, médicos e equipe administrativa. A solução suporta múltiplos convênios e fornece notificações automatizadas em diferentes canais.',
  },
  {
    id: 'modules',
    title: 'Módulos principais',
    type: 'grid',
    content: '',
    items: ['Portal do Paciente', 'Painel do Médico', 'Central Administrativa', 'Motor de Notificações'],
  },
  {
    id: 'rules',
    title: 'Regras de negócio',
    type: 'list',
    content: '',
    items: [
      'Agendamento só é confirmado após validação do convênio ou pagamento antecipado',
      'Cancelamentos com menos de 2h de antecedência geram notificação especial para secretaria',
      'Médico pode bloquear agenda com no mínimo 30 minutos de antecedência',
      'Notificações de lembrete são enviadas automaticamente às 08h do dia anterior',
    ],
  },
]

function DocSectionBlock({ section, onUpdate }: { section: DocSection; onUpdate: (s: DocSection) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section)
  const [newItem, setNewItem] = useState('')

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(section); setEditing(false) }

  const updateItem = (i: number, val: string) =>
    setDraft(d => ({ ...d, items: d.items?.map((it, idx) => idx === i ? val : it) }))

  const removeItem = (i: number) =>
    setDraft(d => ({ ...d, items: d.items?.filter((_, idx) => idx !== i) }))

  const addItem = () => {
    if (!newItem.trim()) return
    setDraft(d => ({ ...d, items: [...(d.items ?? []), newItem.trim()] }))
    setNewItem('')
  }

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        {editing ? (
          <input
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            className="text-sm font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        ) : (
          <h3 className="text-sm font-semibold text-[#374151]">{section.title}</h3>
        )}
        {!editing ? (
          <button
            onClick={() => { setDraft(section); setEditing(true) }}
            className="text-[#9CA3AF] hover:text-[#1D4ED8] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>Cancelar</Button>
            <Button size="sm" onClick={save}>Salvar</Button>
          </div>
        )}
      </div>

      {section.type === 'text' && (
        editing ? (
          <textarea
            value={draft.content}
            onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
            rows={4}
            autoFocus
            className="w-full text-sm text-[#6B7280] leading-relaxed border border-[#3B82F6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 resize-none"
          />
        ) : (
          <p className="text-sm text-[#6B7280] leading-relaxed">{section.content}</p>
        )
      )}

      {section.type === 'grid' && (
        editing ? (
          <div className="space-y-2">
            {draft.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={e => updateItem(i, e.target.value)}
                  className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button onClick={() => removeItem(i)} className="text-[#EF4444] hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Adicionar módulo (Enter)"
                className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {section.items?.map(m => (
              <div key={m} className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] flex-shrink-0" />
                <span className="text-sm text-[#374151] font-medium">{m}</span>
              </div>
            ))}
          </div>
        )
      )}

      {section.type === 'list' && (
        editing ? (
          <div className="space-y-2">
            {draft.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0">{i + 1}</span>
                <input
                  value={item}
                  onChange={e => updateItem(i, e.target.value)}
                  className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button onClick={() => removeItem(i)} className="text-[#EF4444] hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#9CA3AF] text-xs flex items-center justify-center font-semibold flex-shrink-0">+</span>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Adicionar regra (Enter)"
                className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {section.items?.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">{i + 1}</span>
                {r}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}

function DocumentacaoTab() {
  const [sections, setSections] = useState<DocSection[]>(INITIAL_DOC)

  return (
    <Card padding="lg" className="space-y-6">
      {sections.map((section, i) => (
        <div key={section.id}>
          <DocSectionBlock
            section={section}
            onUpdate={s => setSections(prev => prev.map((sec, idx) => idx === i ? s : sec))}
          />
          {i < sections.length - 1 && <div className="border-t border-[#F1F5F9] mt-6" />}
        </div>
      ))}
    </Card>
  )
}

/* ── Manual ───────────────────────────────────────────────── */

interface ManualSection {
  id: string
  title: string
  steps: string[]
}

const INITIAL_MANUAL: ManualSection[] = [
  {
    id: 's1',
    title: '1. Como agendar uma consulta',
    steps: [
      'Acesse o portal e clique em "Agendar Consulta"',
      'Selecione a especialidade médica desejada',
      'Escolha o médico e visualize os horários disponíveis',
      'Selecione a data e horário de sua preferência',
      'Informe os dados do convênio ou escolha pagamento particular',
      'Confirme o agendamento — você receberá um e-mail de confirmação',
    ],
  },
  {
    id: 's2',
    title: '2. Como cancelar ou remarcar',
    steps: [
      'Acesse "Minhas Consultas" no menu principal',
      'Localize a consulta que deseja alterar',
      'Clique em "Cancelar" ou "Remarcar"',
      'Para remarcar, selecione a nova data e horário',
      'Cancele com pelo menos 2 horas de antecedência para evitar cobranças',
    ],
  },
]

function ManualSectionBlock({ section, onUpdate, onDelete }: {
  section: ManualSection
  onUpdate: (s: ManualSection) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section)
  const [newStep, setNewStep] = useState('')

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(section); setEditing(false) }

  const updateStep = (i: number, val: string) =>
    setDraft(d => ({ ...d, steps: d.steps.map((s, si) => si === i ? val : s) }))

  const removeStep = (i: number) =>
    setDraft(d => ({ ...d, steps: d.steps.filter((_, si) => si !== i) }))

  const addStep = () => {
    if (!newStep.trim()) return
    setDraft(d => ({ ...d, steps: [...d.steps, newStep.trim()] }))
    setNewStep('')
  }

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        {editing ? (
          <input
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            className="text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        ) : (
          <h4 className="text-sm font-semibold text-[#111827]">{section.title}</h4>
        )}
        {!editing ? (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setDraft(section); setEditing(true) }} className="text-[#9CA3AF] hover:text-[#1D4ED8]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button onClick={onDelete} className="text-[#9CA3AF] hover:text-[#EF4444]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>Cancelar</Button>
            <Button size="sm" onClick={save}>Salvar</Button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          {draft.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">{i + 1}</span>
              <input
                value={step}
                onChange={e => updateStep(i, e.target.value)}
                className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button onClick={() => removeStep(i)} className="text-[#EF4444] hover:text-red-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#F1F5F9] text-[#9CA3AF] text-xs flex items-center justify-center font-semibold flex-shrink-0">+</span>
            <input
              value={newStep}
              onChange={e => setNewStep(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addStep()}
              placeholder="Adicionar passo (Enter)"
              className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>
      ) : (
        <ol className="space-y-1.5">
          {section.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
              <span className="w-5 h-5 rounded bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function ManualTab() {
  const [sections, setSections] = useState<ManualSection[]>(INITIAL_MANUAL)
  const [addingSection, setAddingSection] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const addSection = () => {
    if (!newTitle.trim()) return
    const n = sections.length + 1
    setSections(prev => [...prev, { id: `s${n}`, title: `${n}. ${newTitle.trim()}`, steps: [] }])
    setNewTitle('')
    setAddingSection(false)
  }

  return (
    <Card padding="lg" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#374151]">Manual do Usuário</h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Versão 1.0 — Gerado automaticamente pelo SpecFlow</p>
        </div>
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar PDF
        </Button>
      </div>

      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={section.id}>
            <ManualSectionBlock
              section={section}
              onUpdate={s => setSections(prev => prev.map((sec, idx) => idx === i ? s : sec))}
              onDelete={() => setSections(prev => prev.filter((_, idx) => idx !== i))}
            />
            {i < sections.length - 1 && <div className="border-t border-[#F1F5F9] mt-5" />}
          </div>
        ))}
      </div>

      {addingSection ? (
        <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9]">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSection()}
            placeholder="Título da nova seção"
            autoFocus
            className="flex-1 text-sm text-[#374151] border border-[#3B82F6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
          <Button size="sm" onClick={addSection} disabled={!newTitle.trim()}>Adicionar</Button>
          <Button variant="ghost" size="sm" onClick={() => { setAddingSection(false); setNewTitle('') }}>Cancelar</Button>
        </div>
      ) : (
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1D4ED8] transition-colors pt-2 border-t border-[#F1F5F9] w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar seção
        </button>
      )}
    </Card>
  )
}

/* ── Main page ────────────────────────────────────────────── */

const TABS: { id: ProjectStatus | 'briefing'; label: string }[] = [
  { id: 'briefing', label: 'Briefing' },
  { id: 'refinement', label: 'Refinamento' },
  { id: 'specification', label: 'Especificação' },
  { id: 'documentation', label: 'Documentação' },
  { id: 'manual', label: 'Manual' },
]

export default function ProjetoPage() {
  const router = useRouter()
  const params = useParams()
  const project = MOCK_PROJECTS.find(p => p.id === params.id) ?? MOCK_PROJECTS[0]
  const [activeTab, setActiveTab] = useState<string>(project.status === 'done' ? 'briefing' : project.status)
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(project.status)
  const [projectName, setProjectName] = useState(project.name)
  const [projectDesc, setProjectDesc] = useState(project.description)

  // Edit modal
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState(project.name)
  const [editDesc, setEditDesc] = useState(project.description)

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false)

  const currentTabIndex = TABS.findIndex(t => t.id === activeTab)
  const statusIndex = STATUS_STEPS.indexOf(projectStatus)

  const advanceStep = () => {
    const nextTab = TABS[currentTabIndex + 1]
    const nextStatus = nextTab ? (nextTab.id as ProjectStatus) : 'done'
    setProjectStatus(nextStatus)
    if (nextTab) setActiveTab(nextTab.id)
  }

  const saveEdit = () => {
    if (!editName.trim()) return
    setProjectName(editName.trim())
    setProjectDesc((editDesc ?? '').trim())
    setShowEdit(false)
  }

  const confirmDelete = () => {
    router.push('/projetos')
  }

  return (
    <div className="flex flex-col flex-1">

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEdit(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#111827]">Editar projeto</h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Nome do projeto</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Descrição <span className="text-[#9CA3AF] font-normal">(opcional)</span></label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowEdit(false)}>Cancelar</Button>
              <Button size="sm" onClick={saveEdit} disabled={!editName.trim()}>Salvar alterações</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">Apagar projeto?</h3>
                <p className="text-sm text-[#6B7280]">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-[#374151] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
              O projeto <span className="font-semibold">"{projectName}"</span> e todo seu conteúdo serão removidos permanentemente.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancelar</Button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 text-sm font-medium text-white bg-[#EF4444] hover:bg-red-600 rounded-lg transition-colors"
              >
                Sim, apagar projeto
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        title={projectName}
        subtitle={projectDesc}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/projetos">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Projetos
              </Button>
            </Link>
            <button
              onClick={() => { setEditName(projectName); setEditDesc(projectDesc); setShowEdit(true) }}
              className="p-1.5 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              title="Editar projeto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
              title="Apagar projeto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            <Badge className={getStatusColor(projectStatus)}>{STATUS_LABELS[projectStatus]}</Badge>
          </div>
        }
      />

      {/* Progress strip */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3">
        <div className="flex items-center gap-3 mb-2">
          {STATUS_STEPS.filter(s => s !== 'done').map((step, i) => {
            const idx = STATUS_STEPS.indexOf(step)
            const isDone = idx < statusIndex || projectStatus === 'done'
            const isCurrent = idx === statusIndex && projectStatus !== 'done'
            return (
              <div key={step} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isDone ? 'bg-[#10B981] text-white' : isCurrent ? 'bg-[#1E3A8A] text-white' : 'bg-[#F1F5F9] text-[#9CA3AF]'
                  }`}>
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-xs font-medium truncate ${isCurrent ? 'text-[#1E3A8A]' : isDone ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.filter(s => s !== 'done').length - 1 && (
                  <div className={`flex-1 h-px ${isDone ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="w-full bg-[#F1F5F9] rounded-full h-1">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] transition-all duration-500"
            style={{ width: `${projectStatus === 'done' ? 100 : Math.round((statusIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB] px-6">
        <div className="flex items-center gap-1">
          {TABS.map(tab => {
            const tabIdx = STATUS_STEPS.indexOf(tab.id as ProjectStatus)
            const isDone = tabIdx !== -1 && tabIdx < statusIndex
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-[#6B7280] hover:text-[#374151] hover:border-[#D1D5DB]'
                }`}
              >
                {isDone && (
                  <svg className="w-3 h-3 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'briefing' && <BriefingTab />}
        {activeTab === 'refinement' && <RefinamentoTab briefing={MOCK_BRIEFING} />}
        {activeTab === 'specification' && <EspecificacaoTab />}
        {activeTab === 'documentation' && <DocumentacaoTab />}
        {activeTab === 'manual' && <ManualTab />}

        <div className="mt-8 flex items-center justify-between border-t border-[#F1F5F9] pt-6">
          <div>
            {currentTabIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setActiveTab(TABS[currentTabIndex - 1].id)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {TABS[currentTabIndex - 1].label}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentTabIndex < TABS.length - 1 && (
              <Button variant="outline" size="sm" onClick={() => setActiveTab(TABS[currentTabIndex + 1].id)}>
                {TABS[currentTabIndex + 1].label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            )}
            {(() => {
              const tabStatus = STATUS_STEPS.indexOf(activeTab as ProjectStatus)
              const isCurrentStep = tabStatus === statusIndex
              const isAlreadyDone = tabStatus < statusIndex
              const isFutureStep = tabStatus > statusIndex
              const isLastTab = currentTabIndex === TABS.length - 1
              const currentTabForStatus = TABS.find(t => t.id === projectStatus)

              if (isAlreadyDone) return (
                <span className="flex items-center gap-1.5 text-sm text-[#10B981] font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Etapa concluída
                </span>
              )
              if (isCurrentStep) return (
                <Button size="sm" onClick={advanceStep}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {isLastTab ? 'Concluir projeto' : 'Concluir etapa'}
                </Button>
              )
              if (isFutureStep && currentTabForStatus) return (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#9CA3AF]">
                    Etapa atual: <span className="font-medium text-[#374151]">{currentTabForStatus.label}</span>
                  </span>
                  <Button size="sm" onClick={() => setActiveTab(currentTabForStatus.id)}>
                    Ir para etapa atual
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Button>
                </div>
              )
              return null
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
