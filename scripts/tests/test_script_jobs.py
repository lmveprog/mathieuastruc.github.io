import importlib.util,json,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('jobs',Path(__file__).parents[1]/'script-jobs.py');jobs=importlib.util.module_from_spec(spec);spec.loader.exec_module(jobs)
class JobsTest(unittest.TestCase):
 def test_claim_complete_and_no_double_processing(self):
  with tempfile.TemporaryDirectory() as root:
   id='sj-'+'a'*28;p=Path(root)/(id+'.json');p.write_text(json.dumps({'id':id,'status':'pending','createdAt':'2026-09-10T00:00:00+00:00'}))
   claim=jobs.act(root,'claim');self.assertIsNone(jobs.act(root,'claim'))
   data={'id':id,'claimToken':claim['claimToken'],'result':{'title':'Test','script':'Un mot. '*80,'note':'','sources':[{'title':'Source','url':'https://example.com/'}]}}
   with self.assertRaises(AssertionError):jobs.act(root,'complete',{**data,'claimToken':'wrong'})
   self.assertEqual(jobs.act(root,'complete',data)['status'],'done')
   with self.assertRaises(AssertionError):jobs.act(root,'complete',data)
   self.assertEqual(json.loads(p.read_text())['result'],data['result'])
