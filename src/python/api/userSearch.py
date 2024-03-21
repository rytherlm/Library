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
                sql = "SELECT userid FROM email WHERE emailaddress = %s"
                userid = exec_get_one(sql, (value,))
                sql = "SELECT userid, username, firstname, lastname FROM bookuser WHERE userid = %s"
                params.append(userid[0])
        result = exec_get_all(sql, params)
        return result