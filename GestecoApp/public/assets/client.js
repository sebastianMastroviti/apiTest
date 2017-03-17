$(document).ready(function () {

  $('.alert').hide();
  var _client = { _id: 0, _new: true };

  $('button[type=reset]').on('click', function () {
    $('#cuit').prop('disabled', false);
    _client._new = true;
  });

  $('form').on('submit', function () {

    var client_form = {
      nombre: $('#nombre').val(),
      cuit: $('#cuit').val(),
      tel: (function () { var tel = $('#tel').val(); return (tel === "") ? 0 : tel; })(),
      email: $('#email').val()
    };


    if (_client._new) {//supongo que es un nuevo cliente
      $.ajax({
        type: 'POST',
        url: '/client',
        data: client_form,
        success: function (data) {
          if (data.client) {
            insertClient(data.client);
          }
          $('#alert-text').text(data.msj);
          $('.alert').show();

        }//fin de success
      });
    } else {
      client_form._id = $('#client-id').val();
      $.ajax({
        type: 'PUT',
        url: '/client/' + client_form._id,
        data: client_form,
        success: function (data) {
          updateClient(data);
        }
      });
    }

    return false;
  });//fin de form.submit

  //edit a client
  $('#edit-button').on('click', function () {
    var checked = $('[name=client-radio]:checked');
    if (checked.length > 0) {
      var client = checked.parent().parent();
      fillInForm(client[0]);
      _client._new = false;
    }
  });
  // fill in form function
  function fillInForm(client) {
    $('#nombre').val($.trim($(client.cells[1]).text()));
    $('#cuit').val($.trim($(client.cells[2]).text()));
    $('#cuit').prop('disabled', true);
    $('#tel').val($.trim($(client.cells[3]).text()));
    $('#email').val($.trim($(client.cells[4]).text()));
  }


  function insertClient(client) {
    var row = $('<tr id="' + client._id + '"></tr>');
    row.append('<td> <div id="logo"></div> </td>');
    row.append('<td><strong>' + client.nombre + '</strong></td>');
    row.append('<td>' + client.cuit + '</td>');
    row.append('<td>' + client.tel + '</td>');
    row.append('<td>' + client.email + '</td>');
    row.append('<td><a href="/client/' + client._id + '">Ver perfil</a> </td>');
    row.append('<td> <input type="radio" name="client-radio"> </td>');
    $("#clients-table > tbody").append(row);
  }

  function updateClient(client) {
    var row = $('table #' + client._id)[0];
    $(row.cells[1]).text(client.nombre);
    $(row.cells[2]).text(client.cuit);
    $(row.cells[3]).text(client.tel);
    $(row.cells[4]).text(client.email);
  }
  //delete a client
  $('#delete-button').on('click', function () {
    var checked = $('[name=client-radio]:checked');
    if (checked.length > 0) {
      var client = checked.parent().parent();
      deleteClient(client[0].id);
    }
  });
  // delete a client function
  function deleteClient(client_id) {
    $.ajax({
      type: 'DELETE',
      url: '/client/' + client_id,
      success: function (data) {
        if (data.msj) {
          $('.alert').css('background-color', '#ff9800');
          $('#alert-text').text(data.msj);
          $('.alert').show();
        }
        else {
          $('#clients-table #' + data._id).remove();
          $('form')[0].reset();
          $('#cuit').prop('disabled', false);
        }
      }
    });
  }//fin de deleteClient


});//fin de document.ready
