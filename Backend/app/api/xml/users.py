
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.users import User, TokenBlocklist
from app.schemas.users import (
    UserCreate, 
    UserLogin, 
    UserOut, 
    ProfileUpdate, 
    ChangePasswordRequest
)
from app.schemas.responses import APIResponse
from app.core.security import Security, create_access_token, get_current_user, get_jti
from typing import Dict, Any

router = APIRouter()

# ==================== AUTH ENDPOINTS ====================

@router.post("/", response_model=APIResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user and return an access token for immediate login."""
    
    # Check if username already exists BEFORE trying to insert
    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose a different username."
        )
    
    # Check if email already exists BEFORE trying to insert
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please use a different email."
        )
    
    try:
        # 1. Hash the password
        hashed_password = Security.get_password_hash(user_in.password)

        # 2. Create the user object
        new_user = User(
            username=user_in.username,
            name=user_in.name,
            email=user_in.email,
            password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # 3. Generate token for immediate login
        access_token = create_access_token(data={"sub": new_user.username})
        
        return APIResponse(
            status="success", 
            message="User created successfully",
            data={
                "access_token": access_token, 
                "token_type": "bearer",
                "user": UserOut.model_validate(new_user) 
            }
        )

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=APIResponse[Dict[str, Any]])
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    user = db.query(User).filter(User.username == data.username).first()
    
    if not user or not Security.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid username or password"
        )
    
    token = create_access_token(data={"sub": user.username})

    return APIResponse(
        status="success", 
        message="Login successful",
        data={
            "access_token": token, 
            "token_type": "bearer",
            "user": UserOut.model_validate(user) 
        }
    )


@router.post("/logout", response_model=APIResponse)
def logout(
    current_user: User = Depends(get_current_user), 
    token_data: dict = Depends(get_jti), 
    db: Session = Depends(get_db)
):
    """Blacklist the current token to log the user out."""
    db.add(TokenBlocklist(jti=token_data["jti"]))
    db.commit()
    
    return APIResponse(
        status="success",
        message="Logged out successfully",
        data={}
    )

# ==================== USER PROFILE ENDPOINTS ====================

@router.get("/iam", response_model=APIResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get details of the currently authenticated user."""
    return APIResponse(
        status="success",
        message="Authenticated User",
        data={"user": UserOut.model_validate(current_user)}
    )


@router.put("/me", response_model=APIResponse)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile (name and/or email)."""
    try:
        if data.name:
            current_user.name = data.name
        
        if data.email:
            existing = db.query(User).filter(
                User.email == data.email, 
                User.username != current_user.username
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            current_user.email = data.email
        
        db.commit()
        db.refresh(current_user)
        
        return APIResponse(
            status="success",
            message="Profile updated successfully",
            data={"user": UserOut.model_validate(current_user)}
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.put("/me/password", response_model=APIResponse)
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password after verifying current password."""
    if not Security.verify_password(data.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    current_user.password = Security.get_password_hash(data.new_password)
    db.commit()
    
    return APIResponse(
        status="success",
        message="Password changed successfully",
        data={"user": UserOut.model_validate(current_user)}
    )