import uvicorn
import sys
import traceback

# Redirect stdout and stderr to a file
sys.stdout = open('startup_log.txt', 'w')
sys.stderr = sys.stdout

print("Starting debug server...")

try:
    from main import app
    print("Successfully imported app from main")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
except Exception as e:
    print("Error starting server:")
    traceback.print_exc()
finally:
    print("Server stopped or crashed.")
