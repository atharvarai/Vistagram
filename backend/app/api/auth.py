from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, User, Token
from app.services.user_service import UserService
from app.core.auth import get_current_active_user

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=User)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    return UserService.create_user(db, user_data)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = UserService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user 