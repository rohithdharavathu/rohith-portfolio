from fastapi import APIRouter, HTTPException
from services.github_service import fetch_node, VALID_NODES

router = APIRouter()


@router.get("/{node_path:path}")
async def get_content(node_path: str):
    if node_path not in VALID_NODES:
        raise HTTPException(status_code=404, detail=f"Node '{node_path}' not found")

    try:
        content = await fetch_node(node_path)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    if not content:
        raise HTTPException(status_code=404, detail="Content not available")

    return {"node": node_path, "content": content}
