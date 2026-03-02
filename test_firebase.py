import urllib.request
import json
import ssl

context = ssl._create_unverified_context()
test_url = "https://babu-collection-8abd1-default-rtdb.asia-southeast1.firebasedatabase.app/test_write.json"

try:
    print("Testing WRITE access on asia-southeast1...")
    data = json.dumps({"test": "123"}).encode('utf-8')
    req = urllib.request.Request(test_url, data=data, method='PUT')
    with urllib.request.urlopen(req, context=context) as response:
        print("✅ SUCCESS: Firebase Database is writable!")
        
        # Cleanup
        req_del = urllib.request.Request(test_url, method='DELETE')
        urllib.request.urlopen(req_del, context=context)
        print("Cleanup successful.")
except urllib.error.HTTPError as e:
    if e.code == 401:
        print("❌ DENIED: Firebase Security Rules are blocking WRITE access. (Error 401 Unauthorized)")
    else:
        print("❌ HTTP Error:", e)
except Exception as e:
    print("❌ Connection Error:", e)
