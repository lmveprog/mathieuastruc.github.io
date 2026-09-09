import importlib.util
import sqlite3
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('studio',Path(__file__).parents[1]/'admin-studio.py')
studio=importlib.util.module_from_spec(spec);spec.loader.exec_module(studio)

class StudioExportTest(unittest.TestCase):
 def test_latest_counts_missing_values_and_comparable_windows(self):
  with tempfile.TemporaryDirectory() as directory:
   db=Path(directory)/'test.db';con=sqlite3.connect(db)
   con.executescript('''CREATE TABLE compte (plateforme,handle,a_moi); CREATE TABLE releve (plateforme,handle,ts,abonnes);
    CREATE TABLE contenu (id,plateforme,handle,titre,url,miniature,publie_le);
    CREATE TABLE mesure (contenu_id,ts,vues,likes,commentaires);
    INSERT INTO compte VALUES ('instagram','me',1),('instagram','someone',0);
    INSERT INTO releve VALUES ('instagram','me',100,123),('instagram','me',200,NULL),('instagram','someone',300,99999);
    INSERT INTO contenu VALUES ('new','instagram','me','new','https://example.com/new',NULL,90000),('old','instagram','me','old','https://example.com/old',NULL,1);
    INSERT INTO mesure VALUES ('new',100000,50,5,1),('new',186400,75,6,2),('new',186500,NULL,7,2),('old',100,10,1,0),('old',200000,100,4,1);
   ''');con.commit();con.close()
   result=studio.export(db)
   self.assertEqual(result['platforms'][0]['followers'],123)
   self.assertIsNone(result['platforms'][1]['followers'])
   new,old=result['videos'];self.assertEqual(new['id'],'new')
   self.assertEqual(new['views'],75);self.assertEqual(new['measuredAt'],186400)
   self.assertEqual(new['gain24h'],25);self.assertEqual(new['likes'],7)
   self.assertIsNone(old['gain24h'])

if __name__=='__main__': unittest.main()
