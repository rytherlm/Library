from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class BookSearch(Resource):
    def get(self):
        count = len(request.args)
        sql = "SELECT * FROM book WHERE"
        params = []
        for i, key in enumerate(request.args.keys()):
            value = request.args[key]
            sql = f"{sql} LOWER({key}) LIKE %s"
            params.append(f"%{value.lower()}%")
            if(i < count-1):
                sql = sql + " AND "
        result = exec_get_all(sql, params)
        return result