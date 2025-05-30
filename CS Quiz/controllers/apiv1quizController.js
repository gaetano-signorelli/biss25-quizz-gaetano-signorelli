const service = require('../services/apiv1quizService.js');

module.exports.getQuiz = function getQuiz(req, res) {
    service.getQuiz(req, res);
}

