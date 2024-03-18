from flask_restful import Resource
from flask_restful import request
from flask_restful import reqparse
from .utils import *
from flask_bcrypt import Bcrypt

class BookUser(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Password', location='args')
        args = parser.parse_args()

        username = args.get('Username')
        password = args.get('Password')

        if not username or not password:
            return 400

        sql = "SELECT * FROM BookUser WHERE Username = %s AND Password = %s"
        result = exec_get_one(sql, (username, password))

        if result is None:
            return {"message": "Unauthorized"}, 401
        else:
            # If a user is found, proceed with logging them in
            return {"message": "Authorized"}, 200


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
        
        hash = Bcrypt().generate_password_hash(args['Password']).decode('utf-8')

        sql = "INSERT INTO BookUser (Username, Password, FirstName, LastName, LastAccess, CreationDate) VALUES (%s, %s, %s, %s, %s, %s)"
        if exec_commit(sql, (args['Username'], hash, args['FirstName'], args['LastName'], args['LastAccess'], args['CreationDate'],)):
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


   
