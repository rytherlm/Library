from flask_restful import Resource
from flask_restful import reqparse
from flask_restful import request
from .utils import *


class Book(Resource):
    def get(self):
        book_id = request.args.get('BookID', type=int)
        if book_id is not None:
            sql = "SELECT * FROM Book WHERE BookID = %s"
            result = exec_get_one(sql, (book_id,))
            if result:
                return result, 200  
            else:
                return 404
        else:
            sql = "SELECT * FROM Book"
            result = exec_get_all(sql)
            return result if result else [], 200 

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('Title', required=True)
        parser.add_argument('ReleaseDate', required=True)
        parser.add_argument('Length', type=int, required=True)
        parser.add_argument('Audience', required=True)
        args = parser.parse_args()

        sql = "UPDATE Book SET Title = %s, ReleaseDate = %s, Length = %s, Audience = %s WHERE BookID = %s"
        exec_commit(sql, (args['Title'], args['ReleaseDate'], args['Length'], args['Audience'], args['BookID']))
        return 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Title', required=True)
        parser.add_argument('ReleaseDate', required=True)
        parser.add_argument('Length', type=int, required=True)
        parser.add_argument('Audience', required=True)
        args = parser.parse_args()

        sql = "UPDATE Book SET Title = %s, ReleaseDate = %s, Length = %s, Audience = %s WHERE BookID = %s"
        exec_commit(sql, (args['Title'], args['ReleaseDate'], args['Length'], args['Audience']))
        return 201
        

    def delete(self):
        book_id = request.args.get('BookID', type=int)
        if book_id:
            sql = "DELETE FROM Book WHERE BookID = %s"
            exec_commit(sql, (book_id,))
            return 200
        return 400