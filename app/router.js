module.exports = function(app) {
  app.get('/', function(req, res) {
    return res.status(200).send("Hello world")
  })
}
