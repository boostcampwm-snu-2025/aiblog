from typing import Iterator
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from backend.settings import DB_SETTINGS

SQLALCHEMY_DATABASE_URL = DB_SETTINGS.DATABASE_URL

class DBSessionFactory:
    def __init__(self) -> None:
        self._engine: sqlalchemy.Engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,
        )
        self._session_maker: sessionmaker = sessionmaker(bind=self._engine)

    def make_session(self) -> Session:
        return self._session_maker()

def get_db_session() -> Iterator[Session]:
    session = DBSessionFactory().make_session()
    try:
        yield session
    finally:
        session.commit()
        session.close()

Base = declarative_base()
