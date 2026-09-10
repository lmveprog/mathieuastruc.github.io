#!/usr/bin/env python3
"""publie les propositions dans le store prive, sans toucher aux brouillons."""
import argparse
import json
import re
import subprocess
from datetime import date
from pathlib import Path
from urllib.parse import urlparse


def validate(data):
    date.fromisoformat(data['day'])
    assert isinstance(data['generated'], str)
    ids = set()
    for kind in ('x', 'video'):
        assert isinstance(data[kind], list) and 1 <= len(data[kind]) <= (4 if kind == 'video' else 3)
        for d in data[kind]:
            assert d['kind'] == kind
            date.fromisoformat(d['day'])
            assert isinstance(d['id'], str) and re.fullmatch(r'[a-z0-9-]{1,100}', d['id']) and d['id'] not in ids
            ids.add(d['id'])
            assert isinstance(d['title'], str) and 0 < len(d['title']) <= 140
            assert isinstance(d['text'], str) and 0 < len(d['text']) <= 6000
            assert isinstance(d.get('detail', ''), str) and len(d.get('detail', '')) <= 2500
            assert d.get('done') is False and d.get('edition') in ('opinion-v2', 'voice-v3')
            if d.get('edition') == 'voice-v3':
                assert not d.get('detail'), 'le texte final doit vivre dans text'
                if kind == 'video':
                    assert 80 <= len(d['text'].split()) <= 320, 'script parlé complet requis'
                    assert not re.search(r'(?im)^\s*(?:\d+[–-]\d+\s*s|hook\s*:|angle\s*:|cta\s*:|plan\s*:|0:00)', d['text']), 'pas de consignes de tournage'
            if d.get('trend'):
                assert isinstance(d['trend']['label'], str) and len(d['trend']['label']) <= 350
                assert isinstance(d['trend']['checkedAt'], str)
                if d['trend'].get('url'): assert urlparse(d['trend']['url']).scheme == 'https'
            if d.get('source'):
                assert urlparse(d['source']).scheme == 'https' and urlparse(d['source']).netloc
                if d.get('sourceDate'): date.fromisoformat(d['sourceDate'][:10])
    return data

REMOTE = '''import json,sys,pathlib,datetime
p=pathlib.Path('/home/ubuntu/projects/adminstore/store/editorial.json')
payload=json.load(sys.stdin); d=payload['data']; kind=payload.get('kind')
import fcntl
lock=(p.parent/'.editorial.lock').open('a'); fcntl.flock(lock,fcntl.LOCK_EX)
if kind and p.exists():
 old=json.loads(p.read_text()); other='video' if kind=='x' else 'x'; d[other]=old[other]
h=p.parent/'editorial-history'; h.mkdir(exist_ok=True)
if p.exists():
 old=json.loads(p.read_text()); backup=h/(old['day']+'-'+datetime.datetime.now().strftime('%H%M%S%f')+'.json')
 backup.write_text(json.dumps(old,ensure_ascii=False))
t=p.with_suffix('.tmp'); t.write_text(json.dumps(d,ensure_ascii=False)); t.replace(p)
print(json.dumps({'day':d['day'],'x':len(d['x']),'video':len(d['video']),'saved':json.loads(p.read_text())==d}))
'''

if __name__ == '__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('input'); ap.add_argument('--check', action='store_true'); ap.add_argument('--kind', choices=['x','video']); args=ap.parse_args()
    data=validate(json.loads(Path(args.input).read_text()))
    if args.check:
        print('format editorial valide')
    else:
        import shlex
        subprocess.run(['ssh','-o','BatchMode=yes','-o','ConnectTimeout=10','ubuntu@149.202.61.220','python3 -c '+shlex.quote(REMOTE)],input=json.dumps({"data":data,"kind":args.kind}),text=True,check=True)
