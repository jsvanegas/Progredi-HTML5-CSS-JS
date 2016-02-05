//importa el paquete mongodb
var mongodb = require('mongodb');

//configuración del servidor
var servidor = mongodb.Server('127.0.0.1', 27017);
var mongos = mongodb.Mongos([servidor]);
var db = mongodb.Db('blog', mongos);


db.open();


function insertarAutor(_autor){
	//
	var autores = db.collection('autor');
	//insert(obj para insertar, callback);
	autores.insert(_autor, onInsertarAutorCompleto);
}


function onInsertarAutorCompleto(err, resultado){
	if (err) {
		console.error(err);
		return;
	}

	console.log('Autor agregado ', resultado);
}


function consultarAutores(){
	var autores = db.collection('autor');
	autores.find({}, function(err, resultado){
		if (err) {
			console.error(err);
			return;
		}

		resultado.toArray(function(err, listaAutores){
			if (err) {
				console.error(err);
				return;
			}
			console.log('Autores: ', listaAutores);
		});
	});
}


//insertarAutor({nombre:'jsvanegas', empresa:'Progredi'});
consultarAutores();

