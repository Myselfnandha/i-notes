#!/usr/bin/env python3
import sys
import subprocess
import os

def main():
    print("✨ Starting i Notes Archival System Backend on http://localhost:7860 ...")
    os.environ["DATA_DIR"] = "data"
    subprocess.run([sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860", "--reload"])

if __name__ == "__main__":
    main()
