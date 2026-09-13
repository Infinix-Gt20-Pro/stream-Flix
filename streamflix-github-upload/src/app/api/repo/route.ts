import { NextResponse } from 'next/server';

const REPO_ENDPOINTS = [
  'https://raw.githubusercontent.com/self-similarity/MegaRepo/builds/repo.json',
  'https://raw.githubusercontent.com/recloudstream/extensions/master/repo.json',
  'https://raw.githubusercontent.com/phisher98/cloudstream-extensions-phisher/refs/heads/builds/repo.json',
];

const DIRECT_PLUGIN_LISTS = [
  'https://raw.githubusercontent.com/hexated/cloudstream-extensions-hexated/builds/plugins.json', // Hexated (Official XDA Movies Repo)
  'https://raw.githubusercontent.com/phisher98/cloudstream-extensions-phisher/refs/heads/builds/plugins.json', // Phisher (Bollywood & Hindi Cinema)
  'https://raw.githubusercontent.com/recloudstream/extensions/builds/plugins.json', // Core Extensions
  'https://raw.githubusercontent.com/self-similarity/MegaRepo/builds/plugins.json', // Master Repo
];

export async function GET() {
  try {
    // 1. Fetch repository manifests using Promise.allSettled with revalidation
    const repoResults = await Promise.allSettled(
      REPO_ENDPOINTS.map(async (repoUrl) => {
        const res = await fetch(repoUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Cloudstream-Client/1.0',
          },
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          throw new Error(`Repo HTTP ${res.status} from ${repoUrl}`);
        }

        const data = await res.json();
        return { repoUrl, data };
      })
    );

    // Extract all plugins.json URLs and repo metadata
    const pluginListUrls: string[] = [...DIRECT_PLUGIN_LISTS];
    const repoMetadataList: any[] = [
      {
        url: 'https://raw.githubusercontent.com/hexated/cloudstream-extensions-hexated',
        name: 'Hexated (XDA Movies Master Repo)',
        description: 'Official XDA Developers CloudStream movies and cinema provider suite',
        manifestVersion: 1,
      },
    ];

    for (const result of repoResults) {
      if (result.status === 'fulfilled') {
        const { repoUrl, data } = result.value;
        repoMetadataList.push({
          url: repoUrl,
          name: data.name,
          description: data.description,
          manifestVersion: data.manifestVersion,
        });

        if (Array.isArray(data.pluginLists)) {
          for (const listUrl of data.pluginLists) {
            if (typeof listUrl === 'string' && listUrl.trim()) {
              pluginListUrls.push(listUrl.trim());
            }
          }
        }
      } else {
        console.warn('Failed to fetch a repo endpoint:', result.reason);
      }
    }

    // 2. Fetch all plugins.json lists using Promise.allSettled with caching
    const pluginsResults = await Promise.allSettled(
      pluginListUrls.map(async (pluginUrl) => {
        const res = await fetch(pluginUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Cloudstream-Client/1.0',
          },
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          throw new Error(`Plugins list HTTP ${res.status} from ${pluginUrl}`);
        }

        const plugins = await res.json();
        return Array.isArray(plugins) ? plugins : [];
      })
    );

    // 3. Combine and deduplicate plugins across all repositories
    const seenKeys = new Set<string>();
    const uniquePlugins: any[] = [];

    for (const result of pluginsResults) {
      if (result.status === 'fulfilled') {
        for (const plugin of result.value) {
          if (!plugin) continue;
          
          // Unique key: internalName, url, or name
          const key = (
            plugin.internalName ||
            plugin.url ||
            plugin.name ||
            JSON.stringify(plugin)
          ).toLowerCase();

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniquePlugins.push(plugin);
          }
        }
      } else {
        console.warn('Failed to fetch a plugins list:', result.reason);
      }
    }

    // 4. Return combined response
    return NextResponse.json({
      name: 'CloudStream Multi-Repository Hub',
      description: 'Aggregated verified extensions from Master Repo and Core Extensions',
      manifestVersion: 1,
      repositories: repoMetadataList,
      pluginLists: pluginListUrls,
      totalPlugins: uniquePlugins.length,
      plugins: uniquePlugins,
    });
  } catch (error: any) {
    console.error('Error in multi-repo API route:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch repositories data',
        details: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
