from sqlalchemy import String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database import Base  
class Report(Base):
    __tablename__ = "reports"

    file_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    file_name: Mapped[str] = mapped_column(String(80), nullable=False)
    is_valid: Mapped[bool] = mapped_column(default=True)
    error_msg: Mapped[str] = mapped_column(Text, nullable=True)
    # validated_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    validated_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False)
    file_type: Mapped[str] = mapped_column(String(60), nullable=False)
    username: Mapped[str] = mapped_column(String(40), ForeignKey("users.username"), nullable=False)
    execution_time: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)