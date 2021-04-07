/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require("../models/book")

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.aggregate(
          [
            {
              $project: {
                commentcount: {
                  $cond: {
                    if: { $isArray: "$comments" },
                    then: { $size: "$comments" },
                    else: 0
                  }
                },
                title: 1,
                _id: 1
              }
            }
          ]
        ).exec();
        res.json(books);
      } catch (error) {
        console.error("[GET error]: ", error)
      }
    })

    .post(async function (req, res) {
      //response will contain new book object including atleast _id and title
      try {
        let title = req.body.title;
        if (!title) {
          return res.json("missing required field title");
        }
        const book = await Book.create({ title });
        res.json({ _id: book._id, title });
      } catch (error) {
        console.error("[POST error]: ", error)
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany();
        res.json("complete delete successful");
      } catch (error) {
        console.error("[DELETE error]: ", error)
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let bookid = req.params.id;
        const book = await Book.findById(bookid).lean();
        if (!book) {
          return res.json("no book exists")
        }
        res.json(book);
      } catch (error) {
        console.error("[GET error]: ", error)
        return res.json("no book exists")
      }
    })

    .post(async function (req, res) {
      //json res format same as .get
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        if (!comment) {
          return res.json("missing required field comment");
        }
        const book = await Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true }).lean();
        if (!book) {
          return res.json("no book exists");
        }
        res.json(book);

      } catch (error) {
        console.error("[POST error]: ", error)
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'delete successful'
      try {
        let _id = req.params.id;
        const book = await Book.deleteOne({ _id });
        if (book.deletedCount !== 1) {
          return res.json("no book exists")
        }
        res.json("delete successful")
      } catch (error) {
        console.error("[DELETE error]: ", error)
      }
    });

};
