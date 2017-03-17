$(document).ready(function(){

  $('.alert').hide();
  var client_id = $('#client-id').text();
  var _sector = {_id: 0, _new: true};

  $('button[type=reset]').on('click', function(){
    _sector._new = true;
  });

  $('form').on('submit', function(){

    var form_data = {
      nombre: $('#nombre').val(),
      direccion: $('#dir').val(),
      tel: (function(){ var tel= $('#tel').val(); return (tel === "")? 0 : tel;})(),
      email: $('#email').val()
    };

    if(_sector._new){
      $.ajax({
        type: 'POST',
        url: '/sector',
        data: {json: JSON.stringify({sector: form_data, client_id: client_id})},
        success: function(data){
          insertSector(data.sector);
        }
      });
    }else{
      form_data._id = $('#sector-id').val();
      $.ajax({
        type: 'PUT',
        url: '/sector/'+form_data._id,
        data: {json: JSON.stringify({sector: form_data, client_id: client_id})},
        success: function(data){
          $('.alert').css('background-color', '#4CAF50');
          $('#alert-text').text(data.msj);
          $('.alert').show(1500).hide(6000);
          updateSector(data.sector);
        }
      });

    }

      return false;
  });//fin de form.submit

//edit a sector
   $('#edit-button').on('click', function(){
     var checked = $('[name=sector-radio]:checked');
     if(checked.length > 0){
       var sector = checked.parent().parent();
       fillInForm(sector[0]);
       _sector._new = false;
     }
   });
  // fill in form function
    function fillInForm(sector){
      $('#nombre').val($.trim($(sector.cells[0]).text()));
      $('#dir').val($.trim($(sector.cells[1]).text()));
      $('#tel').val($.trim($(sector.cells[2]).text()));
      $('#email').val($.trim($(sector.cells[3]).text()));
      $('#sector-id').val(sector.id);
    }
  //update row of table function
     function updateSector(sector){
       var row = $('table #'+sector._id)[0];
       $(row.cells[0]).text(sector.nombre);
       $(row.cells[1]).text(sector.direccion);
       $(row.cells[2]).text(sector.tel);
       $(row.cells[3]).text(sector.email);
     }

//delete a sector
  $('#delete-button').on('click', function(){
    var checked = $('[name=sector-radio]:checked');
    if(checked.length > 0){
      var sector = checked.parent().parent();
      deleteSector(sector[0].id);
    }
  });
// delete a sector function
  function deleteSector(sector_id){
    $.ajax({
      type: 'DELETE',
      url: '/sector/'+ sector_id,
      data: {json: JSON.stringify({client_id: client_id})},
      success: function(data){
          $('.alert').css('background-color', '#ff9800');
          $('#alert-text').text(data.msj);
          $('.alert').show();
          $('#sectors-table #'+data.sector._id).remove();
      }
    });
  }//fin de deleteSector

  function insertSector(sector){
    var row = $('<tr id="'+ sector._id +'"></tr>');
    row.append('<td><strong>'+ sector.nombre +'</strong></td>')
    row.append('<td>'+ sector.direccion +'</td>')
    row.append('<td>'+ sector.tel +'</td>')
    row.append('<td>'+ sector.email +'</td>');
    row.append('<td> <input type="radio" name="sector-radio"> </td>');
    $("#sectors-table > tbody").append(row);
  }
});// fin de document.ready

