import urllib.request
import json
import urllib.error
req = urllib.request.Request(
    'http://127.0.0.1:8000/evaluate', 
    data=json.dumps({'action_type': 'test', 'environment': 'prod'}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
try: 
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e: 
    print(e.read().decode())
