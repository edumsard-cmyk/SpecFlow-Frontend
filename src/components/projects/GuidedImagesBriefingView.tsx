'use client'

import { useMemo } from 'react'
import { useI18n } from '@/components/i18n/I18nProvider'
import { parseGuidedImagesContent, stripGuidedImagesMarker } from '@/lib/briefing/guided-images'

export default function GuidedImagesBriefingView({
  projectId,
  content,
}: {
  projectId: string
  content: string
}) {
  const { t } = useI18n()
  const meta = useMemo(() => parseGuidedImagesContent(content), [content])
  const narrative = useMemo(() => stripGuidedImagesMarker(content), [content])

  if (!meta?.blocks.length) {
    return (
      <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
        {narrative || t('briefing.emptyReadonly')}
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {meta.blocks.map((block, i) => (
        <div
          key={`${block.fileName}-${i}`}
          className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden"
        >
          {block.storageRef ? (
            <img
              src={`/api/projects/${projectId}/briefing-media?file=${encodeURIComponent(block.fileName)}`}
              alt={t('briefing.guidedImageAlt').replace('{{n}}', String(i + 1))}
              className="w-full max-h-72 object-contain bg-[#F3F4F6]"
            />
          ) : (
            <div className="px-4 py-6 bg-[#F9FAFB] text-xs text-[#6B7280] text-center">
              {t('briefing.guidedImageMissing')}
            </div>
          )}
          <div className="p-4 border-t border-[#F1F5F9]">
            <p className="text-xs font-semibold text-[#6B7280] mb-1.5">
              {t('briefing.guidedImageCaption').replace('{{n}}', String(i + 1))}
            </p>
            <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
              {block.text.trim() || '—'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
