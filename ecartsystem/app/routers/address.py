from fastapi import APIRouter,Depends,HTTPException,status
from app.core.db import get_db
from app.models.address_model import Address
from app.schema.address_schema import AddressInfo,AddressCreate, AddressReturn
from app.dependencies.secure_login import get_current_user

router = APIRouter(prefix="/address")

@router.post("/add")
async def info_getter(
    data: AddressCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_address = db.query(Address).filter(Address.user_id == current_user.id).all()

    dump_address_detail = data.model_dump()
    dump_address_detail["user_id"] = current_user.id

    dump_address_detail["address_type"] = data.address_type.value

    if not user_address:
        dump_address_detail["is_default"] = True

        address_detail = Address(**dump_address_detail)
        db.add(address_detail)
        db.commit()
        db.refresh(address_detail)

        return {"msg": "successfully created first address of user"}

    # prevent duplicate address type
    for addr in user_address:
        if str(addr.address_type).upper() == str(data.address_type).upper():
            return {"msg": "Your address is already registered"}

    # second / additional address
    dump_address_detail["is_default"] = False

    address_detail = Address(**dump_address_detail)
    db.add(address_detail)
    db.commit()
    db.refresh(address_detail)

    return {"msg": "successfully created address"}

@router.get("/",response_model=AddressReturn)
def get_address(db=Depends(get_db),current_user=Depends(get_current_user)):
    user_address = db.query(Address).filter(Address.user_id == current_user.id).all()
    if not user_address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No address available")
    return {
        "Info": user_address
    }

@router.put("/{selected_id}")
def get_address(selected_id:int ,db=Depends(get_db),current_user=Depends(get_current_user)):
    user_address = db.query(Address).filter(Address.user_id == current_user.id).all()
    if not user_address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No address available")
    for addr in user_address:
        if addr.id == selected_id:
            addr.is_default = True
        else:
            addr.is_default = False
        
    db.commit()
    return {
        "success":"address has been updated"
    }