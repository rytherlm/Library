from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class CollectionSearch(Resource):
    def get(self):
        if self is not None:
            username=""
            sql = "SELECT collectionname FROM collection WHERE username LIKE %s"
            result = exec_get_all(sql, (f"%{username}%",))
            return [f"{self}"], 200
        else:
            return [], 401