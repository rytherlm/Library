from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Genres(Resource):
    def get(self, genre_id=None):
        if genre_id is not None:
            sql = "SELECT * FROM Genres WHERE GenreID = %s"
            result = exec_get_one(sql, (genre_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Genres"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('GenreID', type=int, required=True)
        parser.add_argument('Genre', required=True)
        args = parser.parse_args()

        sql = "UPDATE Genres SET Genre = %s WHERE GenreID = %s"
        if exec_commit(sql, (args['Genre'], args['GenreID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Genre', required=True)
        args = parser.parse_args()

        sql = "INSERT INTO Genres (Genre) VALUES (%s)"
        if exec_commit(sql, (args['Genre'],)):
            return 201,
        return 404

    def delete(self):
        genre_id = request.args.get('GenreID', type=int)
        if genre_id:
            sql = "DELETE FROM Genres WHERE GenreID = %s"
            if exec_commit(sql, (genre_id,)):
                return 200
            return 404
        return 400

