from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Editor(Resource):
    def get(self, contributor_id=None):
        if contributor_id is not None:
            sql = "SELECT * FROM Editor WHERE ContributorID = %s"
            result = exec_get_one(sql, (contributor_id,))
            if result:
                return result, 200
            else:
                return {}, 404
        else:
            sql = "SELECT * FROM Editor"
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

        sql_insert_contributor = "INSERT INTO Contributor (FirstName, LastName) VALUES (%s, %s) RETURNING ContributorID"
        result = exec_commit(sql_insert_contributor, (args['FirstName'], args['LastName']))
        
        if result:
            contributor_id = result
            sql_insert_editor = "INSERT INTO Editor (ContributorID) VALUES (%s)"
            if exec_commit(sql_insert_editor, (contributor_id,)):
                return 201
        return 404

    def delete(self):
        contributor_id = request.args.get('ContributorID', type=int)
        if contributor_id:
            sql_delete_editor = "DELETE FROM Editor WHERE ContributorID = %s"
            exec_commit(sql_delete_editor, (contributor_id,))
            
            sql_delete_contributor = "DELETE FROM Contributor WHERE ContributorID = %s"
            if exec_commit(sql_delete_contributor, (contributor_id,)):
                return 200
            return 404
        return 400
