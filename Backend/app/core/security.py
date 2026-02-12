import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models.users import User, TokenBlocklist

# 1. Define the Scheme (This adds the "Lock" icon and "JWT Required" to Swagger)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/users/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

class Security:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # Truncate to 72 to handle the bcrypt limit we hit earlier
        return pwd_context.verify(plain_password[:72], hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    
    # Add 'jti' (Unique Token ID) for the logout/blocklist feature to work
    to_encode.update({
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "iat": datetime.now(timezone.utc)
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

# 2. The Dependency that forces "JWT Required"
def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        jti: str = payload.get("jti")
        
        if username is None or jti is None:
            raise credentials_exception
            
        # 3. Check if token is blacklisted (Logout logic)
        blacklisted = db.query(TokenBlocklist).filter(TokenBlocklist.jti == jti).first()
        if blacklisted:
            raise HTTPException(status_code=401, detail="Session Expired please Login")

    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# 4. Specific dependency to get JTI for the logout route
def get_jti(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return {"jti": payload.get("jti")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
# You'll also need these for your router dependencies later
# def get_current_user():
#     # Placeholder for the dependency logic we'll add next
#     pass

# def get_jti():
#     # Placeholder for logout/blocklist logic
#     pass