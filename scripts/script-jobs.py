#!/usr/bin/env python3
"""File privée : claim, complete RESULT.json, fail ERROR.json, list. Aucun appel API IA."""
import argparse, datetime, fcntl, json, re, subprocess, shlex
from pathlib import Path
from urllib.parse import urlparse


def act(root, action, payload=None):
    root=Path(root); root.mkdir(exist_ok=True)
    now=datetime.datetime.now(datetime.timezone.utc)
    with (root/'.script-jobs.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        def write(p,d):
            t=p.with_suffix('.tmp'); t.write_text(json.dumps(d,ensure_ascii=False)); t.replace(p)
        if action in ('claim','list'):
            jobs=[]
            for p in root.glob('sj-*.json'):
                if not re.fullmatch(r'sj-[a-f0-9]{28}',p.stem): continue
                d=json.loads(p.read_text()); jobs.append((p,d))
            jobs.sort(key=lambda item:item[1].get('createdAt',''))
            if action=='list': return [d for _,d in jobs if d.get('status') in ('pending','processing')]
            for p,d in jobs:
                stale=d.get('status')=='processing' and (now-datetime.datetime.fromisoformat(d['claimedAt'])).total_seconds()>1800
                if d.get('status')!='pending' and not stale: continue
                if d.get('attempts',0)>=3:
                    d.update(status='error',error='La préparation a été interrompue plusieurs fois. Réessaie depuis le site.');write(p,d);continue
                import uuid
                d.update(status='processing',claimedAt=now.isoformat(),attempts=d.get('attempts',0)+1,claimToken=uuid.uuid4().hex)
                write(p,d);return d
            return None
        assert isinstance(payload,dict) and re.fullmatch(r'sj-[a-f0-9]{28}',payload.get('id','')), 'id invalide'
        p=root/(payload['id']+'.json');d=json.loads(p.read_text())
        assert d['status']=='processing' and payload.get('claimToken')==d.get('claimToken'), 'demande non détenue ou déjà terminée'
        if action=='complete':
            r=payload['result'];assert all(isinstance(r.get(k),str) for k in ['title','script','note'])
            assert 1<=len(r['title'])<=140 and 80<=len(r['script'].split())<=400 and len(r['script'])<=6000
            assert not re.search(r'(?im)^\s*(hook|angle|cta|plan|0:00)\s*:',r['script'])
            assert isinstance(r['sources'],list) and 1<=len(r['sources'])<=6
            for s in r['sources']:
                u=urlparse(s['url']);assert isinstance(s['title'],str) and u.scheme=='https' and u.netloc and not u.username and not u.password
            d.update(status='done',result=r,completedAt=now.isoformat())
        elif action=='fail':
            assert isinstance(payload.get('error'),str) and 1<=len(payload['error'])<=1000
            d.update(status='error',error=payload['error'],completedAt=now.isoformat())
        else: raise ValueError('action inconnue')
        write(p,d);return {'id':d['id'],'status':d['status']}

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('action',choices=['claim','list','complete','fail']);ap.add_argument('input',nargs='?');args=ap.parse_args()
    payload=json.loads(Path(args.input).read_text()) if args.input else None
    source=Path(__file__).read_text().split("if __name__=='__main__':")[0]
    source+='\nimport sys\nd=json.load(sys.stdin)\nprint(json.dumps(act("/home/ubuntu/projects/adminstore/store",d["action"],d["payload"]),ensure_ascii=False))'
    subprocess.run(['ssh','-o','BatchMode=yes','-o','ConnectTimeout=10','ubuntu@149.202.61.220','python3 -c '+shlex.quote(source)],input=json.dumps({'action':args.action,'payload':payload}),text=True,check=True)
