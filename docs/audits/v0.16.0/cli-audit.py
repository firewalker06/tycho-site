import subprocess,os,json,pathlib
root=pathlib.Path('/tmp/tycho-site-v0160'); home=str(root/'cli-home');pathlib.Path(home).mkdir(exist_ok=True)
env={'HOME':home,'TYCHO_HOME':home,'TYCHO_LOGS_ROOT':home+'/logs','PATH':'/Users/didik/.local/share/mise/installs/ruby/4.0.9/bin:/Users/didik/.local/share/mise/installs/node/22.23.4/bin:/usr/bin:/bin','GEM_PATH':'/Users/didik/.gem/ruby/4.0.0:/Users/didik/.local/share/mise/installs/ruby/4.0.9/lib/ruby/gems/4.0.0'}
commands=['','harness list','appearance images list','appearance images upload','appearance images remove','queue','queue-work cleanup-migrations','queue-work complete','queue-work discard','queue-work process','queue-work remove','memory handoffs','doctor','update','serve','serve daemon','serve restart','metrics query','metrics backfill','debug claude','restart']
for group,forms in {'project':'create list show update archive','agent':'create list status focus run stop logs send archive finalize clone','agent store':'backups restore','agent pr-diff':'add remove','schedule':'create update validate list run archive pause resume reload restart daemon','server':'login logout status verify migrate'}.items(): commands += [group+' '+form for form in forms.split()]
results=[]
for command in commands:
 result=subprocess.run(['/Users/didik/.local/share/mise/installs/ruby/4.0.9/bin/ruby',str(root/'source/bin/tycho'),*command.split(),'--help'],env=env,text=True,capture_output=True)
 (root/('help-'+command.replace(' ','-')+'.txt')).write_text(result.stdout+result.stderr)
 results.append({'command':command or '(top-level)','exit':result.returncode})
(root/'cli-help-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
