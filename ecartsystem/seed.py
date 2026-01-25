from fastapi import FastAPI,Depends
from models.roles_model import Roles,Permissions,Role_permission
app = FastAPI()

def create_on_startup(db):
    default_roles = ["admin","customer","manager","seller"]
    for roles in default_roles:
        user_exist = db.query(Roles).filter(Roles.role_name == roles).first()
        if user_exist:
            continue
        else:
            createrole= Roles(role_name = roles)
            db.add(createrole)

    permission_list = [
        "user:allusers",
        "user:delete",
        "user:block",
        
        "product:create",
        "product:update",
        "product:delete",
        "product:addtocart",
        "product:orderProduct",
        "product:cancel",
        
        "theme:changetheme"
    ]
    for permission in permission_list:
        permission_exist = db.query(Permissions).filter(Permissions.permissions == permission).first()
        if permission_exist:
            continue 
        else:
            createPermission= Permissions(permissions = permission  )
            db.add(createPermission)

    db.commit()  
    roles_permissions = {
        "admin":[
            "user:allusers",
            "user:delete",
            "user:block",
            "product:create",
            "product:update",
            "product:delete",
            "theme:changetheme"
        ],
        "customer":[
            "product:create",
            "product:update",
            "product:status",
            "product:addtocart",
            "product:orderProduct",
            "product:cancel",
        ],
        "seller":[
            "product:create",
            "product:update",
            "product:delete",
            "product:discount",
            "product:price",
            "product:outofStock",
            "product:status"
        ],
        "manager":[
              "user:block"
        ]
    }
    for key,value in roles_permissions.items():
            r_name = db.query(Roles).filter(Roles.role_name == key).first()
            if not r_name:
                continue
            for item in value:
                item_id = db.query(Permissions).filter(Permissions.permissions == item ).first()
                if not item_id:
                    continue
                exists = db.query(Role_permission).filter(
                    Role_permission.roles_id == r_name.id,
                    Role_permission.permissions_id == item_id.id
                ).first()
                if exists:
                    continue
                data = Role_permission(roles_id = r_name.id, permissions_id = item_id.id )
                db.add(data)
    db.commit()
    db.close()