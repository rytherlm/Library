from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class ForYou(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', type=str, location='args', required=True)
        args = parser.parse_args()
        username = args['Username']
        user_query = "SELECT Userid FROM BookUser WHERE username = %s"
        user_id = exec_get_one(user_query, (username,))[0]
        sql = """WITH readGenres AS (
                SELECT DISTINCT g.genreid
                FROM Track t
                INNER JOIN BookGenre bg ON t.bookid = bg.bookid
                INNER JOIN Genres g ON bg.genreid = g.Genreid
                WHERE t.Userid = %s
            ),
            unreadBooks AS (
                SELECT b.bookid, b.title, COUNT(*) AS genreCounts
                FROM BookGenre bg
                INNER JOIN readGenres ug ON bg.genreid = ug.genreid
                INNER JOIN Book b ON bg.bookid = b.bookid
                WHERE b.bookid NOT IN (
                    SELECT bookid FROM Track WHERE Userid = %s
                )
                GROUP BY b.bookid, b.Title
            )
            SELECT rb.bookid, rb.title, rb.genreCounts
            FROM unreadBooks rb
            INNER JOIN (
                SELECT bookid, AVG(rating) AS avgRating
                FROM Rating
                GROUP BY bookid
            ) r ON rb.bookid = r.bookid
            ORDER BY rb.genreCounts DESC, r.avgRating DESC
            LIMIT 20"""
        result = exec_get_all(sql, (user_id, user_id,))
        return result, 200