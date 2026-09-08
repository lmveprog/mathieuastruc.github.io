import importlib.util
import sqlite3
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

spec=importlib.util.spec_from_file_location('analytics', Path(__file__).parents[1]/'admin-analytics.py')
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)

class AnalyticsTest(unittest.TestCase):
 def test_comparable_contents_missing_days_and_paris_midnight(self):
  with tempfile.TemporaryDirectory() as tmp:
   p=Path(tmp)/'lab.db'; c=sqlite3.connect(p)
   c.executescript('CREATE TABLE compte(plateforme,handle,a_moi); CREATE TABLE releve(ts,plateforme,handle,abonnes); CREATE TABLE contenu(id,plateforme,handle); CREATE TABLE mesure(contenu_id,ts,vues);')
   c.executemany('INSERT INTO compte VALUES(?,?,?)',[('youtube','me',1),('youtube','other',0)])
   c.executemany('INSERT INTO contenu VALUES(?,?,?)',[('old','youtube','me'),('new','youtube','me'),('other','youtube','other')])
   # 22:30 UTC = lendemain a Paris, meme au changement de date civile.
   t1=int(datetime.fromisoformat('2026-09-07T22:30:00+00:00').timestamp())
   t2=t1+86400
   c.executemany('INSERT INTO mesure VALUES(?,?,?)',[('old',t1,100),('old',t2,90),('new',t2,9000),('other',t2,999999)])
   c.executemany('INSERT INTO releve VALUES(?,?,?,?)',[(t1,'youtube','me',10),(t2,'youtube','me',12)])
   c.commit();c.close()
   d=a.export(p,datetime(2026,9,9,12,tzinfo=a.PARIS))['days']
   r=next(x for x in d[-1]['platforms'] if x['key']=='youtube')
   self.assertEqual((r['followers'],r['delta'],r['views'],r['compared'],r['observed']),(12,2,-10,1,2))
   yesterday=next(x for x in d[-2]['platforms'] if x['key']=='youtube')
   self.assertIsNone(yesterday['views'])
   self.assertIsNone(yesterday['delta'])
   self.assertIsNone(d[-1]['platforms'][0]['followers'])
   self.assertEqual(len(d),30)

if __name__=='__main__': unittest.main()
