var express = require('express');
var app = express();
var userRoutes = express.Router();

userRoutes.get('/:id', function(request, response) {
  response.send('User ' + request.params.id);
});

userRoutes.get('/list', function(request, response) {
  response.send('User list');
})

var productRoutes = express.Router();
productRoutes.get('/:id', function(request, response) {
  response.send('Product ' + request.params.id);
});
productRoutes.get('/list', function(request, response) {
  response.send('Produce list');
});

app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
