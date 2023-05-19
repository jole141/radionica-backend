const request = require('supertest');

const { app } = require('../index');

describe('Unit tests for your Express routes', () => {
  it('should return dijelovi from the datasource', async () => {
    request(app)
      .get('/dijelovi')
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it('should add a new dio to the datasource', (done) => {
    const dio = {
      nazivDio : "Testni naziv",
      kolicinaNaLageru : 13
    };


    request(app)
      .post('/dijelovi')
      .send(dio)
      .expect(201)
      .end((err, res) => {
        expect(res.body).toEqual({ message: 'dio added' });
        done();
      });
  });


  it('should delete a dio from the datasource', (done) => {
    const id = 10;

    request(app)
      .delete(`/dijelovi/${id}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual({ message: 'dio deleted' });
        done();
      });
  });


  it('should update a dio in the datasource', (done) => {
    const id = 1;
    const dio = {
      sifra_dijela: '1',
      naziv_dijela: "Motorić",
      kolicina_na_lageru: 22
    };

    request(app)
      .put(`/dijelovi/${id}`)
      .send(dio)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual({ message: 'dio updated' });
        done();
      });
  });


  it('should return a specific dio from the datasource', (done) => {
    const id = 1;

    request(app)
      .get(`/dijelovi/${id}`)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});