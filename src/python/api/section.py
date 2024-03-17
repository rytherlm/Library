from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Section(Resource):
    def get(self, section_id=None):
        if section_id is not None:
            sql = "SELECT * FROM Section WHERE SectionID = %s"
            result = exec_get_one(sql, (section_id,))
            if result:
                return result, 200
            else:
                return 404
        else:
            sql = "SELECT * FROM Section"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('SectionID', type=int, required=True)
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('StartTime', required=True)
        parser.add_argument('EndTime', required=True)
        parser.add_argument('StartPage', type=int, required=True)
        parser.add_argument('EndPage', type=int, required=True)
        args = parser.parse_args()

        sql = """
        UPDATE Section
        SET BookID = %s, UserID = %s, StartTime = %s, EndTime = %s, StartPage = %s, EndPage = %s
        WHERE SectionID = %s
        """
        if exec_commit(sql, (args['BookID'], args['UserID'], args['StartTime'], args['EndTime'], args['StartPage'], args['EndPage'], args['SectionID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('BookID', type=int, required=True)
        parser.add_argument('UserID', type=int, required=True)
        parser.add_argument('StartTime', required=True)
        parser.add_argument('EndTime', required=True)
        parser.add_argument('StartPage', type=int, required=True)
        parser.add_argument('EndPage', type=int, required=True)
        args = parser.parse_args()

        sql = """
        INSERT INTO Section (BookID, UserID, StartTime, EndTime, StartPage, EndPage)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        if exec_commit(sql, (args['BookID'], args['UserID'], args['StartTime'], args['EndTime'], args['StartPage'], args['EndPage'])):
            return 201,
        return 404

    def delete(self):
        section_id = request.args.get('SectionID', type=int)
        if section_id:
            sql = "DELETE FROM Section WHERE SectionID = %s"
            if exec_commit(sql, (section_id,)):
                return 200
            return 404
        return 400

