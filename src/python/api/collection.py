from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Collection(Resource):
    def get(self):
        for i, key in enumerate(request.args.keys()):
            collection_id = request.args[key]
            sql = "SELECT * FROM Collection WHERE CollectionID = %s"
            result = exec_get_one(sql, (collection_id,))
            if result:
                return result, 200
            else:
                return 404
        

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('CollectionID', required=True)
        parser.add_argument('Username', required=True)
        parser.add_argument('CollectionName', required=True)
        args = parser.parse_args()
        sql = "UPDATE Collection SET Username = %s, CollectionName = %s WHERE CollectionID = %s"
        exec_commit(sql, (args['Username'], args['CollectionName'], args['CollectionID'],))
        return 200

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
        for i, key in enumerate(request.args.keys()):
            collection_id = request.args[key]
            sql = "DELETE FROM Stores WHERE CollectionID = %s"
            sql2 = "DELETE FROM Collection WHERE CollectionID = %s"
            exec_commit(sql, (collection_id, ))
            exec_commit(sql2, (collection_id, ))
            return 200
        return 400

