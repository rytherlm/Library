from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class FollowerBooks(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', type=str, location='args', required=True)
        args = parser.parse_args()
        username = args['Username']
        user_query = "SELECT UserID FROM BookUser WHERE username = %s"
        user_id = exec_get_one(user_query, (username,))[0]
        friendIDs = exec_get_all("SELECT friendid FROM friends WHERE userid = %s", (user_id,))
        combined_top_books = {}
        for id in friendIDs:
            top_books_query = "SELECT b.Title, AVG(r.Rating) AS AvgRating FROM Book b JOIN Rating r ON b.BookID = r.BookID WHERE r.UserID = %s GROUP BY b.Title ORDER BY AvgRating DESC LIMIT 10"
            top_books = exec_get_all(top_books_query, (id,))
            for book in top_books:
                title = book[0]
                avg_rating = float(book[1])
                if title in combined_top_books:
                    combined_top_books[title].append(avg_rating)
                else:
                    combined_top_books[title] = [avg_rating]
        for title, ratings in combined_top_books.items():
            combined_top_books[title] = sum(ratings) / len(ratings)

        combined_top_books = dict(sorted(combined_top_books.items(), key=lambda item: item[1], reverse=True))
        overall_top_books = list(combined_top_books.items())[:20]
        return overall_top_books, 200