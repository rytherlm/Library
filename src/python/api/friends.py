from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Friends(Resource):
    def get(self, user_id=None):
        if user_id is not None:
            sql = "SELECT FriendID FROM Friends WHERE UserID = %s"
            friends = exec_get_all(sql, (user_id,))
            if friends:
                return friends, 200
            else:
                return 404
        else:
            return 400 

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('FriendID', type=int, required=True)
        args = parser.parse_args()

        user_exists_sql = "SELECT EXISTS(SELECT 1 FROM BookUser WHERE UserID = %s)"
        user_exists = exec_get_one(user_exists_sql, (args['UserID'],))
        friend_exists = exec_get_one(user_exists_sql, (args['FriendID'],))

        if not user_exists[0] or not friend_exists[0]:
            return 404

        sql = "INSERT INTO Friends (UserID, FriendID) VALUES (%s, %s)"
        success = exec_commit(sql, (args['UserID'], args['FriendID']))

        if success:
            return 201,
        return 404

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('FriendID', type=int, required=True)
        args = parser.parse_args()

        sql = "DELETE FROM Friends WHERE UserID = %s AND FriendID = %s"
        success = exec_commit(sql, (args['UserID'], args['FriendID']))

        if success:
            return 200
        return 404


