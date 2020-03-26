const approot = require('app-root-path');
const express = require('express');

const router = express.Router();
const userController = require('./user.controller');


router.get('/', userController.main); 
router.get('/joinPage', userController.joinPage);
router.get('/home', userController.home);
router.get('/logout', userController.logout);
router.get('/idPwFind', userController.idPwFind);


router.post('/login', userController.login); 
router.post('/join', userController.join);
router.post('/idCheck', userController.idCheck);
router.post('/reJoin', userController.reJoin);
router.post('/findId', userController.findId);
router.post('/findPw', userController.findPw);
router.post('/rePassword', userController.rePassword);

module.exports = router;

