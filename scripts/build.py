"""Build the static site with Python's standard library; no machine-specific paths."""
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'site';DESTINATION=ROOT/'dist'
if DESTINATION.exists():shutil.rmtree(DESTINATION)
shutil.copytree(SOURCE,DESTINATION)
print(f'Built {sum(p.is_file() for p in DESTINATION.rglob("*"))} files into dist/')
