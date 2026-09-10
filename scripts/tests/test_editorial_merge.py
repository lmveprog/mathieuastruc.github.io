import importlib.util,json,tempfile,unittest,subprocess,sys
from pathlib import Path
spec=importlib.util.spec_from_file_location('editorial',Path(__file__).parents[1]/'publish-editorial.py');editorial=importlib.util.module_from_spec(spec);spec.loader.exec_module(editorial)
class MergeTest(unittest.TestCase):
 def test_only_selected_section_changes_and_dates_are_preserved(self):
  with tempfile.TemporaryDirectory() as root:
   p=Path(root)/'editorial.json';current={'day':'2026-09-09','x':[{'text':'ancien X'}],'video':[{'text':'vidéo modifiée entre temps','day':'2026-09-09'}]};p.write_text(json.dumps(current))
   candidate={'day':'2026-09-10','x':[{'text':'nouveau X','day':'2026-09-10'}],'video':[{'text':'copie périmée'}]}
   code=editorial.REMOTE.replace('/home/ubuntu/projects/adminstore/store/editorial.json',str(p))
   subprocess.run([sys.executable,'-c',code],input=json.dumps({'data':candidate,'kind':'x'}),text=True,check=True,capture_output=True)
   actual=json.loads(p.read_text());self.assertEqual(actual['video'],current['video']);self.assertEqual(actual['x'],candidate['x']);self.assertEqual(len(list((Path(root)/'editorial-history').glob('*.json'))),1)
