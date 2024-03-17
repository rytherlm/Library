from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Email(Resource):
    def get(self, user_id=None):
        if user_id is not None:
            sql = "SELECT * FROM Email WHERE UserID = %s"
            result = exec_get_one(sql, (user_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Email"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('EmailAddress', required=True)
        args = parser.parse_args()

        sql = "UPDATE Email SET EmailAddress = %s WHERE UserID = %s"
        if exec_commit(sql, (args['EmailAddress'], args['UserID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('EmailAddress', required=True)
        args = parser.parse_args()

        # Ensure the user exists before adding an email address
        user_exists_sql = "SELECT EXISTS(SELECT 1 FROM BookUser WHERE UserID = %s)"
        user_exists = exec_get_one(user_exists_sql, (args['UserID'],))
        if not user_exists or not user_exists[0]:
            return 404  # Could indicate that the user does not exist

        sql = "INSERT INTO Email (UserID, EmailAddress) VALUES (%s, %s)"
        if exec_commit(sql, (args['UserID'], args['EmailAddress'])):
            return 201,
        return 404

    def delete(self):
        user_id = request.args.get('UserID', type=int)
        if user_id:
            sql = "DELETE FROM Email WHERE UserID = %s"
            if exec_commit(sql, (user_id,)):
                return 200
            return 404
        return 400

