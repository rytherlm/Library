from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Author(Resource):
    def get(self):
        value = request.args.get("bookid")
        sql = "SELECT contributorid FROM contribute WHERE bookid = %s"
        contributors = exec_get_all(sql, (value,))
        for contributor in contributors:
            check = exec_get_one("SELECT contributorid FROM author WHERE contributorid = %s", (contributor[0],))
            if check is None:
                continue
            sql = "SELECT firstname, lastname FROM contributor WHERE contributorid = %s"
            result = exec_get_one(sql, (check[0],))
            return {"bookid": value, "authorname": result[0]+result[1]}


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
            sql_insert_author = "INSERT INTO Author (ContributorID) VALUES (%s)"
            if exec_commit(sql_insert_author, (contributor_id,)):
                return 201
        return 404

    def delete(self):
        contributor_id = request.args.get('ContributorID', type=int)
        if contributor_id:
            sql_delete_author = "DELETE FROM Author WHERE ContributorID = %s"
            exec_commit(sql_delete_author, (contributor_id,))
            
            sql_delete_contributor = "DELETE FROM Contributor WHERE ContributorID = %s"
            if exec_commit(sql_delete_contributor, (contributor_id,)):
                return 200
            return 404
        return 400
