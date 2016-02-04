var mongodb = require('mongodb');
var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

var servidor = mongodb.Server('127.0.0.1', 27017);
var mongos = mongodb.Mongos([servidor]);
var db = mongodb.Db('blog', mongos);

db.open();
var app = express();

//configuración del bodyparser para parámetros por POST
app.use(bodyParser.urlencoded({encoded:true}));
app.use(bodyParser.json());

//configuración del motor de render de vistas
app.engine('hbs', hbs({extname:'hbs'}));
app.set('view engine', 'hbs');


app.get('/autores/registrar', function(req, res){
	res.render('registrar_autor');
});

app.post('/autores/registrar', function(req, res){
	var autores = db.collection('autor');
	var nuevoAutor = {
		nombre: req.body.nombre,
		empresa:req.body.empresa
	};

	autores.insert(nuevoAutor, function(err, resultado){
		if (err) { console.error(err); return };
		res.redirect('/listar');
	});
});


app.get('/', function(req, res){
	res.send('<h1>Bienvenido al blog de progredi</h1>');
});


app.get('/listar', function(req, res){
	var autores = db.collection('autor');
	autores.find({}, function(err, data){
		if (err) { console.error(err); return; }
		data.toArray(function(err, listaAutores){
			if (err) { console.error(err); return; }
			res.send(listaAutores);
		});
	});
});


app.listen(9095);
console.log('La aplicación está corriendo en el puerto 9095');