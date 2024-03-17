from flask import jsonify
from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class BookUser(Resource):
    def get(self, user_id=None):
        if user_id is not None:
            sql = "SELECT * FROM BookUser WHERE UserID = %s"
            result = exec_get_one(sql, (user_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM BookUser"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('Username', required=True)
        parser.add_argument('Password', required=True)
        parser.add_argument('FirstName', required=True)
        parser.add_argument('LastName', required=True)
        parser.add_argument('LastAccess', required=True)
        parser.add_argument('CreationDate', required=True)
        args = parser.parse_args()

        sql = "UPDATE BookUser SET Username = %s, Password = %s, FirstName = %s, LastName = %s, LastAccess = %s, CreationDate = %s WHERE UserID = %s"
        if exec_commit(sql, (args['Username'], args['Password'], args['FirstName'], args['LastName'], args['LastAccess'], args['CreationDate'], args['UserID'],)):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', required=True)
        parser.add_argument('Password', required=True)
        parser.add_argument('FirstName', required=True)
        parser.add_argument('LastName', required=True)
        parser.add_argument('LastAccess', required=True)
        parser.add_argument('CreationDate', required=True)
        args = parser.parse_args()

        sql = "INSERT INTO BookUser (Username, Password, FirstName, LastName, LastAccess, CreationDate) VALUES (%s, %s, %s, %s, %s, %s)"
        if exec_commit(sql, (args['Username'], args['Password'], args['FirstName'], args['LastName'], args['LastAccess'], args['CreationDate'],)):
            return 201,
        return 404

    def delete(self):
        user_id = request.args.get('UserID', type=int)
        if user_id:
            sql = "DELETE FROM BookUser WHERE UserID = %s"
            if exec_commit(sql, (user_id,)):
                return 200
            return 404
        return 400


   
