const REPLACEMENTS = [
  // === Mojang ===
  { regex: /launchermeta\.mojang\.com/g, replacement: 'bmclapi2.bangbang93.com' },
  { regex: /piston-meta\.mojang\.com/g, replacement: 'bmclapi2.bangbang93.com' },
  { regex: /piston-data\.mojang\.com/g, replacement: 'bmclapi2.bangbang93.com' },
  { regex: /launcher\.mojang\.com/g, replacement: 'bmclapi2.bangbang93.com' },
  { regex: /resources\.download\.minecraft\.net/g, replacement: 'bmclapi2.bangbang93.com/assets' },
  { regex: /libraries\.minecraft\.net/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  
  // === Fabric ===
  { regex: /meta\.fabricmc\.net/g, replacement: 'bmclapi2.bangbang93.com/fabric-meta' },
  { regex: /maven\.fabricmc\.net/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  
  // === Forge ===
  { regex: /maven\.minecraftforge\.net/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  { regex: /files\.minecraftforge\.net\/maven/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  
  // === Liteloader ===
  { regex: /dl\.liteloader\.com\/versions\/versions\.json/g, replacement: 'bmclapi2.bangbang93.com/maven/com/mumfrey/liteloader/versions.json' },
  { regex: /dl\.liteloader\.com\/versions/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  
  // === Neoforge ===
  { regex: /maven\.neoforged\.net\/releases/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  
  // === Quilt===
  { regex: /maven\.quiltmc\.org\/repository\/release/g, replacement: 'bmclapi2.bangbang93.com/maven' },
  { regex: /meta\.quiltmc\.org/g, replacement: 'bmclapi2.bangbang93.com/quilt-meta' }
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (!pathname.startsWith('/')) pathname = '/' + pathname;

    const upstream = 'https://meta.prismlauncher.org/v1/' + pathname;

    const response = await fetch(upstream, { cf: { cacheTtl: 86400 } });
    
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || (!contentType.includes('json') && !contentType.includes('text'))) {
      return response;
    }

    let body = await response.text();
    
    for (const { regex, replacement } of REPLACEMENTS) {
      body = body.replace(regex, replacement);
    }

    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json; charset=utf-8');

    return new Response(body, { status: response.status, headers });
  }
};