/**
 * Live numbers from GitHub, refreshed at most once a day. Every value has a fallback
 * so the page still renders when the API is rate-limited or offline.
 */

export type LiveStats = {
  agentPetsVersion: string;
  agentPetsReleasedAt: string;
  agentPetsDownloads: number;
  publicRepos: number;
};

const FALLBACK: LiveStats = {
  agentPetsVersion: "v0.17.2",
  agentPetsReleasedAt: "2026-10-07",
  agentPetsDownloads: 219,
  publicRepos: 20,
};

type Release = { tag_name: string; published_at: string; assets: { download_count: number }[] };

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/${path}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86_400 },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getLiveStats(): Promise<LiveStats> {
  const [releases, user] = await Promise.all([
    gh<Release[]>("repos/Marczelloo/agent-pets/releases?per_page=100"),
    gh<{ public_repos: number }>("users/Marczelloo"),
  ]);

  const latest = releases?.[0];
  return {
    agentPetsVersion: latest?.tag_name ?? FALLBACK.agentPetsVersion,
    agentPetsReleasedAt: latest?.published_at?.slice(0, 10) ?? FALLBACK.agentPetsReleasedAt,
    agentPetsDownloads: releases
      ? releases.reduce((sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0), 0)
      : FALLBACK.agentPetsDownloads,
    publicRepos: user?.public_repos ?? FALLBACK.publicRepos,
  };
}
