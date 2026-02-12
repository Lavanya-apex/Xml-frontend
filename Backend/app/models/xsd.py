#app/models/xsd.py
from sqlalchemy import String,Text, Date,ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date
from app.database import Base
class XSD(Base):
    __tablename__="xsd"
    xsd_id:Mapped[int]=mapped_column(primary_key=True, autoincrement=True)
    xsd_name: Mapped[str] = mapped_column(String(100), nullable=False)
    xsd_content: Mapped[str] = mapped_column(Text, nullable=False)
    username: Mapped[str] = mapped_column(
        String(40), 
        ForeignKey("users.username", ondelete="CASCADE"), 
        nullable=False
    )