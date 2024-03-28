from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class CollectionSearch(Resource):
    def get(self):
        for i, key in enumerate(request.args.keys()):
            username = request.args[key]
            if username is not None:
                sql = "SELECT c.collectionid, collectionname, count(s.bookid), sum(b.length) FROM collection as c left join stores as s on (c.collectionid = s.collectionid) left join book as b on (s.bookid = b.bookid) WHERE username LIKE %s GROUP BY (collectionname, c.collectionid) ORDER BY collectionname"
                #sql = "SELECT collectionid, collectionname FROM collection WHERE username LIKE %s"
                result = exec_get_all(sql, (f"{username}",))
                return result, 200
        return [], 401
        