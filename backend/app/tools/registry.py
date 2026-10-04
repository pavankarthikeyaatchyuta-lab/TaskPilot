from typing import Dict, Any, Optional
from app.tools.base import BaseTool
from app.tools.implementations import (
    SearchOpportunitiesTool,
    EvaluateEligibilityTool,
    CalculateMatchScoreTool,
    AddToTrackerTool,
    UpdateApplicationTool,
    GetPendingFollowupsTool,
    GenerateFollowupTool,
    RequestHumanApprovalTool,
    ExecuteApprovedActionTool,
    VerifyActionTool,
)

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self.register(SearchOpportunitiesTool())
        self.register(EvaluateEligibilityTool())
        self.register(CalculateMatchScoreTool())
        self.register(AddToTrackerTool())
        self.register(UpdateApplicationTool())
        self.register(GetPendingFollowupsTool())
        self.register(GenerateFollowupTool())
        self.register(RequestHumanApprovalTool())
        self.register(ExecuteApprovedActionTool())
        self.register(VerifyActionTool())

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def list_tools(self) -> Dict[str, Dict[str, Any]]:
        return {
            name: {
                "name": tool.name,
                "description": tool.description,
                "permission_level": tool.permission_level
            }
            for name, tool in self._tools.items()
        }

tool_registry = ToolRegistry()
