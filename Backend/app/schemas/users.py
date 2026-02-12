from pydantic import BaseModel, EmailStr, ConfigDict, Field

# 1. Base schema for shared fields
class UserBase(BaseModel):
    username: str
    name: str
    email: EmailStr

# 2. What we expect for Login (The missing piece in your error!)
class UserLogin(BaseModel):
    username: str
    password: str

# 3. What we expect for Registration
class UserCreate(UserBase):
    password: str

# 4. What we expect for Password Updates
class PasswordUpdate(BaseModel):
    password: str
    newpassword: str = Field(..., min_length=8)
    renewpassword: str

# 5. Profile Update Schema
class ProfileUpdate(BaseModel):
    name: str = None
    email: EmailStr = None

# 6. Change Password Schema
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

# 7. What the API returns (The "Safe" version)
class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)