"""Check required learner pages and local links before publishing."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'site'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  self.links.extend(v for k,v in attrs if k in ['href','src','poster'] and v)
required=['branding/index.html']+[f'branding/{slug}/index.html' for slug in ['basic','associate','professional','expert','ambassador']]
errors=[];checked=0
for name in required:
 p=SOURCE/name
 if not p.is_file():errors.append(f'Missing {name}')
for p in SOURCE.rglob('*.html'):
 parser=Links();parser.feed(p.read_text())
 for link in parser.links:
  u=urlsplit(link)
  if u.scheme or u.netloc or not u.path:continue
  target=SOURCE/unquote(u.path).lstrip('/') if u.path.startswith('/') else p.parent/unquote(u.path)
  if target.is_dir():target=target/'index.html'
  if not target.is_file():errors.append(f'{p.relative_to(SOURCE)}: missing {link}')
  checked+=1
if '--snapshot' in sys.argv:
 expected=json.loads((ROOT/'docs/snapshot.json').read_text())['files']
 actual={p.relative_to(SOURCE).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCE.rglob('*') if p.is_file()}
 if expected!=actual:errors.append('Site differs from the original published snapshot')
if errors:
 print('\n'.join(errors));raise SystemExit(1)
print(f'OK: {len(required)} learner pages and {checked} local references'+('; exact original snapshot' if '--snapshot' in sys.argv else ''))
