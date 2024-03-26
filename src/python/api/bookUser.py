from datetime import datetime
from flask_restful import Resource
from flask_restful import request
from flask_restful import reqparse
import hashlib
from .utils import *

class BookUser(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Password', location='args')
        args = parser.parse_args()

        username = args.get('Username')
        password = args.get('Password')
        if not username:
            return 400

        sql = "SELECT userid, username, password FROM BookUser WHERE Username LIKE %s"
        result = exec_get_all(sql, (f"{username}%",))
        if result == []:
            return {"message": "Unauthorized"}, 401
        elif (not password is None):
            if result[0][2] == hashlib.sha512(password.encode('utf-8')).hexdigest():
                user_id = result[0][0]  
                access_time = datetime.now()
                timesql = "INSERT INTO UserAccessTimes (UserID, AccessTime) VALUES (%s, %s)"
                exec_commit(timesql, (user_id, access_time))
                return {"message": "Authorized", "data": result}, 200
            else:
                return {"message": "Unauthorized"}, 401
        else:
            result = exec_get_all("SELECT username, firstname, lastname FROM bookuser WHERE Username LIKE %s", (f"{username}%",))
            return {"message": "Unauthorized", "data": result}, 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('Username', required=True)
        parser.add_argument('Password', required=True)
        parser.add_argument('FirstName', required=True)
        parser.add_argument('LastName', required=True)
        parser.add_argument('CreationDate', required=True)
        args = parser.parse_args()

        sql = "UPDATE BookUser SET Username = %s, Password = %s, FirstName = %s, LastName = %s, CreationDate = %s WHERE UserID = %s"
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
        parser.add_argument('Email', required=True)
        args = parser.parse_args()        
        
        checkUserName = "SELECT 1 FROM BookUser WHERE Username = %s" 
        if exec_get_one(checkUserName, (args['Username'],)):
            return {"message": "Username already exists"}, 409

        checkEmail = "SELECT 1 FROM Email WHERE EmailAddress = %s"
        if exec_get_one(checkEmail, (args['Email'],)):
            return {"message": "Email already exists"}, 409
        
        creation_date = datetime.now()

        sql = "INSERT INTO BookUser (Username, Password, FirstName, LastName, CreationDate) VALUES (%s, %s, %s, %s, %s) RETURNING UserID;"
        Uid = exec_commit(sql, (args['Username'], hashlib.sha512(args['Password'].encode('utf-8')).hexdigest(), args['FirstName'], args['LastName'], creation_date))
        
        if Uid:
            email_insert_sql = "INSERT INTO Email (UserID, EmailAddress) VALUES (%s, %s);"
            exec_commit(email_insert_sql, (Uid, args['Email']))
            
            access_sql = "INSERT INTO UserAccessTimes (UserID, AccessTime) VALUES (%s, %s);"
            exec_commit(access_sql, (Uid, datetime.now()))
            
            return {"message": "User created successfully", "UserID": Uid}, 201
        return 400

    def delete(self):
        user_id = request.args.get('UserID', type=int)
        if user_id:
            sql = "DELETE FROM BookUser WHERE UserID = %s"
            if exec_commit(sql, (user_id,)):
                return 200
            return 404
        return 400


   
