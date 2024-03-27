from flask_restful import Resource
from flask_restful import request
from flask_restful import reqparse
from .utils import *

class Section(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('SectionID', location='args')
        args = parser.parse_args()

        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})
        section_id = args.get('SectionID')
        if username and bookname:
            sql = """SELECT CAST(starttime as text), CAST(endtime as text), startpage, endpage FROM Section
            where userID = %(userID)s and bookid = %(bookID)s """
            result= (exec_get_all(sql, {'userID': user_id, 'bookID': book_id}))
            print(result)
            if result:
                return result, 200
            return [], 200
        if section_id: 
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
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('StartTime')
        parser.add_argument('EndTime')
        parser.add_argument('StartPage')
        parser.add_argument('EndPage')
        args = parser.parse_args()
        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})

        sql = """
        UPDATE Section
        SET BookID = %s, UserID = %s, StartTime = %s, EndTime = %s, StartPage = %s, EndPage = %s
        WHERE SectionID = %s
        """
        if exec_commit(sql, (book_id, user_id, args['StartTime'], args['EndTime'], args['StartPage'], args['EndPage'], args['SectionID'])):
            return 200
        return 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Username', location='args')
        parser.add_argument('Bookname', location='args')
        parser.add_argument('StartTime', location='args')
        parser.add_argument('EndTime', location='args')
        parser.add_argument('StartPage', location='args')
        parser.add_argument('EndPage', location='args')
        args = parser.parse_args()
        username = args.get('Username')
        bookname = args.get('Bookname')
        sql = "SELECT userid FROM BookUser WHERE Username LIKE %(username)s"
        user_id = exec_get_one(sql,{"username": username})
        sql = "SELECT bookid FROM Book WHERE title LIKE %(bookname)s"
        book_id = exec_get_one(sql,{"bookname": bookname})
        sql = """
        INSERT INTO Section (BookID, UserID, StartTime, EndTime, StartPage, EndPage)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        print(book_id, user_id, args['StartTime'], args['EndTime'], args['StartPage'], args['EndPage'])
        if exec_commit(sql, (book_id, user_id, args['StartTime'], args['EndTime'], args['StartPage'], args['EndPage'])):
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

