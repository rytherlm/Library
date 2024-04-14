from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class TopBooks(Resource):
    def get(self):
        sql = """SELECT b.Title, COUNT(s.SectionID) AS SectionCount
                FROM Book b
                JOIN Section s ON b.BookID = s.BookID
                WHERE s.StartTime >= CURRENT_DATE - INTERVAL '3 months'
                GROUP BY b.Title
                ORDER BY SectionCount DESC
                LIMIT 20;
                """
        result = exec_get_all(sql)
        return result, 200