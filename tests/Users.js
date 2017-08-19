let mongoose = require('mongoose');
let User = require('../app/models/UsersModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server');

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { 
           done();         
        });     
    });

    // TODO: remove for prod
    // describe('GET /users', () => {
    //     it('it should get all the users', (done) => {
    //         chai.request(server)
    //             .get('/users')
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('array');
    //             res.body.length.should.be.eql(0);
    //             done();
    //         });
    //     });
    // });

    describe('POST /users/new', () => {
        it('it should create a new user', (done) => {
            let user = {
                first_name: 'Пётр',
                last_name: 'Фетатосян',
                birth_date: -1720915200,
                gender: 'm',
                email: 'wibylcudestiwuk@icloud.com',
                id: 1
            };

            chai.request(server)
                .post('/users/new')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('GET /users/:id', () => {
        it('it should get a user by the given id', (done) => {
            let user = new User({
                first_name: 'Маргарита',
                last_name: 'Даныкачан',
                birth_date: -1026691200,
                gender: 'f',
                email: 'itteoldanedtenenor@yahoo.com',
                id: 2
            });

            user.save((err, user) => {
                chai.request(server)
                .get('/users/' + user.id)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('first_name');
                    res.body.should.have.property('last_name');
                    res.body.should.have.property('birth_date');
                    res.body.should.have.property('gender');
                    res.body.should.have.property('email');
                    res.body.should.have.property('id').eql(user.id);
                  done();
                });
            });
        });
    });

    describe('POST /users/:id', () => {
        it('it should update a user given the id', (done) => {
            let user = new User({
                first_name: 'Алла',
                last_name: 'Хопашетева',
                birth_date: -371692800,
                gender: 'f',
                email: 'nedeleclaw@mail.ru',
                id: 3
            });

            user.save((err, user) => {
                chai.request(server)
                .post('/users/' + user.id)
                .send({
                    first_name: 'Надежда',
                    last_name: 'Лукыкатина'
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