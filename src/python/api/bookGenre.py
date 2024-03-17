from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class BookGenre(Resource):
    def get(self, book_id=None):
        if book_id is not None:
            sql = "SELECT * FROM BookGenre WHERE BookID = %s"
            result = exec_get_all(sql, (book_id,))
            if result:
                return result, 200
            else:
                return {}, 404
        else:
            sql = "SELECT * FROM BookGenre"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('GenreID', type=int, required=True)
        args = parser.parse_args()

        sql = "UPDATE BookGenre SET GenreID = %s WHERE BookID = %s"
        if exec_commit(sql, (args['GenreID'], args['BookID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('GenreID', type=int, required=True)
        args = parser.parse_args()

        sql = "INSERT INTO BookGenre (BookID, GenreID) VALUES (%s, %s)"
        if exec_commit(sql, (args['BookID'], args['GenreID'])):
            return 201
        return 404

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('GenreID', type=int, required=True)
        args = parser.parse_args()

        sql = "DELETE FROM BookGenre WHERE BookID = %s AND GenreID = %s"
        if exec_commit(sql, (args['BookID'], args['GenreID'])):
            return 200
        return 404


