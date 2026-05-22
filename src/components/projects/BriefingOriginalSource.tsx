'use client'

import { useI18n } from '@/components/i18n/I18nProvider'

export type BriefingInputType = 'text' | 'audio' | 'document' | 'form' | 'video'

export type BriefingMediaInfo = {
  kind: 'audio' | 'video' | 'document'
  fileName: string
  available: boolean
}

export default function BriefingOriginalSource({
  projectId,
  media,
  compact = false,
}: {
  projectId: string
  media: BriefingMediaInfo
  compact?: boolean
}) {
  const { t } = useI18n()
  const mediaUrl = `/api/projects/${projectId}/briefing-media`
  const downloadUrl = `${mediaUrl}?download=1`
  const isPdf = media.fileName.toLowerCase().endsWith('.pdf')

  const player = (
    <>
      {media.kind === 'audio' && (
        <audio controls src={mediaUrl} className="w-full rounded-lg min-h-[48px]" preload="metadata">
          {t('briefing.mediaUnsupported')}
        </audio>
      )}
      {media.kind === 'video' && (
        <video
          controls
          playsInline
          src={mediaUrl}
          className="w-full max-h-80 rounded-lg bg-black shadow-sm"
          preload="metadata"
        >
          {t('briefing.mediaUnsupported')}
        </video>
      )}
      {media.kind === 'document' && (
        <div className="space-y-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1D4ED8] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            {t('briefing.openDocument')}
          </a>
          {isPdf && (
            <iframe
              title={t('briefing.documentPreview')}
              src={mediaUrl}
              className="w-full h-56 rounded-lg border border-[#E5E7EB] bg-white"
            />
          )}
        </div>
      )}
    </>
  )

  if (compact) {
    return <div className="space-y-2">{player}</div>
  }

  return (
    <div className="rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#1E3A8A]">{t('briefing.originalTitle')}</p>
          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{t('briefing.originalHint')}</p>
        </div>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] hover:underline shrink-0"
          download
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {t('briefing.downloadOriginal')}
        </a>
      </div>
      {player}
    </div>
  )
}
