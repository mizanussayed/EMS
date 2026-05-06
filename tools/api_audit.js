const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function findFrontendCalls(root) {
  const files = walk(root).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.jsx'));
  const calls = [];
  const re = /\bapi\.(get|post|put|delete)\s*\(\s*(['`\"])(.*?)\2/gm;
  for (const f of files) {
    const txt = fs.readFileSync(f,'utf8');
    let m;
    while ((m = re.exec(txt)) !== null) {
      calls.push({ method: m[1].toUpperCase(), endpoint: m[3], file: path.relative(process.cwd(), f) });
    }
  }
  return calls;
}

function findBackendEndpoints(root) {
  const files = walk(root).filter(f => f.endsWith('.cs'));
  const endpoints = [];
  const reMap = /\bMap(Get|Post|Put|Delete)\s*\(\s*([^,\)]*)/g; // simplistic
  const reGroup = /MapGroup\((['\"])(.*?)\1/g;

  for (const f of files) {
    const txt = fs.readFileSync(f,'utf8');
    let group = null;
    const gm = reGroup.exec(txt);
    if (gm) group = gm[2];
    let m;
    while ((m = reMap.exec(txt)) !== null) {
      const verb = m[1].toUpperCase();
      // try to extract path from the MapGet/MapPost call argument if present as string
      const after = txt.slice(m.index, m.index + 200);
      const pMatch = /\(\s*(["'])(.*?)\1/.exec(after);
      const pathArg = pMatch ? pMatch[2] : '';
      let fullPath = '';
      if (pathArg.startsWith('/')) fullPath = pathArg;
      else if (group) fullPath = group + (pathArg ? (pathArg.startsWith('/')? pathArg : '/'+pathArg) : '');
      else fullPath = pathArg || '';
      endpoints.push({ method: verb, path: fullPath || 'N/A', file: path.relative(process.cwd(), f) });
    }
  }
  return endpoints;
}

function normalize(ep) {
  // strip query, template braces differences
  return ep.replace(/\{.*?\}/g, '{param}').replace(/\/api/g,'').replace(/\/+/g,'/').replace(/\/$/,'');
}

function main() {
  const frontendRoot = path.join(process.cwd(), 'frontend');
  const backendRoot = path.join(process.cwd(), 'backend', 'EMS.Api', 'Endpoints');
  if (!fs.existsSync(frontendRoot)) {
    console.error('Frontend folder not found:', frontendRoot);
    process.exit(1);
  }
  if (!fs.existsSync(backendRoot)) {
    console.error('Backend endpoints folder not found:', backendRoot);
    process.exit(1);
  }

  const calls = findFrontendCalls(frontendRoot);
  const endpoints = findBackendEndpoints(backendRoot);

  const frontendSet = new Set(calls.map(c => `${c.method} ${normalize(c.endpoint)}`));
  const backendSet = new Set(endpoints.map(e => `${e.method} ${normalize(e.path)}`));

  const missingInBackend = [...frontendSet].filter(x => !backendSet.has(x));
  const missingInFrontend = [...backendSet].filter(x => !frontendSet.has(x));

  const report = { calls, endpoints, missingInBackend, missingInFrontend };
  fs.writeFileSync('api_audit_report.json', JSON.stringify(report, null, 2));
  console.log('API audit complete. Report saved to api_audit_report.json');
}

main();
