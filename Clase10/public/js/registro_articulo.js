$('#btnGuardar').on('click', guardarArticulo);

function guardarArticulo(){
	var post = {
		titulo:$('#txtTitulo').val(),
		autor:$('#txtAutor').val(),
		categorias:$('#txtCategorias').val(),
		publicacion:$('#txtPublicacion').val()
	};
	$.ajax({
		url:'/articulos/registrar',
		type:'post',
		dataType:'json',
		data:post,
		success:onGuardarCompleto,
		timeout:1000,
		error:onError
	});
}

function onGuardarCompleto(resultado){
	if (resultado.codigo===200) {
		alert(resultado.mensaje);
	}
}

function onError(err){
	console.error(err);
}