import psycopg2
import yaml
import os
from sshtunnel import SSHTunnelForwarder

def connect():
    config = {}
    yml_path = os.path.join(os.path.dirname(__file__), '../db.yml')
    with open(yml_path, 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    try:
        with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_username=config['user'],
                                ssh_password=config['password'],
                                remote_bind_address=('127.0.0.1', 5432)) as server:
            server.start()
            conn = psycopg2.connect(database=config['database'],
                                user=config['user'],
                                password=config['password'],
                                host=config['host'],
                                port=server.local_bind_port)
            curs = conn.cursor()
            curs.execute("SELECT * FROM author")
            rows = curs.fetchall()
            print(rows)
            conn.close()
    except Exception as e:
        print("Connection failed", e)

def exec_get_one(sql, args={}):
    config = {}
    yml_path = os.path.join(os.path.dirname(__file__), '../db.yml')
    with open(yml_path, 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    try:
        with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_username=config['user'],
                                ssh_password=config['password'],
                                remote_bind_address=('127.0.0.1', 5432)) as server:
            server.start()
            conn = psycopg2.connect(database=config['database'],
                                user=config['user'],
                                password=config['password'],
                                host=config['host'],
                                port=server.local_bind_port)
            cur = conn.cursor()
            cur.execute(sql, args)
            one = cur.fetchone()
            conn.close()
            return one
    except Exception as e:
        print("Connection failed", e)

def exec_get_all(sql, args={}):
    config = {}
    yml_path = os.path.join(os.path.dirname(__file__), '../db.yml')
    with open(yml_path, 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    try:
        with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_username=config['user'],
                                ssh_password=config['password'],
                                remote_bind_address=('127.0.0.1', 5432)) as server:
            server.start()
            conn = psycopg2.connect(database=config['database'],
                                user=config['user'],
                                password=config['password'],
                                host=config['host'],
                                port=server.local_bind_port)
            cur = conn.cursor()
            cur.execute(sql, args)
            all = cur.fetchall()
            conn.close()
            return all
    except Exception as e:
        print("Connection failed", e)

def exec_commit(sql, args={}):
    config = {}
    yml_path = os.path.join(os.path.dirname(__file__), '../db.yml')
    with open(yml_path, 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    try:
        with SSHTunnelForwarder(('starbug.cs.rit.edu', 22),
                                ssh_username=config['user'],
                                ssh_password=config['password'],
                                remote_bind_address=('127.0.0.1', 5432)) as server:
            server.start()
            conn = psycopg2.connect(database=config['database'],
                                user=config['user'],
                                password=config['password'],
                                host=config['host'],
                                port=server.local_bind_port)
            cur = conn.cursor()
            cur.execute(sql, args)
            conn.commit()
            conn.close()
            return True 
    except Exception as e:
        print("Connection failed", e)
        return False
