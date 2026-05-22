'use client'

import { useState, useEffect, useTransition, useMemo, useCallback, type Dispatch, type SetStateAction } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import BriefingOriginalSource, {
  type BriefingMediaInfo,
} from '@/components/projects/BriefingOriginalSource'
import GuidedImagesBriefingView from '@/components/projects/GuidedImagesBriefingView'
import RefinamentoTab from '@/components/projects/RefinamentoTab'
import ConclusaoTab from '@/components/projects/ConclusaoTab'
import ProjectExportButtons from '@/components/projects/ProjectExportButtons'
import ProjectNextSteps from '@/components/projects/ProjectNextSteps'
import StoryCommentsThread, { type StoryCommentRow } from '@/components/projects/StoryCommentsThread'
import { useI18n } from '@/components/i18n/I18nProvider'
import { type Locale } from '@/lib/i18n/dictionaries'
import { intlLocaleTag } from '@/lib/i18n/locale-format'
import { parseProjectConclusion } from '@/lib/conclusion/parse'
import {
  type ProjectConclusion,
  type ProjectStatus,
  STATUS_STEPS,
  normalizeWorkflowStatus,
} from '@/types'
import {
  defaultProjectTab,
  nextWorkflowStep,
  resolveWorkflowStatus,
} from '@/lib/projects/workflow-status'
import { getStatusColor } from '@/lib/utils'
import { updateProjectStatusAction, saveUserStoriesAction, saveDocumentAction, deleteProjectAction, saveBriefingContentAction, type StoryPayload } from '@/app/actions/projects'

/* ── Briefing ─────────────────────────────────────────────── */

function formatBriefingFooter(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso?.trim()) return null
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString(intlLocaleTag(locale), { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return null
  }
}

function BriefingTab({
  projectId,
  briefing,
  briefingInputType,
  briefingMedia,
  briefingCreatedAt,
  onBriefingSaved,
}: {
  projectId: string
  briefing: string | null
  briefingInputType?: 'text' | 'audio' | 'document' | 'form' | 'video' | 'images' | null
  briefingMedia?: BriefingMediaInfo | null
  briefingCreatedAt?: string | null
  onBriefingSaved?: (content: string) => void
}) {
  const { t, locale } = useI18n()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(() => briefing?.trim() ?? '')
  const [draft, setDraft] = useState(() => briefing?.trim() ?? '')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savePending, startSavePending] = useTransition()

  useEffect(() => {
    const next = briefing?.trim() ?? ''
    setText(next)
    setDraft(next)
  }, [briefing])

  const save = () => {
    setSaveError(null)
    startSavePending(async () => {
      const res = await saveBriefingContentAction(projectId, draft)
      if (res.error) {
        setSaveError(res.error)
        return
      }
      const trimmed = draft.trim()
      setText(trimmed)
      setEditing(false)
      onBriefingSaved?.(trimmed)
    })
  }

  const cancel = () => {
    setDraft(text)
    setSaveError(null)
    setEditing(false)
  }

  const footerLabel = formatBriefingFooter(briefingCreatedAt, locale)
  const isGuidedImages = briefingInputType === 'images'
  const showCompareLayout =
    !isGuidedImages &&
    !editing &&
    !!briefingMedia?.available &&
    (briefingMedia.kind === 'audio' ||
      briefingMedia.kind === 'video' ||
      briefingMedia.kind === 'document')

  const transcriptBlock = editing ? (
    <div className="space-y-3">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        rows={showCompareLayout ? 10 : 8}
        autoFocus
        className="w-full rounded-lg border border-[#3B82F6] bg-white px-4 py-3 text-sm text-[#111827] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9CA3AF]">
          {t('briefing.charCount').replace('{{n}}', String(draft.length))}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={cancel} disabled={savePending}>
            {t('common.cancel')}
          </Button>
          <Button size="sm" onClick={save} loading={savePending}>
            {!savePending && t('briefing.saveServer')}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-sm leading-relaxed bg-[#F8FAFC] rounded-lg p-4 border border-[#E5E7EB] min-h-[120px]">
      {text.trim() ? (
        <p className="text-[#374151] whitespace-pre-wrap">{text}</p>
      ) : (
        <p className="text-[#9CA3AF] italic">{t('briefing.emptyReadonly')}</p>
      )}
    </div>
  )

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#374151]">{t('briefing.receivedTitle')}</h3>
        {!editing && !isGuidedImages && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            {t('common.edit')}
          </Button>
        )}
      </div>

      {showCompareLayout ? (
        <p className="text-xs text-[#6B7280] leading-relaxed border border-[#DBEAFE] rounded-lg px-3 py-2 bg-[#EFF6FF]">
          {briefingMedia?.kind === 'video'
            ? t('briefing.compareHintVideo')
            : t('briefing.compareHint')}
        </p>
      ) : isGuidedImages ? (
        <p className="text-xs text-[#6B7280] leading-relaxed border border-[#E0E7FF] rounded-lg px-3 py-2 bg-[#EFF6FF]">
          {t('briefing.imagesHint')}
        </p>
      ) : (
        <p className="text-xs text-[#6B7280] leading-relaxed border border-[#E5E7EB] rounded-lg px-3 py-2 bg-[#F9FAFB]">
          {t('briefing.aiHint')}
        </p>
      )}

      {saveError && (
        <div role="alert" className="text-xs text-[#EF4444] px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          {saveError}
        </div>
      )}

      {showCompareLayout && briefingMedia ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] p-4 space-y-3">
            <p className="text-xs font-semibold text-[#1E3A8A]">
              {briefingMedia.kind === 'video'
                ? t('briefing.videoOriginal')
                : briefingMedia.kind === 'document'
                  ? t('briefing.documentOriginal')
                  : t('briefing.audioOriginal')}
            </p>
            <BriefingOriginalSource projectId={projectId} media={briefingMedia} compact />
            <a
              href={`/api/projects/${projectId}/briefing-media?download=1`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
              download
            >
              {t('briefing.downloadOriginal')}
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#374151]">{t('briefing.transcriptTitle')}</p>
            {transcriptBlock}
          </div>
        </div>
      ) : (
        <>
          {briefingMedia?.available && !editing ? (
            <BriefingOriginalSource projectId={projectId} media={briefingMedia} />
          ) : null}
          {!editing &&
          briefingMedia &&
          !briefingMedia.available &&
          (briefingInputType === 'video' ||
            briefingInputType === 'audio' ||
            briefingInputType === 'document') ? (
            <p className="text-xs text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2">
              {t('briefing.mediaUnavailable')}
            </p>
          ) : null}
          {isGuidedImages && text.trim() && !editing ? (
            <GuidedImagesBriefingView projectId={projectId} content={text} />
          ) : (
            transcriptBlock
          )}
        </>
      )}

      {editing && briefingMedia?.available ? (
        <div className="pt-2 border-t border-[#F1F5F9]">
          <p className="text-xs font-medium text-[#6B7280] mb-2">
            {briefingMedia.kind === 'video'
              ? t('briefing.videoOriginal')
              : briefingMedia.kind === 'document'
                ? t('briefing.documentOriginal')
                : t('briefing.audioOriginal')}
          </p>
          <BriefingOriginalSource projectId={projectId} media={briefingMedia} compact />
        </div>
      ) : null}

      {footerLabel ? (
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('briefing.savedAt').replace('{{date}}', footerLabel)}
        </div>
      ) : null}
    </Card>
  )
}
/* ── Especificação ────────────────────────────────────────── */

interface Story {
  id: string
  title: string
  description: string
  criteria: string[]
}

type StoryVoiceParts = { como: string; quero: string; para: string }

const EMPTY_STORY_VOICE: StoryVoiceParts = { como: '', quero: '', para: '' }

/** Lê descrição guardada (rotulada ou texto livre) para os três campos. */
function parseStoryDescription(description: string): StoryVoiceParts {
  const text = description.trim()
  if (!text) return { como: '', quero: '', para: '' }

  const hasLabels =
    /^como\s*:/im.test(text) ||
    /^quero\s*:/im.test(text) ||
    /^para\s*:/im.test(text) ||
    /\n\s*como\s*:/i.test(text) ||
    /\n\s*quero\s*:/i.test(text) ||
    /\n\s*para\s*:/i.test(text)

  if (!hasLabels) {
    const lineMatch = text.match(
      /^como\s+(.+?),\s*quero\s+(.+?)(?:,\s*para\s+(.+))?$/i
    )
    if (lineMatch) {
      return {
        como: lineMatch[1].trim(),
        quero: lineMatch[2].trim(),
        para: (lineMatch[3] ?? '').trim(),
      }
    }
    return { como: '', quero: text, para: '' }
  }

  const parts: StoryVoiceParts = { como: '', quero: '', para: '' }
  let mode: keyof StoryVoiceParts | null = null

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue

    let m = trimmed.match(/^como\s*:\s*(.*)$/i)
    if (m) {
      mode = 'como'
      parts.como = m[1].trim()
      continue
    }
    m = trimmed.match(/^quero\s*:\s*(.*)$/i)
    if (m) {
      mode = 'quero'
      parts.quero = m[1].trim()
      continue
    }
    m = trimmed.match(/^para\s*:\s*(.*)$/i)
    if (m) {
      mode = 'para'
      parts.para = m[1].trim()
      continue
    }

    if (mode) {
      parts[mode] = parts[mode] ? `${parts[mode]} ${trimmed}` : trimmed
    }
  }

  return parts
}

function serializeStoryVoiceParts(parts: StoryVoiceParts): string {
  const lines: string[] = []
  if (parts.como.trim()) lines.push(`Como: ${parts.como.trim()}`)
  if (parts.quero.trim()) lines.push(`Quero: ${parts.quero.trim()}`)
  if (parts.para.trim()) lines.push(`Para: ${parts.para.trim()}`)
  return lines.join('\n')
}

function StoryVoiceReadonly({ description }: { description: string }) {
  const { t } = useI18n()
  const { como, quero, para } = parseStoryDescription(description)
  const blocks = [
    {
      key: 'como' as const,
      label: t('spec.voiceLabel.como'),
      hint: t('spec.voiceHintReadonly.como'),
      color: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
      labelColor: 'text-[#1D4ED8]',
    },
    {
      key: 'quero' as const,
      label: t('spec.voiceLabel.quero'),
      hint: t('spec.voiceHintReadonly.quero'),
      color: 'bg-[#F5F3FF]',
      border: 'border-[#DDD6FE]',
      labelColor: 'text-[#5B21B6]',
    },
    {
      key: 'para' as const,
      label: t('spec.voiceLabel.para'),
      hint: t('spec.voiceHintReadonly.para'),
      color: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      labelColor: 'text-[#047857]',
    },
  ] as const

  const values = { como, quero, para }

  if (!como.trim() && !quero.trim() && !para.trim()) {
    return (
      <p className="text-sm text-[#9CA3AF] italic rounded-lg border border-dashed border-[#E5E7EB] px-4 py-3 bg-[#FAFAFA]">
        {t('spec.voiceEmpty')}
      </p>
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-1">
      {blocks.map(({ key, label, hint, color, border, labelColor }) => {
        const val = values[key].trim()
        if (!val) return null
        return (
          <div
            key={key}
            className={`rounded-xl border ${border} ${color} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${labelColor}`}>{label}</span>
              <span className="text-[10px] text-[#64748B] hidden sm:inline">{hint}</span>
            </div>
            <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{val}</p>
          </div>
        )
      })}
    </div>
  )
}

const voiceFieldClass =
  'w-full text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none min-h-[3rem] bg-white placeholder:text-[#9CA3AF]'

function StoryVoiceEditor({
  parts,
  onChange,
}: {
  parts: StoryVoiceParts
  onChange: (next: StoryVoiceParts) => void
}) {
  const { t } = useI18n()
  const rows = [
    {
      key: 'como' as const,
      label: t('spec.voiceLabel.como'),
      hint: t('spec.voiceHintEdit.como'),
      placeholder: t('spec.placeholder.como'),
      wrapClass: 'focus-within:ring-2 focus-within:ring-[#DBEAFE]/90 rounded-lg',
    },
    {
      key: 'quero' as const,
      label: t('spec.voiceLabel.quero'),
      hint: t('spec.voiceHintEdit.quero'),
      placeholder: t('spec.placeholder.quero'),
      wrapClass: 'focus-within:ring-2 focus-within:ring-[#EDE9FE]/90 rounded-lg',
    },
    {
      key: 'para' as const,
      label: t('spec.voiceLabel.para'),
      hint: t('spec.voiceHintEdit.para'),
      placeholder: t('spec.placeholder.para'),
      wrapClass: 'focus-within:ring-2 focus-within:ring-[#D1FAE5]/90 rounded-lg',
    },
  ]

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#64748B] leading-relaxed">
        {t('spec.editorIntro')}
      </p>
      <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-[#FAFBFC] divide-y divide-[#EEF2F6]">
        {rows.map(({ key, label, hint, placeholder, wrapClass }) => (
          <div key={key} className={`p-3 sm:p-4 ${wrapClass}`}>
            <label className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#111827]">{label}</span>
              <span className="text-[10px] sm:text-xs text-[#9CA3AF] font-normal">{hint}</span>
            </label>
            <textarea
              value={parts[key]}
              onChange={e => onChange({ ...parts, [key]: e.target.value })}
              rows={2}
              placeholder={placeholder}
              className={voiceFieldClass}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function titleFallbackFromVoice(parts: StoryVoiceParts, emptyLabel: string): string {
  const q = parts.quero.trim() || parts.como.trim() || parts.para.trim()
  if (!q) return emptyLabel
  return q.length <= 72 ? q : `${q.slice(0, 69)}…`
}

function StoryCard({ story, onUpdate, onDelete }: {
  story: Story
  onUpdate: (s: Story) => void
  onDelete: () => void
}) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(story)
  const [voiceParts, setVoiceParts] = useState<StoryVoiceParts>(() =>
    parseStoryDescription(story.description)
  )
  const [newCriteria, setNewCriteria] = useState('')

  useEffect(() => {
    setDraft(story)
    setVoiceParts(parseStoryDescription(story.description))
  }, [story])

  const openEdit = () => {
    setDraft(story)
    setVoiceParts(parseStoryDescription(story.description))
    setEditing(true)
  }

  const save = () => {
    const description = serializeStoryVoiceParts(voiceParts)
    if (!description.trim()) return
    onUpdate({
      ...draft,
      description,
    })
    setEditing(false)
  }

  const cancel = () => {
    setDraft(story)
    setVoiceParts(parseStoryDescription(story.description))
    setEditing(false)
  }

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
            placeholder={t('spec.titlePlaceholderLong')}
            autoFocus
            className="flex-1 text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>

        <StoryVoiceEditor parts={voiceParts} onChange={setVoiceParts} />

        <div>
          <label className="text-xs font-semibold text-[#374151] mb-2 block">{t('spec.acceptanceCriteria')}</label>
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
                <button type="button" onClick={() => removeCriteria(i)} className="text-[#EF4444] hover:text-red-600 flex-shrink-0">
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
                placeholder={t('spec.addCriterionPlaceholder')}
                className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
          <button type="button" onClick={onDelete} className="text-xs text-[#EF4444] hover:underline">
            {t('spec.deleteStory')}
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>{t('common.cancel')}</Button>
            <Button size="sm" onClick={save}>{t('common.save')}</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="md" className="space-y-3 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded flex-shrink-0">{story.id}</span>
          <h3 className="font-semibold text-[#111827] text-sm truncate">{story.title}</h3>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="text-[#9CA3AF] hover:text-[#1D4ED8] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={t('spec.editStoryAria')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
      </div>

      <StoryVoiceReadonly description={story.description} />

      <div>
        <p className="text-xs font-semibold text-[#374151] mb-2">{t('spec.acceptanceCriteria')}:</p>
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

function EspecificacaoTab({
  projectId,
  initialStories,
  storyComments,
  setStoryComments,
}: {
  projectId: string
  initialStories: Story[]
  storyComments: StoryCommentRow[]
  setStoryComments: Dispatch<SetStateAction<StoryCommentRow[]>>
}) {
  const { t } = useI18n()
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [addingNew, setAddingNew] = useState(false)
  const [newStory, setNewStory] = useState<Omit<Story, 'id'>>({ title: '', description: '', criteria: [] })
  const [newVoiceParts, setNewVoiceParts] = useState<StoryVoiceParts>(EMPTY_STORY_VOICE)
  const [newCriteria, setNewCriteria] = useState('')
  const [saved, setSaved] = useState(true)
  const [saving, startSaving] = useTransition()
  const [clearing, startClearing] = useTransition()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'stories', projectId }),
      })
      const json = await res.json()
      if (json.error) { setGenError(json.error); return }
      type AiStory = {
        code?: string
        id?: string
        title?: string
        description?: string
        criteria?: string[]
      }
      const raw = (json.data ?? []) as AiStory[]
      const normalized: Story[] = raw.map((s, i) => ({
        id: (typeof s.code === 'string' && s.code.trim() ? s.code.trim() : null)
          ?? (typeof s.id === 'string' && s.id.trim() ? s.id.trim() : null)
          ?? `US-${String(i + 1).padStart(2, '0')}`,
        title: typeof s.title === 'string' ? s.title : t('spec.storyFallbackAi'),
        description: serializeStoryVoiceParts(parseStoryDescription(typeof s.description === 'string' ? s.description : '')),
        criteria: Array.isArray(s.criteria) ? s.criteria.filter((c): c is string => typeof c === 'string') : [],
      }))
      setStories(normalized)
      setSaved(false)
    } catch {
      setGenError(t('spec.genError'))
    } finally {
      setGenerating(false)
    }
  }

  const updateStory = (index: number, s: Story) => {
    setStories(prev => prev.map((st, i) => i === index ? s : st))
    setSaved(false)
  }

  const deleteStory = (index: number) => {
    setStories(prev => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  const handleSave = () => {
    const payload: StoryPayload[] = stories.map(s => ({
      code: s.id,
      title: s.title,
      description: s.description,
      criteria: s.criteria,
    }))
    startSaving(async () => {
      await saveUserStoriesAction(projectId, payload)
      setSaved(true)
    })
  }

  const handleClearSpecification = () => {
    if (stories.length === 0) return
    if (
      !window.confirm(
        t('spec.confirmClear')
      )
    ) {
      return
    }
    setGenError('')
    startClearing(async () => {
      const result = await saveUserStoriesAction(projectId, [])
      if (result.error) {
        setGenError(result.error)
        return
      }
      setStories([])
      setSaved(true)
      setAddingNew(false)
      setNewVoiceParts(EMPTY_STORY_VOICE)
    })
  }

  const addNewCriteria = () => {
    if (!newCriteria.trim()) return
    setNewStory(s => ({ ...s, criteria: [...s.criteria, newCriteria.trim()] }))
    setNewCriteria('')
  }

  const saveNew = () => {
    const description = serializeStoryVoiceParts(newVoiceParts)
    if (!description.trim()) return
    const id = `US-${String(stories.length + 1).padStart(2, '0')}`
    const title = newStory.title.trim() || titleFallbackFromVoice(newVoiceParts, t('spec.newStoryFallback'))
    setStories(prev => [...prev, { id, title, description, criteria: newStory.criteria }])
    setNewStory({ title: '', description: '', criteria: [] })
    setNewVoiceParts(EMPTY_STORY_VOICE)
    setNewCriteria('')
    setAddingNew(false)
    setSaved(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-[#374151]">
            {stories.length === 1
              ? t('spec.countOne')
              : t('spec.countMany').replace('{{n}}', String(stories.length))}
          </p>
          <p className="text-xs text-[#64748B] max-w-xl leading-relaxed">
            {t('spec.legend')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {genError && <span className="text-xs text-[#EF4444]">{genError}</span>}
          <Button variant="outline" size="sm" onClick={handleGenerate} loading={generating}>
            {!generating && (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                {t('spec.generateAi')}
              </>
            )}
          </Button>
          {!saved && (
            <Button size="sm" onClick={handleSave} loading={saving}>
              {!saving && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {t('common.save')}
                </>
              )}
            </Button>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-xs text-[#10B981]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t('common.saved')}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewStory({ title: '', description: '', criteria: [] })
              setNewVoiceParts(EMPTY_STORY_VOICE)
              setNewCriteria('')
              setAddingNew(true)
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('spec.newStory')}
          </Button>
          {stories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626]"
              onClick={handleClearSpecification}
              loading={clearing}
            >
              {!clearing && t('spec.clearSpec')}
            </Button>
          )}
        </div>
      </div>

      {stories.length === 0 && !addingNew && (
        <Card padding="lg" className="border border-dashed border-[#E5E7EB] bg-[#F8FAFC]">
          <p className="text-sm text-[#6B7280] text-center leading-relaxed">
            {t('spec.emptyCard')}
          </p>
        </Card>
      )}

      {stories.map((story, i) => (
        <div key={story.id} className="space-y-0">
          <StoryCard
            story={story}
            onUpdate={s => updateStory(i, s)}
            onDelete={() => deleteStory(i)}
          />
          <StoryCommentsThread
            projectId={projectId}
            storyCode={story.id}
            comments={storyComments.filter(c => c.story_code === story.id)}
            onAdded={c => setStoryComments(prev => [...prev, c])}
            onDeleted={id => setStoryComments(prev => prev.filter(x => x.id !== id))}
          />
        </div>
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
              placeholder={t('spec.titlePlaceholderShort')}
              autoFocus
              className="flex-1 text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <StoryVoiceEditor parts={newVoiceParts} onChange={setNewVoiceParts} />

          <div>
            <label className="text-xs font-semibold text-[#374151] mb-2 block">{t('spec.acceptanceCriteria')}</label>
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
                  placeholder={t('spec.addCriterionPlaceholder')}
                  className="flex-1 text-sm text-[#374151] border border-dashed border-[#D1D5DB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAddingNew(false)
                setNewStory({ title: '', description: '', criteria: [] })
                setNewVoiceParts(EMPTY_STORY_VOICE)
                setNewCriteria('')
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={saveNew}
              disabled={!serializeStoryVoiceParts(newVoiceParts).trim()}
            >
              {t('spec.addStory')}
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

function createEmptyDocSection(type: DocSection['type'], title: string): DocSection {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  if (type === 'text') {
    return { id, title, type: 'text', content: '' }
  }
  return { id, title, type, content: '', items: [''] }
}

function normalizeDocSections(rows: DocSection[]): DocSection[] {
  return rows.map((s, i) => ({
    ...s,
    id:
      typeof s.id === 'string' && s.id.trim()
        ? s.id
        : `doc-${i}-${typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`,
  }))
}

function DocSectionBlock({
  section,
  onUpdate,
  onRemove,
  canRemove,
}: {
  section: DocSection
  onUpdate: (s: DocSection) => void
  onRemove?: () => void
  canRemove: boolean
}) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    if (!editing) setDraft(section)
  }, [section, editing])

  const save = () => {
    onUpdate(draft)
    setEditing(false)
    setNewItem('')
  }

  const cancel = () => {
    setDraft(section)
    setEditing(false)
    setNewItem('')
  }

  const updateItem = (i: number, val: string) =>
    setDraft(d => ({ ...d, items: d.items?.map((it, idx) => (idx === i ? val : it)) }))

  const removeItem = (i: number) =>
    setDraft(d => ({ ...d, items: d.items?.filter((_, idx) => idx !== i) }))

  const addItem = () => {
    if (!newItem.trim()) return
    setDraft(d => ({ ...d, items: [...(d.items ?? []), newItem.trim()] }))
    setNewItem('')
  }

  const changeDraftType = (type: DocSection['type']) => {
    setDraft(d => {
      if (type === 'text') {
        return { ...d, type, items: undefined, content: d.content ?? '' }
      }
      const prev = d.items?.filter(x => x.trim()) ?? []
      return {
        ...d,
        type,
        content: '',
        items: prev.length > 0 ? prev : [''],
      }
    })
  }

  const startEdit = () => {
    setDraft(section)
    setNewItem('')
    setEditing(true)
  }

  const modeType = editing ? draft.type : section.type

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]/50 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-[180px] space-y-2">
          {editing ? (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">
                  {t('doc.sectionTypeLabel')}
                </label>
                <select
                  value={draft.type}
                  onChange={e => changeDraftType(e.target.value as DocSection['type'])}
                  className="w-full max-w-xs text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="text">{t('doc.sectionTypeText')}</option>
                  <option value="list">{t('doc.sectionTypeList')}</option>
                  <option value="grid">{t('doc.sectionTypeGrid')}</option>
                </select>
              </div>
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                className="w-full text-base font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder={t('doc.newSectionTitle')}
              />
            </>
          ) : (
            <h3 className="text-base font-semibold text-[#111827] pr-2">{section.title}</h3>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!editing ? (
            <>
              <Button variant="outline" size="sm" type="button" onClick={startEdit}>
                {t('doc.editSection')}
              </Button>
              {canRemove && onRemove ? (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-[#DC2626] hover:text-red-700 hover:bg-red-50"
                  onClick={onRemove}
                >
                  {t('doc.deleteSection')}
                </Button>
              ) : null}
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={cancel}>
                {t('common.cancel')}
              </Button>
              <Button size="sm" type="button" onClick={save}>
                {t('common.save')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {modeType === 'text' &&
        (editing ? (
          <textarea
            value={draft.content}
            onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
            rows={6}
            className="w-full text-sm text-[#374151] leading-relaxed border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 resize-y min-h-[120px]"
            placeholder={t('doc.sectionBodyPlaceholder')}
          />
        ) : section.content.trim() ? (
          <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">{section.content}</p>
        ) : (
          <p className="text-sm text-[#9CA3AF] italic">{t('doc.emptyHint')}</p>
        ))}

      {modeType === 'grid' &&
        (editing ? (
          <div className="space-y-2">
            {draft.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={e => updateItem(i, e.target.value)}
                  className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder={t('doc.placeholderModule')}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg"
                  aria-label={t('common.delete')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder={t('doc.placeholderModule')}
                className="flex-1 min-w-[160px] text-sm text-[#374151] border border-dashed border-[#CBD5E1] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <Button variant="outline" size="sm" type="button" onClick={addItem}>
                {t('doc.addItemButton')}
              </Button>
            </div>
          </div>
        ) : section.items?.some(x => x.trim()) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.items?.filter(x => x.trim()).map((m, i) => (
              <div
                key={`${i}-${m}`}
                className="flex items-center gap-2 p-3 bg-white rounded-lg border border-[#E5E7EB]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] flex-shrink-0" />
                <span className="text-sm text-[#374151] font-medium">{m}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#9CA3AF] italic">{t('doc.emptyHint')}</p>
        ))}

      {modeType === 'list' &&
        (editing ? (
          <div className="space-y-2">
            {draft.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0">
                  {i + 1}
                </span>
                <input
                  value={item}
                  onChange={e => updateItem(i, e.target.value)}
                  className="flex-1 text-sm text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder={t('doc.placeholderRule')}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg"
                  aria-label={t('common.delete')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#9CA3AF] text-xs flex items-center justify-center font-semibold flex-shrink-0">
                +
              </span>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder={t('doc.placeholderRule')}
                className="flex-1 min-w-[160px] text-sm text-[#374151] border border-dashed border-[#CBD5E1] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <Button variant="outline" size="sm" type="button" onClick={addItem}>
                {t('doc.addItemButton')}
              </Button>
            </div>
          </div>
        ) : section.items?.some(x => x.trim()) ? (
          <ul className="space-y-2">
            {section.items?.filter(x => x.trim()).map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                <span className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-1">{r}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#9CA3AF] italic">{t('doc.emptyHint')}</p>
        ))}
    </div>
  )
}

function DocumentacaoTab({ projectId, initialContent }: { projectId: string; initialContent: DocSection[] | null }) {
  const { t } = useI18n()
  const [sections, setSections] = useState<DocSection[]>(() =>
    normalizeDocSections(initialContent ?? INITIAL_DOC),
  )
  const [saved, setSaved] = useState(initialContent !== null)
  const [saving, startSaving] = useTransition()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'doc', projectId }),
      })
      const json = await res.json()
      if (json.error) { setGenError(json.error); return }
      setSections(normalizeDocSections(json.data))
      setSaved(false)
    } catch {
      setGenError(t('doc.genError'))
    } finally {
      setGenerating(false)
    }
  }

  const handleUpdate = (i: number, s: DocSection) => {
    setSections(prev => prev.map((sec, idx) => idx === i ? s : sec))
    setSaved(false)
  }

  const handleAddSection = (type: DocSection['type']) => {
    setSections(prev => [...prev, createEmptyDocSection(type, t('doc.newSectionTitle'))])
    setSaved(false)
  }

  const handleRemoveSection = (index: number) => {
    if (!window.confirm(t('doc.confirmDeleteSection'))) return
    setSections(prev => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  const handleSave = () => {
    startSaving(async () => {
      await saveDocumentAction(projectId, 'doc', JSON.stringify(sections))
      setSaved(true)
    })
  }

  return (
    <Card padding="lg" className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#111827]">{t('doc.panelTitle')}</h2>
        <p className="text-sm text-[#6B7280] leading-relaxed">{t('doc.helpLead')}</p>
      </div>

      <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-4">
        <p className="text-xs font-semibold text-[#1E40AF] uppercase tracking-wide mb-3">
          {t('doc.helpBoxTitle')}
        </p>
        <ul className="text-sm text-[#1E3A8A] space-y-2.5 list-none">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="leading-snug pt-1">{t('doc.helpStep1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="leading-snug pt-1">{t('doc.helpStep2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="leading-snug pt-1">{t('doc.helpStep3')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold flex items-center justify-center">
              4
            </span>
            <span className="leading-snug pt-1">{t('doc.helpStep4')}</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#F1F5F9] pb-5">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={handleGenerate} loading={generating}>
              {!generating && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  {t('spec.generateAi')}
                </>
              )}
            </Button>
            <span className="hidden sm:inline text-[#E5E7EB] select-none">|</span>
            <Button variant="outline" size="sm" type="button" onClick={() => handleAddSection('text')}>
              {t('doc.addSectionText')}
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => handleAddSection('list')}>
              {t('doc.addSectionList')}
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => handleAddSection('grid')}>
              {t('doc.addSectionGrid')}
            </Button>
          </div>
          <p className="text-xs text-[#9CA3AF]">{t('doc.addSectionHint')}</p>
          {genError ? <p className="text-sm text-[#EF4444]">{genError}</p> : null}
        </div>
        <div className="flex-shrink-0">
          {!saved ? (
            <Button size="sm" type="button" onClick={handleSave} loading={saving}>
              {!saving && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {t('common.save')}
                </>
              )}
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-[#10B981]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t('common.saved')}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <DocSectionBlock
            key={section.id}
            section={section}
            onUpdate={s => handleUpdate(i, s)}
            canRemove={sections.length > 1}
            onRemove={sections.length > 1 ? () => handleRemoveSection(i) : undefined}
          />
        ))}
      </div>
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
  const { t } = useI18n()
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
            <Button variant="ghost" size="sm" onClick={cancel}>{t('common.cancel')}</Button>
            <Button size="sm" onClick={save}>{t('common.save')}</Button>
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
              placeholder={t('manual.placeholderStep')}
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

function ManualTab({ projectId, projectName, initialSections }: { projectId: string; projectName: string; initialSections: ManualSection[] | null }) {
  const { t } = useI18n()
  const [sections, setSections] = useState<ManualSection[]>(initialSections ?? INITIAL_MANUAL)
  const [addingSection, setAddingSection] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [saved, setSaved] = useState(initialSections !== null)
  const [saving, startSaving] = useTransition()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual', projectId }),
      })
      const json = await res.json()
      if (json.error) { setGenError(json.error); return }
      setSections(json.data)
      setSaved(false)
    } catch {
      setGenError(t('manual.genError'))
    } finally {
      setGenerating(false)
    }
  }

  const addSection = () => {
    if (!newTitle.trim()) return
    const n = sections.length + 1
    setSections(prev => [...prev, { id: `s${n}`, title: `${n}. ${newTitle.trim()}`, steps: [] }])
    setNewTitle('')
    setAddingSection(false)
    setSaved(false)
  }

  const handleSave = () => {
    startSaving(async () => {
      await saveDocumentAction(projectId, 'manual', JSON.stringify(sections))
      setSaved(true)
    })
  }

  return (
    <Card padding="lg" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#374151]">{t('manual.title')}</h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{t('manual.versionHint')}</p>
        </div>
        <div className="flex items-center gap-2">
          {genError && <span className="text-xs text-[#EF4444]">{genError}</span>}
          <Button variant="outline" size="sm" onClick={handleGenerate} loading={generating}>
            {!generating && (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                {t('spec.generateAi')}
              </>
            )}
          </Button>
          {!saved ? (
            <Button size="sm" onClick={handleSave} loading={saving}>
              {!saving && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {t('common.save')}
                </>
              )}
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-[#10B981]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t('common.saved')}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const { exportManualPDF } = await import('@/lib/export-pdf')
              exportManualPDF(projectName, sections)
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t('manual.exportPdf')}
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={section.id}>
            <ManualSectionBlock
              section={section}
              onUpdate={s => { setSections(prev => prev.map((sec, idx) => idx === i ? s : sec)); setSaved(false) }}
              onDelete={() => { setSections(prev => prev.filter((_, idx) => idx !== i)); setSaved(false) }}
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
            placeholder={t('manual.sectionTitlePlaceholder')}
            autoFocus
            className="flex-1 text-sm text-[#374151] border border-[#3B82F6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
          <Button size="sm" onClick={addSection} disabled={!newTitle.trim()}>{t('common.add')}</Button>
          <Button variant="ghost" size="sm" onClick={() => { setAddingSection(false); setNewTitle('') }}>{t('common.cancel')}</Button>
        </div>
      ) : (
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1D4ED8] transition-colors pt-2 border-t border-[#F1F5F9] w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t('manual.addSection')}
        </button>
      )}
    </Card>
  )
}

/* ── Main page ────────────────────────────────────────────── */

export default function ProjetoPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { t } = useI18n()

  const tabs = useMemo(
    (): { id: ProjectStatus | 'briefing'; label: string }[] => [
      { id: 'briefing', label: t('status.briefing') },
      { id: 'specification', label: t('status.specification') },
      { id: 'refinement', label: t('status.refinement') },
      { id: 'conclusion', label: t('status.conclusion') },
      { id: 'manual', label: t('status.manual') },
    ],
    [t]
  )

  const [realBriefing, setRealBriefing] = useState<string | null>(null)
  const [briefingInputType, setBriefingInputType] = useState<
    'text' | 'audio' | 'document' | 'form' | 'video' | null
  >(null)
  const [briefingMedia, setBriefingMedia] = useState<BriefingMediaInfo | null>(null)
  const [briefingCreatedAt, setBriefingCreatedAt] = useState<string | null>(null)
  const [refinementMessages, setRefinementMessages] = useState<
    { role: 'ai' | 'user'; content: string }[]
  >([])
  const [storyComments, setStoryComments] = useState<StoryCommentRow[]>([])
  const [initialStories, setInitialStories] = useState<Story[]>([])
  const [initialManualSections, setInitialManualSections] = useState<ManualSection[] | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [projectConclusion, setProjectConclusion] = useState<ProjectConclusion | null>(null)
  const [conclusionLoading, setConclusionLoading] = useState(false)
  const [conclusionError, setConclusionError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<string>('briefing')
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('briefing')
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        if (data.project) {
          setProjectName(data.project.name ?? '')
          setProjectDesc(data.project.description ?? '')
          const rawStatus: ProjectStatus = data.project.status ?? 'briefing'
          const parsed =
            parseProjectConclusion(data.conclusion) ??
            parseProjectConclusion(data.project?.conclusion)
          if (parsed) setProjectConclusion(parsed)
          const hasConclusion = !!parsed
          const status = resolveWorkflowStatus(rawStatus, hasConclusion)
          setProjectStatus(status)
          setActiveTab(defaultProjectTab(status, hasConclusion))
        }
        if (data.briefing) {
          setRealBriefing(data.briefing.content ?? null)
          const it = data.briefing.input_type
          setBriefingInputType(
            it === 'audio' ||
              it === 'document' ||
              it === 'video' ||
              it === 'text' ||
              it === 'form' ||
              it === 'images'
              ? it
              : null
          )
          setBriefingCreatedAt(typeof data.briefing.created_at === 'string' ? data.briefing.created_at : null)
          const bm = data.briefingMedia
          if (
            bm &&
            (bm.kind === 'audio' || bm.kind === 'video' || bm.kind === 'document') &&
            typeof bm.fileName === 'string'
          ) {
            setBriefingMedia({
              kind: bm.kind,
              fileName: bm.fileName,
              available: bm.available === true,
            })
          } else {
            setBriefingMedia(null)
          }
        } else {
          setRealBriefing(null)
          setBriefingInputType(null)
          setBriefingMedia(null)
          setBriefingCreatedAt(null)
        }
        if (Array.isArray(data.refinementMessages) && data.refinementMessages.length > 0) {
          setRefinementMessages(
            data.refinementMessages.map(
              (m: { role: string; content: string }) => ({
                role: m.role === 'user' ? 'user' : 'ai',
                content: m.content,
              })
            )
          )
        }
        if (Array.isArray(data.storyComments)) {
          setStoryComments(data.storyComments as StoryCommentRow[])
        }
        if (Array.isArray(data.stories) && data.stories.length > 0) {
          setInitialStories(data.stories.map((s: { code: string; title: string; description: string; acceptance_criteria: string[] }) => ({
            id: s.code,
            title: s.title,
            description: s.description,
            criteria: s.acceptance_criteria ?? [],
          })))
        }
        if (Array.isArray(data.documents)) {
          const manual = data.documents.find((d: { type: string; content: string }) => d.type === 'manual')
          if (manual?.content) {
            try { setInitialManualSections(JSON.parse(manual.content)) } catch { /* ignore */ }
          }
        }
      })
      .finally(() => setLoadingData(false))
  }, [projectId])

  // Edit modal
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)
  const statusIndex = STATUS_STEPS.indexOf(normalizeWorkflowStatus(projectStatus))

  const handleRefinementMessagesChange = useCallback(
    (msgs: { role: 'ai' | 'user'; content: string }[]) => {
      setRefinementMessages(prev => {
        const next = JSON.stringify(msgs)
        const prevKey = JSON.stringify(prev)
        return next === prevKey ? prev : msgs
      })
    },
    []
  )

  const generateConclusion = async (): Promise<boolean> => {
    setConclusionLoading(true)
    setConclusionError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/conclusion`, {
        method: 'POST',
        credentials: 'same-origin',
      })
      const body = (await res.json()) as { conclusion?: ProjectConclusion; error?: string }
      if (!res.ok) {
        setConclusionError(body.error ?? t('conclusion.errorGenerate'))
        return false
      }
      if (body.conclusion) {
        setProjectConclusion(body.conclusion)
      }
      return true
    } catch {
      setConclusionError(t('conclusion.errorGenerate'))
      return false
    } finally {
      setConclusionLoading(false)
    }
  }

  const advanceStep = async () => {
    if (activeTab === 'refinement') {
      const ok = await generateConclusion()
      if (!ok) return
      setProjectStatus('conclusion')
      setActiveTab('conclusion')
      void updateProjectStatusAction(projectId, 'conclusion')
      return
    }

    const nextStatus = nextWorkflowStep(projectStatus)
    if (nextStatus === 'done') {
      setProjectStatus('done')
      void updateProjectStatusAction(projectId, 'done')
      return
    }
    setProjectStatus(nextStatus)
    setActiveTab(nextStatus)
    void updateProjectStatusAction(projectId, nextStatus)
  }

  const saveEdit = () => {
    if (!editName.trim()) return
    setProjectName(editName.trim())
    setProjectDesc((editDesc ?? '').trim())
    setShowEdit(false)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    setDeleteError('')
    const result = await deleteProjectAction(projectId)
    if (result.error) {
      setDeleteError(result.error)
      setDeleting(false)
    } else {
      router.push('/projetos')
    }
  }

  return (
    <div className="flex flex-col flex-1">

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEdit(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#111827]">{t('detail.modalEditTitle')}</h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">{t('detail.labelProjectName')}</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">{t('detail.labelDescription')} <span className="text-[#9CA3AF] font-normal">{t('common.optional')}</span></label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowEdit(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={saveEdit} disabled={!editName.trim()}>{t('detail.saveChanges')}</Button>
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
                <h3 className="text-base font-semibold text-[#111827]">{t('detail.modalDeleteTitle')}</h3>
                <p className="text-sm text-[#6B7280]">{t('detail.modalDeleteSubtitle')}</p>
              </div>
            </div>
            <p className="text-sm text-[#374151] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
              {t('detail.modalDeleteLead').replace(/\{\{name\}\}/g, projectName)}
            </p>
            {deleteError && (
              <p className="text-sm text-[#EF4444]">{deleteError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)} disabled={deleting}>{t('common.cancel')}</Button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-sm font-medium text-white bg-[#EF4444] hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {deleting ? t('detail.deleteDeleting') : t('detail.deleteConfirm')}
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
                {t('detail.navProjects')}
              </Button>
            </Link>
            <button
              onClick={() => { setEditName(projectName); setEditDesc(projectDesc ?? ''); setShowEdit(true) }}
              className="p-1.5 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              title={t('detail.editProjectAria')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
              title={t('detail.deleteProjectAria')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            <Badge className={getStatusColor(projectStatus)}>{t(`status.${projectStatus}`)}</Badge>
            <ProjectExportButtons
              projectId={projectId}
              disabled={loadingData}
            />
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ProjectNextSteps status={projectStatus} />
      </div>

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
                    {t(`status.${step}`)}
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
          {tabs.map(tab => {
            const tabIdx = STATUS_STEPS.indexOf(tab.id as ProjectStatus)
            const isDone = tabIdx !== -1 && tabIdx < statusIndex
            const canOpen = tabIdx !== -1 && tabIdx <= statusIndex
            return (
              <button
                key={tab.id}
                type="button"
                disabled={!canOpen}
                onClick={() => canOpen && setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 flex items-center gap-1.5 ${
                  !canOpen
                    ? 'border-transparent text-[#D1D5DB] cursor-not-allowed'
                    : activeTab === tab.id
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
        {activeTab === 'briefing' && (
          <BriefingTab
            projectId={projectId}
            briefing={realBriefing}
            briefingInputType={briefingInputType}
            briefingMedia={briefingMedia}
            briefingCreatedAt={briefingCreatedAt}
            onBriefingSaved={content => setRealBriefing(content)}
          />
        )}
        {activeTab === 'refinement' && (
          <RefinamentoTab
            projectId={projectId}
            initialMessages={refinementMessages}
            autoStart={refinementMessages.length === 0}
            onMessagesChange={handleRefinementMessagesChange}
          />
        )}
        {!loadingData && activeTab === 'conclusion' && (
          <ConclusaoTab
            conclusion={projectConclusion}
            loading={conclusionLoading}
            error={conclusionError}
            regenerating={conclusionLoading}
            onRegenerate={() => void generateConclusion()}
          />
        )}
        {!loadingData && activeTab === 'specification' && (
          <EspecificacaoTab
            projectId={projectId}
            initialStories={initialStories}
            storyComments={storyComments}
            setStoryComments={setStoryComments}
          />
        )}
        {!loadingData && activeTab === 'manual' && <ManualTab projectId={projectId} projectName={projectName} initialSections={initialManualSections} />}

        {projectStatus === 'done' && (
          <div className="mt-8 flex flex-col items-center gap-4 py-8 bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#065F46]">{t('detail.completeTitle')}</h3>
              <p className="text-sm text-[#6B7280] mt-1">{t('detail.completeSubtitle')}</p>
            </div>
            <button
              onClick={() => router.push('/projetos')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              {t('detail.viewAllProjects')}
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-[#F1F5F9] pt-6">
          <div>
            {currentTabIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {tabs[currentTabIndex - 1].label}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentTabIndex < tabs.length - 1 &&
              STATUS_STEPS.indexOf(activeTab as ProjectStatus) === statusIndex && (
              <Button variant="outline" size="sm" onClick={() => void advanceStep()}>
                {tabs[currentTabIndex + 1].label}
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
              const isLastTab = currentTabIndex === tabs.length - 1
              const currentTabForStatus = tabs.find(tab => tab.id === projectStatus)

              if (isLastTab && projectStatus !== 'done') return (
                <Button size="sm" onClick={() => void advanceStep()} disabled={conclusionLoading}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t('detail.finishProject')}
                </Button>
              )
              if (isAlreadyDone) {
                const nextTab = tabs[currentTabIndex + 1]
                const nextTabIdx = nextTab
                  ? STATUS_STEPS.indexOf(nextTab.id as ProjectStatus)
                  : -1
                const target =
                  nextTab && nextTabIdx !== -1 && nextTabIdx <= statusIndex
                    ? nextTab
                    : currentTabForStatus
                if (!target || target.id === activeTab) return null
                return (
                  <Button size="sm" onClick={() => setActiveTab(target.id)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    {t('detail.goToNextStage').replace('{{stage}}', target.label)}
                  </Button>
                )
              }
              const hasRefinementReply = refinementMessages.some(
                m => m.role === 'ai' && m.content.trim()
              )
              if (
                activeTab === 'refinement' &&
                projectStatus !== 'done' &&
                projectStatus !== 'conclusion' &&
                hasRefinementReply
              ) {
                return (
                  <Button
                    size="sm"
                    onClick={() => void advanceStep()}
                    disabled={conclusionLoading}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t('detail.goToConclusion')}
                  </Button>
                )
              }
              if (isCurrentStep) return (
                <Button
                  size="sm"
                  onClick={() => void advanceStep()}
                  disabled={
                    conclusionLoading ||
                    (activeTab === 'refinement' &&
                      !refinementMessages.some(m => m.role === 'ai' && m.content.trim()))
                  }
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {activeTab === 'refinement' ? t('detail.goToConclusion') : t('detail.finishStage')}
                </Button>
              )
              if (isFutureStep && currentTabForStatus) return (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#9CA3AF]">
                    {t('detail.currentStageLabel')}{' '}
                    <span className="font-medium text-[#374151]">{currentTabForStatus.label}</span>
                  </span>
                  <Button size="sm" onClick={() => setActiveTab(currentTabForStatus.id)}>
                    {t('detail.goToCurrentStage')}
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
