from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Track(Resource):
    def get(self, user_id=None, book_id=None):
        if user_id and book_id:
            sql = "SELECT * FROM Track WHERE UserID = %s AND BookID = %s"
            result = exec_get_one(sql, (user_id, book_id))
            if result:
                return result, 200
            return 404
        elif user_id:
            sql = "SELECT * FROM Track WHERE UserID = %s"
            result = exec_get_all(sql, (user_id,))
            if result:
                return result, 200
            return 404
        elif book_id:
            sql = "SELECT * FROM Track WHERE BookID = %s"
            result = exec_get_all(sql, (book_id,))
            if result:
                return result, 200
            return 404
        else:
            sql = "SELECT * FROM Track"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('Rating', type=int)
        parser.add_argument('Progress', type=int)
        parser.add_argument('Status', choices=('Unread', 'Reading', 'Read'))
        args = parser.parse_args()

        sql = """
        UPDATE Track SET Rating = %s, Progress = %s, Status = %s
        WHERE UserID = %s AND BookID = %s
        """
        if exec_commit(sql, (args['Rating'], args['Progress'], args['Status'], args['UserID'], args['BookID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('Rating', type=int)
        parser.add_argument('Progress', type=int)
        parser.add_argument('Status', choices=('Unread', 'Reading', 'Read'))
        args = parser.parse_args()

        sql = """
        INSERT INTO Track (UserID, BookID, Rating, Progress, Status)
        VALUES (%s, %s, %s, %s, %s)
        """
        if exec_commit(sql, (args['UserID'], args['BookID'], args['Rating'], args['Progress'], args['Status'])):
            return 201,
        return 404

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('BookID', type=int, required=True)
        args = parser.parse_args()

        sql = "DELETE FROM Track WHERE UserID = %s AND BookID = %s"
        if exec_commit(sql, (args['UserID'], args['BookID'])):
            return 200
        return 404

