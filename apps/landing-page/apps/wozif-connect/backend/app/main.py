from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from .executor import WorkflowExecutor
import os
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Wozif Connect - Automation Engine (Python)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import List, Dict, Any, Optional, Union

class WorkflowNode(BaseModel):
    id: Union[str, int]
    type: str
    name: str
    config: Optional[str] = "{}"

    class Config:
        extra = "allow"

class WorkflowData(BaseModel):
    nodes: List[WorkflowNode]
    context: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Wozif Python Automation Engine is running"}

@app.post("/execute")
async def execute_workflow(data: WorkflowData):
    executor = WorkflowExecutor(data.nodes, data.context)
    try:
        result = await executor.run()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
