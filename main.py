from fastapi import FastAPI
import time

app = FastAPI(title="Halobot Backend", version="1.0.0")

start_time = time.time()

@app.get("/health")
def health():
    uptime = time.time() - start_time
    return {
        "status": "ok",
        "uptime_seconds": uptime,
        "version": "1.0.0"
    }
