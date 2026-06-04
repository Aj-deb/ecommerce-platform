from pydantic import BaseModel

class CancelOrderResponse(BaseModel):
    success: bool
    order_id: int
    new_status: str