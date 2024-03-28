from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class RandomBook(Resource):
    def get(self):
        for i, key in enumerate(request.args.keys()):
            collection_id = request.args[key]
            sql = "SELECT b.bookid, title FROM stores as s left join book as b on (s.bookid = b.bookid) WHERE CollectionID = %s ORDER BY random()"
            result = exec_get_one(sql, (collection_id,))
            if result:
                return result, 200
            else:
                return 404