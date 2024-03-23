from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class UserSearch(Resource):
    def get(self):
        params = []
        for i, key in enumerate(request.args.keys()):
            value = request.args[key]
            if(key == "username"):
                sql = "SELECT userid, username, firstname, lastname FROM bookuser WHERE LOWER(username) LIKE %s"
                params.append(f"%{value.lower()}%")
            elif(key == "email"):
                sql = "SELECT userid FROM email WHERE emailaddress LIKE %s"
                userid = exec_get_one(sql, ((f"%{value}%"),))
                if(userid is None):
                    return []
                sql = "SELECT userid, username, firstname, lastname FROM bookuser WHERE userid = %s"
                params.append(userid[0])
        result = exec_get_all(sql, params)
        print(result)
        return result