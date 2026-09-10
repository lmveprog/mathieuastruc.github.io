#!/usr/bin/env python3
"""Lecture minimale pour les réveils : aucun contenu = aucun travail modèle."""
import subprocess,shlex
code='''import json,pathlib,datetime
from zoneinfo import ZoneInfo
root=pathlib.Path('/home/ubuntu/projects/adminstore/store'); now=datetime.datetime.now(ZoneInfo('Europe/Paris')); day=now.date().isoformat()
e=json.loads((root/'editorial.json').read_text())
pending=0
for p in root.glob('sj-*.json'):
 d=json.loads(p.read_text())
 if d.get('status')=='pending' or (d.get('status')=='processing' and (now-datetime.datetime.fromisoformat(d['claimedAt'])).total_seconds()>1800):pending+=1
print(json.dumps({'day':day,'pending':pending,'xDue':now.hour>=6 and any(d['day']!=day for d in e.get('x',[])),'videoDue':now.hour>=7 and any(d['day']!=day for d in e.get('video',[]))}))
'''
subprocess.run(['ssh','-o','BatchMode=yes','-o','ConnectTimeout=10','ubuntu@149.202.61.220','python3 -c '+shlex.quote(code)],check=True)
