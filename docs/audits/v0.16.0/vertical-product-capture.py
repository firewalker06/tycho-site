from pathlib import Path
import os,subprocess,socket,time,json,urllib.request,urllib.error,signal,tempfile,secrets
root=Path('/tmp/tycho-site-v0160/vertical'); source=root/'source'; state=Path(tempfile.mkdtemp(prefix='state-',dir=root));bins=root/'bin';bins.mkdir(exist_ok=True)
ruby='/Users/didik/.local/share/mise/installs/ruby/4.0.9/bin/ruby'
fake=bins/'codex';fake.write_text('''#!/Users/didik/.local/share/mise/installs/ruby/4.0.9/bin/ruby
require "json"
if ARGV == ["auth", "status"]
  exit(File.exist?(File.join(Dir.home,"auth-ready")) ? 0 : 1)
end
if ARGV == ["--version"]
  puts "synthetic-codex-fixture"; exit 0
end
exit 0 unless ARGV.first == "exec"
prompt=STDIN.read
File.open(File.join(Dir.home,"harness-calls.jsonl"),"a"){|f|f.puts(JSON.generate({args:ARGV,workspace:Dir.pwd,has_prompt:prompt.include?("README.md")}))}
File.open("notes.md","a"){|f|f.puts("- Inspect the run result in Tycho.")}
payload={"status"=>"success","summary"=>"Added one practical next step to notes.md.","inquiry"=>nil,"attachments"=>nil,"memory_handoff"=>nil,"summary_sections"=>nil}
i=ARGV.index("-o");File.write(ARGV[i+1],JSON.generate(payload)) if i
puts JSON.generate({"type"=>"thread.started","thread_id"=>"synthetic-welcome-session"})
puts JSON.generate({"type"=>"item.completed","item"=>{"type"=>"agent_message","text"=>JSON.generate(payload)}})
STDOUT.flush
sleep 2
''');fake.chmod(0o755)
bashlink=bins/'bash'
if not bashlink.exists():bashlink.symlink_to('/opt/homebrew/bin/bash')
go=subprocess.check_output(['/usr/bin/which','go'],text=True).strip(); link=bins/'go'
if not link.exists():link.symlink_to(go)
env={'HOME':str(state),'TYCHO_HOME':str(state/'.tycho'),'PATH':str(bins)+':/Users/didik/.local/share/mise/installs/ruby/4.0.9/bin:/Users/didik/.local/share/mise/installs/node/22.23.4/bin:/usr/bin:/bin','GEM_PATH':'/Users/didik/.gem/ruby/4.0.0:/Users/didik/.local/share/mise/installs/ruby/4.0.9/lib/ruby/gems/4.0.0','TYCHO_CODEX_BIN':str(fake)}
for harness in ['CLAUDE','OPENCODE','PI','AGY','DSH','GH']:env['TYCHO_'+harness+'_BIN']=str(bins/('missing-'+harness.lower()))
version=subprocess.run([ruby,str(source/'bin/tycho'),'--version'],env=env,text=True,capture_output=True);print('VERSION',version.stdout.strip());assert '0.16.0' in version.stdout
setup=subprocess.run([str(source/'bin/setup'),'--check','--remote'],env=env,text=True,capture_output=True);(root/'setup-check.log').write_text(setup.stdout+setup.stderr);print('SETUP CHECK',setup.returncode)
s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close();url=f'http://127.0.0.1:{port}'
log=open(root/'serve.log','w');server=subprocess.Popen([ruby,str(source/'bin/tycho'),'serve','--host','127.0.0.1','--port',str(port)],cwd=source,env=env,stdout=log,stderr=log,start_new_session=True)
def request(path,method='GET',data=None,headers={}):
 req=urllib.request.Request(url+path,method=method,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json',**headers})
 with urllib.request.urlopen(req,timeout=10) as r:return json.load(r)
try:
 for _ in range(100):
  try:initial=request('/setup');break
  except Exception:time.sleep(.1)
 else:raise RuntimeError('serve startup failed')
 (root/'initial-setup.json').write_text(json.dumps(initial,indent=2));print('SETUP',json.dumps(initial)[:450]);assert initial['setup']['onboarding']['active'] is True
 auth=request('/setup/harnesses/codex/auth-check','POST',{});assert next(h for h in auth['setup']['harnesses'] if h['name']=='codex')['auth_snapshot']['state']=='unauthenticated';(root/'auth-before.json').write_text(json.dumps(auth,indent=2))
 (state/'auth-ready').touch();auth=request('/setup/harnesses/codex/auth-check','POST',{});assert next(h for h in auth['setup']['harnesses'] if h['name']=='codex')['auth_snapshot']['state']=='authenticated';(root/'auth-after.json').write_text(json.dumps(auth,indent=2))
 browserenv={**env,'FIRST_RUN_URL':url,'FIRST_RUN_OUTPUT':str(root/'evidence'),'CAPTURE_MODE':os.environ.get('CAPTURE_MODE','desktop')}
 result=subprocess.run(['node',str(root/'check-browser.cjs')],env=browserenv,text=True,capture_output=True);print(result.stdout);print(result.stderr);assert result.returncode==0
 (root/'projects.json').write_text(json.dumps(request('/projects'),indent=2))
 print('NOTES', (state/'tycho-projects/welcome/notes.md').read_text());assert 'Inspect the run result' in (state/'tycho-projects/welcome/notes.md').read_text()
 for _ in range(150):
  agents=request('/agents')['agents']
  if len(agents)==1 and agents[0]['status']=='succeeded':break
  time.sleep(.1)
 else:raise AssertionError('synthetic agent did not complete successfully')
 assert agents[0]['project_key']=='welcome';print('AGENT',agents[0]['key'],agents[0]['status'])
 (root/'agents.json').write_text(json.dumps(agents,indent=2))
finally:
 os.killpg(server.pid,signal.SIGTERM);server.wait(timeout=10);log.close()

# Start only this isolated server with a synthetic bearer token; never print it.
token=secrets.token_hex(24);env['TYCHO_REMOTE_TOKEN']=token
log=open(root/'token-serve.log','w');server=subprocess.Popen([ruby,str(source/'bin/tycho'),'serve','--host','127.0.0.1','--port',str(port)],cwd=source,env=env,stdout=log,stderr=log,start_new_session=True)
try:
 for _ in range(100):
  try:
   request('/setup');raise AssertionError('tokenless setup must reject')
  except urllib.error.HTTPError as error:
   assert error.code==401;break
  except urllib.error.URLError:time.sleep(.1)
 else:raise RuntimeError('token server startup failed')
 protected=request('/setup',headers={'Authorization':'Bearer '+token});assert protected['setup']['auth']['required'] is True
 print('ACCESS localhost no-token setup 200; token-protected setup 401 without bearer and 200 with synthetic bearer: PASS')
finally:
 os.killpg(server.pid,signal.SIGTERM);server.wait(timeout=10);log.close()
