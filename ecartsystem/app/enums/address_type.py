from enum import Enum

class AddressType(str,Enum):
    work ="work"
    home="home"
    other ="other"
    