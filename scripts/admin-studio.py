#!/usr/bin/env python3
"""instantane prive des comptes et publications, sans fabriquer de mesures."""
import argparse
import json
import re
import sqlite3
import time
from pathlib import Path


def export(database):
    con = sqlite3.connect(f'file:{database}?mode=ro', uri=True)
    con.row_factory = sqlite3.Row
    platforms = []
    for key in ('instagram', 'youtube', 'tiktok', 'facebook', 'x'):
        row = con.execute('''SELECT r.* FROM releve r JOIN compte a USING(plateforme,handle)
          WHERE a.a_moi=1 AND plateforme=? AND abonnes IS NOT NULL ORDER BY ts DESC LIMIT 1''', (key,)).fetchone()
        platforms.append(dict(key=key, followers=row['abonnes'] if row else None, ts=row['ts'] if row else None,
                              approximate=key in ('youtube', 'facebook')))
    videos = []
    for key in ('instagram', 'youtube', 'tiktok', 'facebook', 'x'):
        for row in con.execute('''SELECT c.* FROM contenu c JOIN compte a USING(plateforme,handle)
          WHERE a.a_moi=1 AND plateforme=? ORDER BY publie_le DESC LIMIT 30''', (key,)).fetchall():
            history = [dict(r) for r in con.execute('SELECT ts,vues FROM mesure WHERE contenu_id=? AND vues IS NOT NULL ORDER BY ts', (row['id'],))]
            last = con.execute('SELECT * FROM mesure WHERE contenu_id=? ORDER BY ts DESC LIMIT 1', (row['id'],)).fetchone()
            point = history[-1] if history else None
            prev = history[-2] if len(history)>1 else None
            baseline = next((p for p in reversed(history) if point and p['ts']<=point['ts']-86400), None)
            # un ancien releve de plusieurs jours ne devient pas une variation 24 h.
            gain = point['vues']-baseline['vues'] if point and baseline and point['ts']-baseline['ts']<=97200 else None
            sparse = history[-192:]
            thumbnail = row["miniature"]
            if not thumbnail and key == "youtube":
                video_id = row["id"].split(":")[-1]
                if re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id): thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
            videos.append(dict(id=row['id'], platform=key, title=row['titre'] or 'Sans titre', url=row['url'],
                thumbnail=thumbnail, publishedAt=row['publie_le'], measuredAt=point['ts'] if point else None,
                views=point['vues'] if point else None, likes=last['likes'] if last else None,
                comments=last['commentaires'] if last else None, gain24h=gain,
                previousAt=prev['ts'] if prev else None, lastGain=point['vues']-prev['vues'] if point and prev else None,
                history=[dict(ts=p['ts'], views=p['vues']) for p in sparse]))
    con.close()
    videos.sort(key=lambda v:v['publishedAt'] or 0, reverse=True)
    return dict(generated=int(time.time()), platforms=platforms, videos=videos, collectionMinutes=15)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('database');ap.add_argument('output');args=ap.parse_args()
    dest=Path(args.output);tmp=dest.with_suffix('.tmp');tmp.write_text(json.dumps(export(args.database),ensure_ascii=False));tmp.replace(dest)
