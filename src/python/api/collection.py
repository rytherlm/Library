from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Collection(Resource):
    def get(self, collection_id=None):
        if collection_id is not None:
            sql = "SELECT * FROM Collection WHERE CollectionID = %s"
            result = exec_get_one(sql, (collection_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Collection"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('CollectionID', type=int, required=True)
        parser.add_argument('Username', required=True)
        parser.add_argument('CollectionName', required=True)
        args = parser.parse_args()

        sql = "UPDATE Collection SET Username = %s, CollectionName = %s WHERE CollectionID = %s"
        if exec_commit(sql, (args['Username'], args['CollectionName'], args['CollectionID'],)):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', required=True)
        parser.add_argument('CollectionName', required=True)
        args = parser.parse_args()

        sql = "INSERT INTO Collection (Username, CollectionName) VALUES (%s, %s)"
        if exec_commit(sql, (args['Username'], args['CollectionName'],)):
            return 201,
        return 404

    def delete(self):
        collection_id = request.args.get('CollectionID', type=int)
        if collection_id:
            sql = "DELETE FROM Collection WHERE CollectionID = %s"
            if exec_commit(sql, (collection_id,)):
                return 200
            return 404
        return 400

