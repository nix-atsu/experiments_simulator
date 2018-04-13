import os
import sqlalchemy
from experiments import config


def connect_url(url):
    """
        Helper that returns a connection and a metadata object
        :param url: fully formed db url
    """

    # echo=True logs all sql queries
    con = sqlalchemy.create_engine(url, client_encoding='utf8', echo=True)
    meta = sqlalchemy.MetaData(bind=con, reflect=True)

    return con, meta


def connect_specific(user, password, db, host='localhost', port=5433):
    """
        Helper that forms url (e.g. "postgresql://user:pass@localhost:5433/experiments")
        and returns a connection and a metadata object
    """

    url = 'postgresql://{}:{}@{}:{}/{}'
    url = url.format(user, password, host, port, db)
    return connect_url(url)


def connect():
    url = os.environ.get("DATABASE_URL")
    if url:
        return connect_url(url)
    else:
        return connect_specific(config.DB_USER, config.DB_PASS, config.DB_NAME, config.DB_HOST, config.DB_PORT)
