const express = require('express');
const router = express.Router();

module.exports = (passport) => {

    const auth = require('./auth')(passport);

    const authRouter = require('./auth.routes')(auth);

    // frontend
    const indexRouter = require('./index.routes')(auth);
    const readingsRouter = require('./frontend/readings.routes')(auth);
    const kitsRouter = require('./frontend/kits.routes')(auth);

    //admin
    const usersAdminRouter = require('./admin/users.routes')(auth);
    const kitsAdminRouter = require('./admin/kits.routes')(auth);

    router.use('/', authRouter);
    router.use('/', indexRouter);
    router.use('/readings', readingsRouter);
    router.use('/kits', kitsRouter);

    router.use('/admin/users', usersAdminRouter);
    router.use('/admin/kits', kitsAdminRouter);

    return router;
}
