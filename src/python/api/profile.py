from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *



class Profile(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', type=str, location='args', required=True)
        args = parser.parse_args()

        username = args['Username']
        user_query = "SELECT UserID FROM BookUser WHERE username = %s"
        user_id = exec_get_one(user_query, (username,))[0]

        if user_id is None:
            return {}, 404 

        collections_query = "SELECT COUNT(*) FROM Collection WHERE username = %s"
        collections = exec_get_one(collections_query, (username,))[0]

        following_query = "SELECT COUNT(*) FROM Friends WHERE userID = %s"
        following = exec_get_one(following_query, (user_id,))[0]

        followers_query = "SELECT COUNT(*) FROM Friends WHERE friendID = %s"
        followers = exec_get_one(followers_query, (user_id,))[0]

        top_books_query = "SELECT b.Title, AVG(r.Rating) AS AvgRating FROM Book b JOIN Rating r ON b.BookID = r.BookID WHERE r.UserID = %s GROUP BY b.Title ORDER BY AvgRating DESC LIMIT 10"
        top_books = exec_get_all(top_books_query, (user_id,))
        top_books_formatted = [
            {"title": book[0], "average_rating": float(book[1])}
            for book in top_books
        ]

        return {
            "collections": collections,
            "following": following,
            "followers": followers,
            "top_books": top_books_formatted
        }, 200
