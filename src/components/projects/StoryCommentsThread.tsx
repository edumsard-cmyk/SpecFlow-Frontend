'use client'

import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import { addStoryCommentAction, deleteStoryCommentAction } from '@/app/actions/story-comments'
import { useI18n } from '@/components/i18n/I18nProvider'
import { intlLocaleTag } from '@/lib/i18n/locale-format'

export interface StoryCommentRow {
  id: string
  story_code: string
  body: string
  user_id: string
  created_at: string
  author_name: string
  is_owner: boolean
}

export default function StoryCommentsThread({
  projectId,
  storyCode,
  comments,
  onAdded,
  onDeleted,
}: {
  projectId: string
  storyCode: string
  comments: StoryCommentRow[]
  onAdded: (c: StoryCommentRow) => void
  onDeleted: (id: string) => void
}) {
  const { t, locale } = useI18n()
  const [text, setText] = useState('')
  const [pending, start] = useTransition()

  const send = () => {
    const body = text.trim()
    if (!body) return
    start(async () => {
      const res = await addStoryCommentAction(projectId, storyCode, body)
      if (res.comment) {
        onAdded(res.comment as StoryCommentRow)
        setText('')
      }
    })
  }

  const remove = (id: string) => {
    start(async () => {
      const res = await deleteStoryCommentAction(id, projectId)
      if (!res.error) onDeleted(id)
    })
  }

  return (
    <div className="ml-0 md:ml-10 pl-4 border-l-2 border-[#E5E7EB] space-y-2 py-2">
      <p className="text-xs font-semibold text-[#64748B]">{t('comments.title')}</p>
      {comments.length > 0 && (
        <ul className="space-y-2">
          {comments.map(c => (
            <li key={c.id} className="text-sm bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#F1F5F9]">
              <div className="flex justify-between gap-2">
                <span className="font-medium text-[#374151]">{c.author_name}</span>
                <span className="text-xs text-[#9CA3AF] shrink-0">
                  {new Date(c.created_at).toLocaleString(intlLocaleTag(locale))}
                </span>
              </div>
              <p className="text-[#4B5563] mt-1 whitespace-pre-wrap">{c.body}</p>
              {c.is_owner && (
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="text-xs text-[#EF4444] mt-1 hover:underline"
                >
                  {t('comments.delete')}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          placeholder={t('comments.placeholder')}
          className="flex-1 text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        />
        <Button type="button" size="sm" disabled={pending || !text.trim()} onClick={send}>
          {t('common.send')}
        </Button>
      </div>
    </div>
  )
}
