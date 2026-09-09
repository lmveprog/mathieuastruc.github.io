export type StudioPlatform = { key: string; followers: number | null; ts: number | null; approximate: boolean };
export type StudioVideo = { id: string; platform: string; title: string; url: string; thumbnail?: string; publishedAt: number | null; measuredAt: number | null; views: number | null; likes: number | null; comments: number | null; gain24h: number | null; previousAt: number | null; lastGain: number | null; history: { ts: number; views: number }[] };
export type Studio = { generated: number; collectionMinutes: number; platforms: StudioPlatform[]; videos: StudioVideo[] };
export type StudioResponse = { studio: Studio | null; analytics: import('./contentPlan').Analytics | null; sync: Record<string, { ok: boolean; checkedAt: number }> };
