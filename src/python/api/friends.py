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
            elif(key == "currentuser" or key == "checkuser"):
                currentUser = request.args.get("currentuser")
                checkUser = request.args.get("checkuser")
                currentID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (currentUser,))
                checkID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (checkUser,))
                result = exec_get_all("SELECT * FROM friends WHERE userid = %s AND friendid = %s", (currentID[0], checkID[0],))
                return result
        result = exec_get_all(sql, params)
        return result

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('currentuser', required=True)
        parser.add_argument('checkuser', required=True)
        args = parser.parse_args()
        currentUser = args['currentuser']
        checkUser = args['checkuser']
        currentID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (currentUser,))
        checkID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (checkUser,))
        sql = "INSERT INTO Friends (UserID, FriendID) VALUES (%s, %s)"
        success = exec_commit(sql, (currentID[0], checkID[0],))
        if success:
            return 200,
        return 404

    def delete(self):
        currentUser = request.args.get("currentuser")
        checkUser = request.args.get("checkuser")
        currentID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (currentUser,))
        checkID = exec_get_one("SELECT userid FROM bookuser WHERE username = %s", (checkUser,))
        sql = "DELETE FROM Friends WHERE UserID = %s AND FriendID = %s"
        success = exec_commit(sql, (currentID[0], checkID[0]))
        if success:
            return 200,
        return 404


