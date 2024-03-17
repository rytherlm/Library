from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Contributor(Resource):
    def get(self, contributor_id=None):
        if contributor_id is not None:
            sql = "SELECT * FROM Contributor WHERE ContributorID = %s"
            result = exec_get_one(sql, (contributor_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Contributor"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('ContributorID', type=int, required=True)
        parser.add_argument('FirstName', required=True)
        parser.add_argument('LastName', required=True)
        args = parser.parse_args()

        sql = "UPDATE Contributor SET FirstName = %s, LastName = %s WHERE ContributorID = %s"
        if exec_commit(sql, (args['FirstName'], args['LastName'], args['ContributorID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('FirstName', required=True)
        parser.add_argument('LastName', required=True)
        args = parser.parse_args()

        sql = "INSERT INTO Contributor (FirstName, LastName) VALUES (%s, %s)"
        if exec_commit(sql, (args['FirstName'], args['LastName'])):
            return 201,
        return 404

    def delete(self):
        contributor_id = request.args.get('ContributorID', type=int)
        if contributor_id:
            sql = "DELETE FROM Contributor WHERE ContributorID = %s"
            if exec_commit(sql, (contributor_id,)):
                return 200
            return 404
        return 400

