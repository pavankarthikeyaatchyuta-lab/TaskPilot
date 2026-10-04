from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel
import time

class ToolResult(BaseModel):
    success: bool
    data: Any = None
    error: Optional[str] = None
    execution_time_ms: int = 0
    verification_passed: bool = True
    verification_notes: Optional[str] = None

class BaseTool(ABC):
    name: str
    description: str
    permission_level: str = "SAFE"  # "SAFE" or "CONSEQUENT"

    async def run(self, **kwargs) -> ToolResult:
        start = time.time()
        try:
            result_data = await self._execute(**kwargs)
            duration_ms = int((time.time() - start) * 1000)
            
            # Verify if applicable
            v_passed, v_notes = await self._verify(result_data, **kwargs)
            
            return ToolResult(
                success=True,
                data=result_data,
                execution_time_ms=duration_ms,
                verification_passed=v_passed,
                verification_notes=v_notes,
            )
        except Exception as e:
            duration_ms = int((time.time() - start) * 1000)
            return ToolResult(
                success=False,
                error=str(e),
                execution_time_ms=duration_ms,
                verification_passed=False,
                verification_notes=f"Execution failed: {str(e)}"
            )

    @abstractmethod
    async def _execute(self, **kwargs) -> Any:
        pass

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        """Default verification passes; override for tools requiring explicit confirmation."""
        return True, "Default verification passed"
