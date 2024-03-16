from flask_restful import Resource
from flask_restful import reqparse
from .utils import *


class Book(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('BookID', type=int, store_missing=False)
    parser.add_argument('Title', store_missing=False)
    parser.add_argument('ReleaseDate', store_missing=False)
    parser.add_argument('Length', type=int, store_missing=False)
    parser.add_argument('Audience', store_missing=False)

    def get(self):
        args = self.parser.parse_args(strict=False) 
        if 'BookID' in args:
            sql = "SELECT * FROM Book WHERE BookID = %s"
            result = exec_get_one(sql, (args['BookID'],))
        else:
            sql = "SELECT * FROM Book"
            result = exec_get_all(sql)
        return result if result else {'message': 'Book not found'}, 404

    def put(self):
        args = self.parser.parse_args()
        sql = "UPDATE Book SET Title = %s, ReleaseDate = %s, Length = %s, Audience = %s WHERE BookID = %s"
        exec_commit(sql, (args['Title'], args['ReleaseDate'], args['Length'], args['Audience'], args['BookID']))
        return {'message': 'Book updated successfully'}

    def post(self):
        args = self.parser.parse_args()
        sql = "INSERT INTO Book (Title, ReleaseDate, Length, Audience) VALUES (%s, %s, %s, %s)"
        exec_commit(sql, (args['Title'], args['ReleaseDate'], args['Length'], args['Audience']))
        return {'message': 'Book created successfully'}

    def delete(self):
        args = self.parser.parse_args()
        sql = "DELETE FROM Book WHERE BookID = %s"
        exec_commit(sql, (args['BookID'],))
        return {'message': 'Book deleted successfully'}
