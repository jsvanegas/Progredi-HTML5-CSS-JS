var mongodb = require('mongodb');
var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');


var servidor = mongodb.Server('127.0.0.1', 27017);
var mongos = mongodb.Mongos([servidor]);
var db = mongodb.Db('blog', mongos);
var ObjectId = mongodb.ObjectId;

db.open();
var app = express();

//configuración del bodyparser para parámetros por POST
app.use(bodyParser.urlencoded({encoded:true}));
app.use(bodyParser.json());

//configuración del motor de render de vistas
app.engine('hbs', hbs({extname:'hbs', defaultLayout:'main'}));
app.set('view engine', 'hbs');

//configura una carpeta de acceso público para poner los recursos de front-end
app.use('/public', express.static('public'));

//////////Rutas

app.get('/', consultarIndex);
app.get('/articulo/:id', consultarArticulo);
app.get('/autores/listar', consultarArticulosPorAutor);
app.get('/autores/registrar', registrarAutor);
app.get('/articulos/registrar', registrarArticulo);

app.post('/autores/registrar', registrarAutorPost);
app.post('/articulos/registrar', registrarArticuloPost);


function consultarIndex(req, res){
	var post = db.collection('post');
	var opciones = {
		limit:10,
		sort:[['_id','desc']]
	};
	post.find({}, opciones, function(err, data){
		if (err) { console.error(err); return; }

		data.toArray(function(err, listaPost){
			res.render('index', {post:listaPost, titulo:'Últimos 10 post'});
		});
	});
}

function consultarArticulo(req, res){
	var id = req.param('id');
	var post = db.collection('post');
	post.findOne({_id:new ObjectId(id)}, function(err, data){
		if (err) { console.error(err); return; }		
		res.render('articulo', {titulo:data.titulo, articulo:data, layout:'main2'});
	});
}

function consultarArticulosPorAutor(req, res){
	var autores = db.collection('autor');
	autores.find({}, function(err, data){
		if (err) { console.error(err); return; }
		data.toArray(function(err, listaAutores){
			if (err) { console.error(err); return; }
			res.render('lista_autores', {autores:listaAutores})
		});
	});
}

function registrarAutor(req, res){
	res.render('registrar_autor');
}

function registrarArticulo(req, res){
	res.render('registrar_articulo');	
}


function registrarAutorPost(req, res){
	var autores = db.collection('autor');
	var nuevoAutor = {
		nombre: req.body.nombre,
		empresa:req.body.empresa
	};

	autores.insert(nuevoAutor, function(err, resultado){
		if (err) { console.error(err); return };
		res.render('registrar_autor', {mensaje:'Autor registrado'});
	});
}

function registrarArticuloPost(req, res){
	var articulo = {
		titulo:req.body.titulo,
		autor:req.body.autor,
		publicacion:req.body.publicacion,
		categorias:req.body.categorias.split(',')
	};

	var post = db.collection('post');
	post.insert(articulo, function(err, data){
		res.send({mensaje:'Post agregado', codigo:200});
	});
}


app.listen(9095);
console.log('La aplicación está corriendo en el puerto 9095');