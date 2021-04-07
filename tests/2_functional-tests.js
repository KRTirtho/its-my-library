/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  // /*
  // * ----[EXAMPLE TEST]----
  // * Each test should completely test the response of the API end-point including response status code!
  // */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  // /*
  // * ----[END of EXAMPLE TEST]----
  // */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        const title = "Dum Book"
        chai.request(server)
          .post("/api/books")
          .send({ title })
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, title);
            assert.property(res.body, '_id',);
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post("/api/books")
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get("/api/books")
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get("/api/books/606d506b915a872dcd50a995")
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists")
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get("/api/books")
          .end((_, res) => {
            chai.request(server)
              .get(`/api/books/${res.body[0]._id}`)
              .end((_, res_1) => {
                assert.equal(res_1.status, 200);
                assert.property(res_1.body, 'comments');
                assert.isArray(res_1.body.comments);
                assert.property(res_1.body, "title");
                assert.property(res_1.body, '_id');
                done();
              })
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        const comment = "Dum Comment"
        chai.request(server)
          .get("/api/books")
          .end((_, res) => {
            chai.request(server)
              .post(`/api/books/${res.body[0]._id}`)
              .send({ comment })
              .end((_, res_1) => {
                assert.equal(res_1.status, 200);
                assert.property(res_1.body, 'comments');
                assert.isArray(res_1.body.comments);
                expect(res_1.body.comments).includes(comment);
                assert.property(res_1.body, "title");
                assert.property(res_1.body, '_id');
                done();
              })
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .get("/api/books")
          .end((_, res) => {
            chai.request(server)
              .post(`/api/books/${res.body[0]._id}`)
              .end((_, res_1) => {
                assert.equal(res_1.status, 200);
                assert.equal(res_1.body, "missing required field comment")
                done();
              })
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        const comment = "Dum Comment"
        chai.request(server)
          .post(`/api/books/606d506b915a872dcd50a995`)
          .send({ comment })
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists")
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get("/api/books")
          .end((_, res) => {
            chai.request(server)
              .delete(`/api/books/${res.body[0]._id}`)
              .end((_, res_1) => {
                assert.equal(res_1.status, 200);
                assert.equal(res_1.body, "delete successful")
                done();
              })
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete(`/api/books/606d506b915a872dcd50a995`)
          .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists")
            done();
          })
      });
    });

  });

});