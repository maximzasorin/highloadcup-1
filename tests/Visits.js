let mongoose = require('mongoose');
let Visit = require('../app/models/VisitsModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server');

chai.use(chaiHttp);

describe('Visits', () => {
    beforeEach((done) => {
        Visit.remove({}, (err) => { 
           done();         
        });     
    });

    // TODO: remove for prod
    // describe('GET /visits', () => {
    //     it('it should get all the visits', (done) => {
    //         chai.request(server)
    //             .get('/visits')
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('array');
    //             res.body.length.should.be.eql(0);
    //             done();
    //         });
    //     });
    // });

    describe('POST /visits/new', () => {
        it('it should create a new visit', (done) => {
            let visit = {
                user: 44,
                location: 32,
                visited_at: 1103485742,
                mark: 4,
                id: 1
            };

            chai.request(server)
                .post('/visits/new')
                .send(visit)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('GET /visits/:id', () => {
        it('it should get a visit by the given id', (done) => {
            let visit = new Visit({
                user: 90,
                location: 26,
                visited_at: 1092569596,
                mark: 2,
                id: 2
            });

            visit.save((err, visit) => {
                chai.request(server)
                .get('/visits/' + visit.id)
                .send(visit)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.should.have.property('location');
                    res.body.should.have.property('visited_at');
                    res.body.should.have.property('mark');
                    res.body.should.have.property('id').eql(visit.id);
                  done();
                });
            });
        });
    });

    describe('POST /visits/:id', () => {
        it('it should update a visit given the id', (done) => {
            let visit = new Visit({
                user: 56,
                location: 66,
                visited_at: 1032327682,
                mark: 2,
                id: 3
            });

            visit.save((err, visit) => {
                chai.request(server)
                .post('/visits/' + visit.id)
                .send({
                    user: 49,
                    location: 41
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