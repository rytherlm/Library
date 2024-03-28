from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Stores(Resource):
    def get(self):
        for i, key in enumerate(request.args.keys()):
            collection_id = request.args[key]
            sql = "SELECT b.bookid, title FROM stores as s left join book as b on (s.bookid = b.bookid) WHERE CollectionID = %s"
            result = exec_get_all(sql, (collection_id,))
            if result:
                return result, 200
            else:
                return 404

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('OldCollectionID', type=int, required=True, help="Existing Collection ID is required.")
        parser.add_argument('NewCollectionID', type=int, required=True, help="New Collection ID is required.")
        parser.add_argument('BookID', type=int, required=True, help="Book ID is required.")
        args = parser.parse_args()

        check_sql = "SELECT * FROM Stores WHERE CollectionID = %s AND BookID = %s"
        check_result = exec_get_one(check_sql, (args['OldCollectionID'], args['BookID']))
        if not check_result:
            return 404

        delete_sql = "DELETE FROM Stores WHERE CollectionID = %s AND BookID = %s"
        delete_success = exec_commit(delete_sql, (args['OldCollectionID'], args['BookID']))
        if not delete_success:
            return 404

        insert_sql = "INSERT INTO Stores (CollectionID, BookID) VALUES (%s, %s)"
        insert_success = exec_commit(insert_sql, (args['NewCollectionID'], args['BookID']))
        if insert_success:
            return 200
        else:
            rollback_success = exec_commit(insert_sql, (args['OldCollectionID'], args['BookID']))
            if not rollback_success:
                return 500
            return 404


    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('CollectionID', type=int, required=True)
        parser.add_argument('BookID', type=int, required=True)
        args = parser.parse_args()

        sql = "INSERT INTO Stores (CollectionID, BookID) VALUES (%s, %s)"
        if exec_commit(sql, (args['CollectionID'], args['BookID'])):
            return 201,
        return 404

    def delete(self):
        collection = request.args.get("CollectionID")
        book = request.args.get("BookID")

        sql = "DELETE FROM Stores WHERE CollectionID = %s AND BookID = %s"
        success = exec_commit(sql, (collection, book))
        if success:
            return 200
        return 404
