$(document).ready(function(){

  $('.alert').hide();
  var _product = {_id: 0 ,_new: true};

  $('button[type=reset]').on('click', function(){
    $('#marca').prop('disabled', false);
    $('#modelo').prop('disabled', false);
    $('#serie').prop('disabled', false);
    _product._new = true;
  });

  $('form').on('submit',function(){

    var form_product = {
      marca: $('#marca option:selected').val(),
      modelo: $('#modelo').val(),
      serie: $('#serie').val(),
      tension: $('#tension').val(),
      proveedor: $('#proveedor').val()
    };

    if(_product._new){
      $.ajax({
        type: 'POST',
        url: '/product',
        data: form_product,
        success: function(data){
          if(data.msj){
            $('#alert-text').text(data.msj);
            $('.alert').show();
          }
          else{
            insertProduct(data);//inserta una nueva fila a la tabla
          }
        }
      });
    }else{
      form_product._id = $('#product-id').val();
      $.ajax({
        type: 'PUT',
        url: '/product/'+form_product._id,
        data: form_product,
        success: function(data){
          $('.alert').css('background-color', '#4CAF50');
          $('#alert-text').text(data.msj);
          $('.alert').show(1500).hide(6000);
          updateProduct(data.product);
        }
      });
    }

    return false;
  });//fin de form.submit

//edit a product
 $('#edit-button').on('click', function(){
   var checked = $('[name=product-radio]:checked');
   if(checked.length > 0){
     var product = checked.parent().parent();
     fillInForm(product[0]);
     _product._new = false;
   }
 });
// fill in form function
 function fillInForm(product){
   $('#marca').val($.trim($(product.cells[0]).text()));
   $('#marca').prop('disabled', true);
   $('#modelo').val($.trim($(product.cells[1]).text()));
   $('#modelo').prop('disabled', true);
   $('#serie').val($.trim($(product.cells[2]).text()));
   $('#serie').prop('disabled', true);
   $('#tension').val($.trim($(product.cells[3]).text()));
   $('#proveedor').val($.trim($(product.cells[4]).text()));
   $('#product-id').val(product.id);
 }
//update row of table function
 function updateProduct(product){
   var row = $('table #'+product._id)[0];
   $(row.cells[3]).text(product.tension);
   $(row.cells[4]).text(product.proveedor);
 }

//delete a product
  $('#delete-button').on('click', function(){
    var checked = $('[name=product-radio]:checked');
    if(checked.length > 0){
      var product = checked.parent().parent();
      deleteProduct(product[0].id);
    }
  });
// delete a product function
  function deleteProduct(product_id){
    $.ajax({
      type: 'DELETE',
      url: '/product/'+ product_id,
      success: function(data){
        if(data.msj){
          $('.alert').css('background-color', '#ff9800');
          $('#alert-text').text(data.msj);
          $('.alert').show();
        }
        else{
          $('#products-table #'+data._id).remove();
        }
      }
    });
  }//fin de deleteProduct

 function insertProduct(product){
   var row = $('<tr id="'+product._id+'"></tr>');
   row.append('<td>'+product.marca+'</td>');
   row.append('<td>'+product.modelo+'</td>');
   row.append('<td>'+product.serie+'</td>');
   row.append('<td>'+product.tension+'</td>');
   row.append('<td>'+product.proveedor+'</td>');
   row.append('<td>'+product.ubicacion+'</td>');
   row.append('<td>'+product.enContrato+'</td>');
   row.append('<td> <input type="radio" name="product-radio"> </td>');
   $('#products-table > tbody').append(row);
 }

});//fin de document.ready
