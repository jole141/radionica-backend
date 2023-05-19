const request = require('supertest');

const { app } = require('../index');

describe('Unit tests for your Express routes', () => {
  it('should return dijelovi from the datasource', async () => {
    request(app)
      .get('/dijelovi')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }


        done();
      });
  });

  it('should add a new dio to the datasource', (done) => {
    const dio = {
      nazivDio : "Testni naziv",
      kolicinaNaLageru : 13
    };

    const postDioMock = jasmine.createSpy();
    spyOn(require('../datasource'), 'postDio').and.callFake(postDioMock);

    request(app)
      .post('/dijelovi')
      .send(dio)
      .expect(201)
      .end((err, res) => {
        expect(postDioMock).toHaveBeenCalledTimes(1);
        expect(postDioMock).toHaveBeenCalledWith(dio);
        expect(res.body).toEqual({ message: 'dio added' });
        done();
      });
  });


  it('should delete a dio from the datasource', (done) => {
    const id = 10;

    const deleteDioMock = jasmine.createSpy();
    spyOn(require('../datasource'), 'deleteDio').and.callFake(deleteDioMock);

    request(app)
      .delete(`/dijelovi/${id}`)
      .expect(200)
      .end((err, res) => {
        expect(deleteDioMock).toHaveBeenCalledTimes(1);
        expect(deleteDioMock).toHaveBeenCalledWith(id);
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

    const putDioMock = jasmine.createSpy();
    spyOn(require('../datasource'), 'putDio').and.callFake(putDioMock);

    request(app)
      .put(`/dijelovi/${id}`)
      .send(dio)
      .expect(200)
      .end((err, res) => {
        expect(putDioMock).toHaveBeenCalledTimes(1);
        expect(putDioMock).toHaveBeenCalledWith(dio, id);
        expect(res.body).toEqual({ message: 'dio updated' });
        done();
      });
  });


  it('should return a specific dio from the datasource', (done) => {
    const id = 1;
    const expectedDio = {
      sifra_dijela: '1',
      naziv_dijela: "Motor",
      kolicina_na_lageru: 20
    };

    const getDioMock = jasmine.createSpy().and.returnValue(Promise.resolve(expectedDio));
    spyOn(require('../datasource'), 'getDio').and.callFake(getDioMock);

    request(app)
      .get(`/dijelovi/${id}`)
      .expect(200)
      .end((err, res) => {
        expect(getDioMock).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual(expectedDio);
        done();
      });
  });
});