from flask_restful import Resource
from flask_restful import request
from .utils import *

class BookRatings(Resource):
    def get(self):
        book_id = request.args.get('bookid')
        if not book_id:
            return {"error": "Book ID is required"}, 400

        sql = """
        SELECT AVG(Rating) as average_rating
        FROM Rating
        WHERE BookID = %s
        """
        average_rating = exec_get_one(sql, (book_id,))
        if average_rating:
            return {"average_rating": average_rating[0] or 0}
        else:
            return {"average_rating": 0}
