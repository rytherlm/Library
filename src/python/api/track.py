from flask_restful import Resource
from flask_restful import reqparse
from .utils import *

class Track(Resource):
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

        if user_id and book_id:
            sql = "SELECT * FROM Track WHERE UserID = %s AND BookID = %s"
            result = exec_get_one(sql, (user_id, book_id))
            if result:
                if result[2] == None :
                    result[2] == 0
                if result [3] == None :
                    result [3] == 'Unread'
                
                return {"progress": [result[2]], "status" : result[3]}, 200
            return 404
        elif user_id:
            sql = "SELECT * FROM Track WHERE UserID = %s"
            result = exec_get_all(sql, (user_id,))
            if result:
                return result, 200
            return 404
        elif book_id:
            sql = "SELECT * FROM Track WHERE BookID = %s"
            result = exec_get_all(sql, (book_id,))
            if result:
                return result, 200
            return 404
        else:
            sql = "SELECT * FROM Track"
            result = exec_get_all(sql)
            if result:
                return result, 200
            return [], 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('Progress', location='args')
        parser.add_argument('Status', choices=('Unread', 'Reading', 'Read'), location='args')
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})
        progress = int(args.get('Progress'))
        status = args.get('Status')
    


        sql = """
        UPDATE Track SET Progress = %s, Status = %s
        WHERE UserID = %s AND BookID = %s
        """
        if exec_commit(sql, ( progress, status, user_id, book_id)):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('Progress', location='args')
        parser.add_argument('Status', choices=('Unread', 'Reading', 'Read'), location='args')
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})
        progress = int(args.get('Progress'))
        status = args.get('Status')

        sql = """
        INSERT INTO Track (UserID, BookID, Progress, Status)
        VALUES (%s, %s, %s, %s)
        """
        if exec_commit(sql, (user_id, book_id, progress, status)):
            return 201,
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


        sql = "DELETE FROM Track WHERE UserID = %s AND BookID = %s"
        if exec_commit(sql, (user_id, book_id)):
            return 200
        return 404

