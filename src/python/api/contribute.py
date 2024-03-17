from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Contribute(Resource):
    def get(self, book_id=None, contributor_id=None):
        if book_id and contributor_id:
            sql = "SELECT * FROM Contribute WHERE BookID = %s AND ContributorID = %s"
            result = exec_get_one(sql, (book_id, contributor_id))
        elif book_id:
            sql = "SELECT * FROM Contribute WHERE BookID = %s"
            result = exec_get_all(sql, (book_id,))
        elif contributor_id:
            sql = "SELECT * FROM Contribute WHERE ContributorID = %s"
            result = exec_get_all(sql, (contributor_id,))
        else:
            sql = "SELECT * FROM Contribute"
            result = exec_get_all(sql)

        if result:
            return result, 200
        return 404

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('ContributorID', type=int, required=True)
        args = parser.parse_args()

        sql = "UPDATE Contribute SET BookID = %s WHERE ContributorID = %s"
        if exec_commit(sql, (args['BookID'], args['ContributorID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('ContributorID', type=int, required=True)
        args = parser.parse_args()

        sql = "INSERT INTO Contribute (BookID, ContributorID) VALUES (%s, %s)"
        if exec_commit(sql, (args['BookID'], args['ContributorID'])):
            return 201,
        return 404

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('ContributorID', type=int, required=True)
        args = parser.parse_args()

        sql = "DELETE FROM Contribute WHERE BookID = %s AND ContributorID = %s"
        if exec_commit(sql, (args['BookID'], args['ContributorID'])):
            return 200
        return 404


