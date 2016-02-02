
$('#btnAceptarEliminar').on('click', confirmarEliminarCategoria);
$('#btnNuevaCategoria').on('click', mostrarNuevaCategoria);
$('#btnGuardarCategoria').on('click', guardarCategoria);


function consultarCategorias(){
	$.ajax({
		url : 'http://middlebrain.net:80/Noticias/categoria',
		data : {opcion:1}, //los parámetros que se envían al servidor
		type : 'GET', //verbo HTTP (GET, POST, PUT, DELETE)
		dataType : 'json', //Cómo se espera la información del servidor 
		error: onErrorAJAX,
		success: onConsultarCategoriasCompleto
	});
}

function onConsultarCategoriasCompleto(resultado){
	if (resultado.length>0) {
		cargarTablaCategorias(resultado);
	}else{
		var tbl = $('#tblCategorias');
		var tbody = tbl.find('tbody').empty();  //se limpia el tbody
		var tr = $('<tr>').append(  
				$('<td class="text-center" colspan="5">').text('No hay categorías')  
			);
		tbody.append(tr);
	}
}


function cargarTablaCategorias(categorias){
	var tbody = $('#tblCategorias tbody').html('');  //se limpia el tbody

	var template = $('#tplFilaCategoria').html();
	var rendered = Mustache.render(template, {categorias: categorias});
	tbody.html(rendered);

	tbody.find('tr td[headers="thEliminar"] button').on('click', eliminarCategoria);


	/*
	for (var i = 0; i < categorias.length; i++) {
		var categoria = categorias[i];

		var tr = $('<tr>');
		var tdNombre = $('<td headers="thNombre">').text(categoria.nombreCategoria);
		var tdColorFondo = $('<td headers="thColorFondo">').text(categoria.colorFondo);
		var tdColorFuente = $('<td headers="thColorFuente">').text(categoria.colorFuente);
		var tdIcono = $('<td headers="thIcono">').html('<i class="'+categoria.icono+'" style="font-size:24px;"></i>');
		var tdBoton = $('<td headers="thEliminar">');

		var btnEliminar = $('<button>').addClass('btn btn-danger').html('<i class="glyphicon glyphicon-remove"></i>');
		tdBoton.append(btnEliminar);

		tr.append(tdNombre, tdColorFondo, tdColorFuente, tdIcono, tdBoton);
		tbody.append(tr);
	}*/
}


function eliminarCategoria(){
	var id = $(this).data('id');  // $(this).attr('data-id');
	$('#btnAceptarEliminar').attr('data-id', id);
	$('#dialogoConfirmarEliminar').modal('show');
}

function confirmarEliminarCategoria(){
	$.ajax({
		url : 'http://middlebrain.net:80/Noticias/categoria',
		data : {opcion:4, id: $(this).data('id') }, //los parámetros que se envían al servidor
		type : 'GET', //verbo HTTP (GET, POST, PUT, DELETE)
		dataType : 'json', //Cómo se espera la información del servidor 
		error: onErrorAJAX,
		success: onEliminarCategoriaCompleto
	});
}


function onEliminarCategoriaCompleto(){
	$('#btnAceptarEliminar').removeAttr('data-id');
	$('#dialogoConfirmarEliminar').modal('hide');
	consultarCategorias();
}

function mostrarNuevaCategoria(){
	$('#contenedorNuevaCategoria').slideDown('fast');
}

function guardarCategoria(){

	var nombre = $('#txtNombre').val().trim();
	var colorFondo = $('#txtColorFondo').val().trim();
	var colorFuente = $('#txtColorFuente').val().trim();
	var icono = $('#txtIcono').val().trim();
	var alerta = $('#alertaFormulario');

	if (nombre==='' || colorFondo==='' || colorFuente === '' || icono === '') {
		alerta.slideDown('fast');
		alerta.find('.mensaje').text('Todos los campos son obligatorios');


		$('#contenedorNuevaCategoria div.form-group input:text:contains("")').parent().addClass('has-error').removeClass('has-success');


		return;
	}

	$('#contenedorNuevaCategoria div.form-group input:text:contains("")').parent().removeClass('has-error').addClass('has-success');

	alerta.slideUp('fast');
	alerta.find('.mensaje').text('');

	var data = {
		nombrecategoria:nombre,
		colorfondo:colorFondo,
		colorfuente:colorFuente,
		icono:icono,
		opcion:3
	};

	$.ajax({
		url : 'http://middlebrain.net:80/Noticias/categoria',
		data : data,
		type : 'POST',
		dataType : 'json',
		error: onErrorAJAX,
		success: onGuardarCompleto
	});
	

}

function onGuardarCompleto(resultado){
	if (resultado==1) {
		$('#contenedorNuevaCategoria').slideUp('fast').find('input:text').val('');
		consultarCategorias();
	}else{
		alert('error');
	}
}


function onErrorAJAX(err){
	console.error(err);
}


consultarCategorias();