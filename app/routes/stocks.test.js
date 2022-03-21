import router from './stocks'; 
import request from 'supertest';
import app from '../app';

test("routes stockRecieve", (done) => {
    
    request(app).post('/stocks/stockRecieve').send({ value: "text" }).then(() => {
        done();
    });
});


