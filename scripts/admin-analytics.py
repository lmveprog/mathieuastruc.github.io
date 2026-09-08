#!/usr/bin/env python3
"""export prive du lab : derniers releves par jour paris, sans ecrire dans sqlite."""
import argparse
import json
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

PARIS = ZoneInfo('Europe/Paris')
PLATFORMS = ('instagram', 'x', 'tiktok', 'facebook', 'youtube')

def export(db, now=None):
    now = now or datetime.now(PARIS)
    today = now.date()
    start = today - timedelta(days=30)
    cutoff = int(datetime.combine(start, datetime.min.time(), PARIS).timestamp())
    con = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
    con.row_factory = sqlite3.Row
    def day(ts):
        return datetime.fromtimestamp(ts, PARIS).date().isoformat()
    followers, measures, handles = {}, {}, {}
    for r in con.execute('SELECT plateforme, handle FROM compte WHERE a_moi=1'):
        handles.setdefault(r['plateforme'], []).append(r['handle'])
    for r in con.execute('''SELECT r.* FROM releve r JOIN compte c
      ON c.plateforme=r.plateforme AND c.handle=r.handle
      WHERE c.a_moi=1 AND r.ts>=? AND r.abonnes IS NOT NULL ORDER BY r.ts''', (cutoff,)):
        followers[(r['plateforme'], day(r['ts']))] = (r['abonnes'], r['ts'])
    for r in con.execute('''SELECT m.*, c.plateforme FROM mesure m JOIN contenu c ON c.id=m.contenu_id
      JOIN compte a ON a.plateforme=c.plateforme AND a.handle=c.handle
      WHERE a.a_moi=1 AND m.ts>=? AND m.vues IS NOT NULL ORDER BY m.ts''', (cutoff,)):
        measures.setdefault((r['plateforme'], day(r['ts'])), {})[r['contenu_id']] = (r['vues'], r['ts'])
    con.close()
    rows = []
    for i in range(29, -1, -1):
        date = today - timedelta(days=i)
        d, prev = date.isoformat(), (date-timedelta(days=1)).isoformat()
        platforms = []
        for p in PLATFORMS:
            f, pf = followers.get((p,d)), followers.get((p,prev))
            curr, old = measures.get((p,d), {}), measures.get((p,prev), {})
            shared = curr.keys() & old.keys()
            # aucun zero invente pour un contenu nouveau ou un jour absent.
            views = sum(curr[k][0]-old[k][0] for k in shared) if shared else None
            platforms.append(dict(key=p, handles=handles.get(p, []), followers=f[0] if f else None,
                delta=f[0]-pf[0] if f and pf else None, views=views, compared=len(shared),
                observed=len(curr), ts=max([f[1] if f else 0]+[v[1] for v in curr.values()]) or None))
        rows.append(dict(date=d, platforms=platforms))
    return dict(generated=int(now.timestamp()), days=rows)

if __name__ == '__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('database'); ap.add_argument('output'); args=ap.parse_args()
    dest=Path(args.output); temp=dest.with_suffix('.tmp')
    temp.write_text(json.dumps(export(args.database), ensure_ascii=False))
    temp.replace(dest)
