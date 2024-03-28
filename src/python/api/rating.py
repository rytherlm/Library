from flask_restful import Resource
from flask_restful import reqparse
from .utils import *

class BookRatings(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})


        if not book_id:
            return {"error": "Book ID is required"}, 400
        if not username:
            sql = """
            SELECT AVG(Rating) as average_rating
            FROM Rating
            WHERE BookID = %s
            """
            average_rating = exec_get_one(sql, (book_id,))
            if average_rating is not None and average_rating[0] is not None:
                return {"average_rating": float(average_rating[0])}
            else:
                return {"average_rating": -1}
        
        if username and book_id:
            sql = """select rating from Rating
            where userid =%(userid)s and  BookID = %(bookid)s"""
            result = exec_get_one(sql, {"userid": user_id, "bookid": book_id})
            if result:
                return {"rating": result[0]}
            else :
                return {"rating": 0}    

    
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('rating',  location='args' )
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        rating = args.get('rating')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})

        sql = """
        UPDATE rating SET rating = %(rating)s
        where userid =%(userid)s and  BookID = %(bookid)s RETURNING UserID
        """
        if exec_commit(sql, {"rating": rating ,"userid": user_id, "bookid": book_id}):
            return 200
        return 404
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('rating',  location='args' )
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        rating = args.get('rating')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})


        sql = """
        INSERT INTO rating (UserID, BookID, rating)
        VALUES ( %(userid)s, %(bookid)s,%(rating)s) RETURNING UserID
        """
        if exec_commit(sql, {"rating": rating ,"userid": user_id, "bookid": book_id}):
            return 200
        return 404
    
    
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})


        sql = """Delete from rating where UserId = %(userid)s and BookID = %(bookid)s
        """
        if exec_commit(sql, {"userid": user_id, "bookid": book_id}):
            return 200
        return 404