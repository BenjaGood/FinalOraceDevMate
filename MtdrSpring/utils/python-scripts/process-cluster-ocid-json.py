import sys
import json

system_input = json.load(sys.stdin)

try:
    OCID = system_input["lab_oke_cluster_id"]["value"]
    print(OCID)
except KeyError as e:
    print("Error: Failed to access expected JSON key lab_oke_cluster_id or value")
except json.decoder.JSONDecodeError as e:
    print("Error: Failed to decode JSON")
except Exception as e:
    print("Error: Encountered unexpected error")
