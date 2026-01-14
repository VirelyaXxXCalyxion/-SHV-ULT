# Link Check Report

## Scope

This report covers links found in:

- `src/`
- `public/`
- `README.md`
- `package.json`
- `astro.config.mjs`

It excludes `node_modules/` and does not scan `package-lock.json` (dependency tarball metadata).

## Command

```bash
python - <<'PY'
import os,re,sys,urllib.request,urllib.error
from pathlib import Path
from urllib.parse import urlparse

root=Path('/workspace/-SHV-ULT')

exts={'.astro','.tsx','.ts','.jsx','.js','.html','.md','.mdx','.css','.scss','.json','.yml','.yaml'}
attr_re=re.compile(r"\b(?:href|src)=['\"]([^'\"]+)['\"]",re.IGNORECASE)
md_re=re.compile(r"\[[^\]]*\]\(([^)]+)\)")
url_re=re.compile(r"https?://[^\s)\"']+")

# Build routes from src/pages
pages_dir=root/'src'/'pages'
route_files=[]
for path in pages_dir.rglob('*'):
    if path.is_file() and path.suffix in {'.astro','.mdx','.md','.html','.ts'}:
        rel=path.relative_to(pages_dir)
        route_files.append(rel)

routes=set()
route_patterns=[]
for rel in route_files:
    ext=rel.suffix
    name=rel.name
    if name.startswith('[') and name.endswith(']'+ext):
        base=rel.with_suffix('')
        pattern='/'+'/'.join(base.parts)
        route_patterns.append(pattern)
        continue
    if name == 'index'+ext:
        route='/'+'/'.join(rel.parts[:-1])
        routes.add(route if route else '/')
    else:
        route='/'+'/'.join(rel.with_suffix('').parts)
        routes.add(route)

for rel in route_files:
    if rel.name.startswith('[') and ']' in rel.name:
        base=rel.with_suffix('')
        pattern='/'+'/'.join(base.parts)
        route_patterns.append(pattern)

for rel in route_files:
    if rel.suffix=='.ts':
        route='/'+'/'.join(rel.with_suffix('').parts)
        routes.add(route)

# public files
public_dir=root/'public'
public_files=set()
for path in public_dir.rglob('*'):
    if path.is_file():
        public_files.add('/'+str(path.relative_to(public_dir)).replace(os.sep,'/'))

# collect links from src, public, README, package.json, astro config
scan_roots=[root/'src', root/'public', root/'README.md', root/'package.json', root/'astro.config.mjs']

links=[]
for target in scan_roots:
    if target.is_file():
        paths=[target]
    else:
        paths=list(target.rglob('*'))
    for path in paths:
        if path.is_file() and path.suffix in exts:
            try:
                text=path.read_text(encoding='utf-8')
            except Exception:
                continue
            for m in attr_re.finditer(text):
                links.append((path, m.group(1)))
            for m in md_re.finditer(text):
                links.append((path, m.group(1)))
            for m in url_re.finditer(text):
                links.append((path, m.group(0)))

# dedupe
seen=set(); unique=[]
for p,l in links:
    key=(p,l)
    if key in seen:
        continue
    seen.add(key); unique.append((p,l))

# check external
external_results={}
internal_missing=[]
custom_links=[]


def check_url(url):
    req=urllib.request.Request(url, method='HEAD', headers={'User-Agent':'link-checker'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        if e.code == 405:
            req2=urllib.request.Request(url, method='GET', headers={'User-Agent':'link-checker'})
            with urllib.request.urlopen(req2, timeout=10) as resp:
                return resp.status
        return e.code
    except Exception as e:
        return f'error:{type(e).__name__}'

for p,l in unique:
    l=l.strip()
    if not l or l.startswith('#'):
        continue
    if '${' in l:
        # skip template literal fragments
        continue
    parsed=urlparse(l)
    if parsed.scheme in ('http','https'):
        if parsed.hostname == 'localhost':
            continue
        if l not in external_results:
            external_results[l]=check_url(l)
        continue
    if parsed.scheme in ('mailto','obsidian','javascript'):
        custom_links.append((p,l))
        continue
    if l.startswith('//'):
        if l not in external_results:
            external_results[l]=check_url('https:'+l)
        continue
    clean=l.split('#')[0].split('?')[0]
    if not clean:
        continue
    if clean.endswith('/') and clean != '/':
        clean=clean.rstrip('/')
    if clean.startswith('/'):
        if clean in public_files:
            continue
        if clean in routes:
            continue
        if any(clean.startswith(pattern.replace('[','').replace(']','')) for pattern in route_patterns):
            continue
        internal_missing.append((p,l))
    else:
        target=(p.parent/clean).resolve()
        if target.exists():
            continue
        internal_missing.append((p,l))

bad_external={k:v for k,v in external_results.items() if (isinstance(v,int) and v>=400) or (isinstance(v,str) and v.startswith('error'))}

print('total links',len(unique))
print('external unique',len(external_results))
print('internal missing',len(internal_missing))
print('custom scheme',len(custom_links))
print('bad external',len(bad_external))

print('\nBAD EXTERNAL')
for k,v in sorted(bad_external.items()):
    print(v,k)

print('\nINTERNAL MISSING')
for p,l in internal_missing:
    print(p.relative_to(root), '->', l)

print('\nCUSTOM SCHEME')
for p,l in custom_links:
    print(p.relative_to(root), '->', l)
PY
```

## Results

```
total links 233
external unique 32
internal missing 0
custom scheme 6
bad external 0

BAD EXTERNAL

INTERNAL MISSING

CUSTOM SCHEME
src/pages/index.astro -> mailto:contact@ashvault.ink
src/pages/infrastructure/companion/physical.mdx -> obsidian://open?vault=Calyxion_Vault_MDOnly&file=20%20Scrolls%2FSystems%20and%20Sero%20-%20Behind%20the%20Persona
src/pages/infrastructure/companion/emotional.mdx -> obsidian://open?vault=Calyxion_Vault_MDOnly&file=20%20Scrolls%2FSystems%20and%20Sero%20-%20Behind%20the%20Persona
src/pages/infrastructure/companion/systemic.mdx -> obsidian://open?vault=Calyxion_Vault_MDOnly&file=Daily%2F12.24.2025%20The%20Best%20Christmas%20Gift
src/pages/infrastructure/companion/psychological.mdx -> obsidian://open?vault=Calyxion_Vault_MDOnly&file=20%20Scrolls%2FSystems%20and%20Sero%20-%20Behind%20the%20Persona
README.md -> mailto:contact@ashvault.ink
```
