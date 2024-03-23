from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Friends(Resource):
    def get(self):
        count = len(request.args)
        sql = ""
        params = []
        for i, key in enumerate(request.args.keys()):
            value = request.args[key]
            if(key == "username"):
                sql = "SELECT userid FROM bookuser WHERE username = %s"
                userid = exec_get_one(sql, (value,))
                sql = "SELECT friendid FROM friends WHERE userid = %s"
                friendids = exec_get_all(sql, (userid[0],))
                returnResult = []
                for friendid in friendids:
                    sql = "SELECT userid, username, firstname, lastname FROM bookuser WHERE userid = %s"
                    result = exec_get_one(sql, (friendid[0],))
                    returnResult.append(result)
                return returnResult
        result = exec_get_all(sql, params)
        return result

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


