#!/usr/bin/env python3
"""collecte des comptes personnels uniquement, sans veille ni publication sociale."""
import fcntl
import json
import os
import sys
import time
from pathlib import Path

ROOT=Path('/home/ubuntu/projects/matheuslab')
sys.path.insert(0,str(ROOT))
os.environ["PATH"]=str(ROOT/".venv/bin")+os.pathsep+os.environ.get("PATH","")
from core import db,moi
from core.sources import instagram_api,tiktok,youtube

lock=open('/tmp/matheus-studio.lock','w')
try: fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
except BlockingIOError: sys.exit(0)
status={}

def record(key, run):
    try:
        run();status[key]={'ok':True,'checkedAt':int(time.time())}
    except Exception as e:
        # ne jamais journaliser une URL qui pourrait contenir un jeton.
        status[key]={'ok':False,'checkedAt':int(time.time()),'error':type(e).__name__}
    print(key,status[key],flush=True)

def instagram():
    con=db.connect()
    try: instagram_api.collecter(con,limite=30,verbeux=False)
    finally: con.close()

def collect(key, profile, posts=None):
    con=db.connect();ts=db.now()
    try:
        p=profile()
        if not p or p.get('abonnes') is None: raise ValueError('profil absent')
        with con:
            db.upsert_compte(con,key,moi.COMPTES[key],a_moi=1)
            db.add_releve(con,ts,key,moi.COMPTES[key],p['abonnes'],p.get('posts'),p.get('extra'))
        if posts:
            items=posts()
            if not items:raise ValueError('publications absentes')
            with con:
                for it in items:
                    db.upsert_contenu(con,it,ts)
                    db.add_mesure(con,it['id'],ts,vues=it.get('vues'),likes=it.get('likes'),commentaires=it.get('commentaires'),partages=it.get('partages'))
    finally:con.close()

record('instagram',instagram)
record('youtube',lambda:collect('youtube',lambda:moi.youtube_profil(moi.COMPTES['youtube']),lambda:youtube.videos_de_chaine(moi.COMPTES['youtube'],15)+youtube.videos_de_chaine(moi.COMPTES['youtube'],15,shorts=True)))
record('tiktok',lambda:collect('tiktok',lambda:moi.tiktok_profil(moi.COMPTES['tiktok']),lambda:tiktok.videos(moi.COMPTES['tiktok'],30)))
record('facebook',lambda:collect('facebook',lambda:moi.facebook_profil(moi.COMPTES['facebook'])))
record('x',lambda:collect('x',lambda:moi.x_profil(moi.COMPTES['x'])))
store=Path('/home/ubuntu/projects/adminstore/store')
p=store/'studio-sync.json';t=p.with_suffix('.tmp');t.write_text(json.dumps(status));t.replace(p)
import subprocess
for script,doc in [('admin-studio.py','studio'),('admin-analytics.py','analytics')]:
    subprocess.run([sys.executable,str(store.parent/script),str(ROOT/'data/matheusgen.db'),str(store/(doc+'.json'))],check=True)
