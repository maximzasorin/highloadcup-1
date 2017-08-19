let mongoose = require('mongoose');
let Location = require('../app/models/LocationsModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server');

chai.use(chaiHttp);

describe('Locations', () => {
    beforeEach((done) => {
        Location.remove({}, (err) => { 
           done();         
        });     
    });

    // TODO: remove for prod
    // describe('GET /locations', () => {
    //     it('it should get all the locations', (done) => {
    //         chai.request(server)
    //             .get('/locations')
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('array');
    //             res.body.length.should.be.eql(0);
    //             done();
    //         });
    //     });
    // });

    describe('POST /locations/new', () => {
        it('it should create a new location', (done) => {
            let location = {
                distance: 6,
                city: 'Москва',
                place: 'Набережная',
                country: 'Аргентина',
                id: 1
            };

            chai.request(server)
                .post('/locations/new')
                .send(location)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('GET /locations/:id', () => {
        it('it should get a location by the given id', (done) => {
            let location = new Location({
                distance: 80,
                city: 'Новоламск',
                place: 'Переулок',
                country: 'Лаос',
                id: 2
            });

            location.save((err, location) => {
                chai.request(server)
                    .get('/locations/' + location.id)
                    .send(location)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('distance');
                        res.body.should.have.property('city');
                        res.body.should.have.property('place');
                        res.body.should.have.property('country');
                        res.body.should.have.property('id').eql(location.id);

                        done();
                    });
            });
        });
    });

    describe('POST /locations/:id', () => {
        it('it should update a location given the id', (done) => {
            let location = new Location({
                distance: 98,
                city: 'Амстерлёв',
                place: 'Дерево',
                country: 'ЮАР',
                id: 3
            });

            location.save((err, location) => {
                chai.request(server)
                .post('/locations/' + location.id)
                .send({
                    distance: 63,
                    city: 'Санктелона'
                })
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                    done();
                });
            });
        });
    });
});