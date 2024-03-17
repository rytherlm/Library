from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Format(Resource):
    def get(self, book_id=None):
        if book_id is not None:
            sql = "SELECT * FROM Format WHERE BookID = %s"
            result = exec_get_one(sql, (book_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Format"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('Format', required=True, choices=('E-Book', 'Paperback'))
        args = parser.parse_args()

        sql = "UPDATE Format SET Format = %s WHERE BookID = %s"
        if exec_commit(sql, (args['Format'], args['BookID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('Format', required=True, choices=('E-Book', 'Paperback'))
        args = parser.parse_args()

        book_exists_sql = "SELECT EXISTS(SELECT 1 FROM Book WHERE BookID = %s)"
        book_exists = exec_get_one(book_exists_sql, (args['BookID'],))
        if not book_exists or not book_exists[0]:
            return 404

        sql = "INSERT INTO Format (BookID, Format) VALUES (%s, %s)"
        if exec_commit(sql, (args['BookID'], args['Format'])):
            return 201,
        return 404

    def delete(self):
        book_id = request.args.get('BookID', type=int)
        if book_id:
            sql = "DELETE FROM Format WHERE BookID = %s"
            if exec_commit(sql, (book_id,)):
                return 200
            return 404
        return 400

