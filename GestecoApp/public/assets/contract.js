$(document).ready(function () {

  var client_id = $('#client-id').text();
  var _contract = { _id: 0, _new: true };

  $('form').on('submit', function () {

    var form_contract = {
      tipoContrato: $('#tipo-contrato option:selected').val(),
      inicio: $('#fecha-inicio').val(),
      fin: $('#fecha-fin').val(),
      detalles: []
    };

    var checked = $('#product-table  input:checked');

    checked.each(function () {
      var rowData = {
        _idEquipo: this.id,
        volumenFijo: $('[name = ' + this.id + '] > td > [name = volumen-fijo]').val(),
        cargoFijo: $('[name = ' + this.id + '] > td > [name = cargo-fijo]').val(),
        costoExcedente: $('[name = ' + this.id + '] > td > [name = costo-excedente]').val()
      }
      if (!_contract._new) {
        rowData._id = $('[name = ' + this.id + '] > [name = detail_id]').text();
      }
      form_contract.detalles.push(rowData);
    });


    if (checked.length > 0) {
      if (_contract._new) {
        $.ajax({
          type: 'POST',
          url: '/contract',
          data: { json: JSON.stringify({ contract: form_contract, client_id: client_id }) },
          success: function (myContract) {
            $.each(myContract.detalles, function () {
              $('#product-table > tbody > [name = ' + this.equipo + ']').remove();
            });
            var inicio = new Date(myContract.inicio);
            var fin = new Date(myContract.fin);
            var contract = $('<tr id="' + myContract._id + '"></tr>');
            contract.append('<td>' + myContract.tipoContrato + '</td>');
            contract.append('<td>' + ("0" + inicio.getUTCDate()).slice(-2) + ' - ' + ("0" + (inicio.getUTCMonth() + 1)).slice(-2) + ' - ' + inicio.getUTCFullYear() + '</td>');
            contract.append('<td>' + ("0" + fin.getUTCDate()).slice(-2) + ' - ' + ("0" + (fin.getUTCMonth() + 1)).slice(-2) + ' - ' + fin.getUTCFullYear() + '</td>');
            contract.append('<td> <button type="button">Detalles</button> </td>');
            contract.append('<td> <input type="radio" name="contract-radio"> </td>');
            $('#contracts-table > tbody').append(contract);
            setContractTableListeners($('#contracts-table > tbody > #' + myContract._id));
            openTab('contratos');
          }
        });
      } else {
        $.ajax({
          type: 'PUT',
          url: '/contract/' + _contract._id,
          data: { json: JSON.stringify({ contract: form_contract, client_id: client_id }) },
          success: function (data) {
            alert(data.msj);
            location.reload();
          }
        });
      }

    } else {
      alert('seleccione equipo')
    }

    return false;
  });// fin de form.submit


  //codigo para tabs
  //
  $('#formulario-tab').on('click', function () {
    openTab('formulario');
  });

  $('#consultar-tab').on('click', function () {
    openTab('contratos');
  });

  function openTab(tab) {
    $(".tabcontent").each(function () {
      if (tab != this.id)
        $(this).hide();
      else
        $(this).show();
    });
  }
  //
  //fin de codigo pata tabs


  //para el boton detalle
  function setContractTableListeners(contracts) {
    contracts.each(function () {//this references to each contract
      var id = this.id;
      getDetails.call(this, id);
    });
  }
  setContractTableListeners($('#contracts-table > tbody > tr'));

  //
  $('#pre-delete').on('click', function () {
    showDatailTable(false);

  });
  $('#cancel').on('click', function () {
    showDatailTable(true);

  });
  $('#delete').on('click', function () {
    var checked = $('#detalles input:checked');

    if (checked.length > 0) {
      var contract_id = $(checked[0]).attr('name');//name contiene _id del contrato
      var detail_ids = [];
      checked.each(function () {
        detail_ids.push(this.id);//id contiene _id del detalle
      });
      deleteDetail(contract_id, detail_ids);
    }
  });

  //elimina un detalle a la vez de la lista de detalles
  function deleteDetail(contract_id, detail_ids) {
    $.ajax({
      type: 'DELETE',
      url: '/contract/' + contract_id + '/detail',
      data: { json: JSON.stringify({ client_id: client_id, detail_ids: detail_ids }) },
      success: function (detail_ids) {
        //si se eliminan todos los detalles, se elimina el contrato
        var rowCount = $('#details-table > tbody > tr').length;
        var contract = $('#contracts-table #' + contract_id)[0];
        if (detail_ids.length == rowCount)
          deleteContract(contract);
        //
        $.each(detail_ids, function () {
          $('#details-table > tbody > tr > td > #' + this).parent().parent().remove();
        });

        showDatailTable(true);
      }
    });
  }

  //obtiene todos los detalles para un contrato
  function getDetails(id) {
    $(this.cells[3]).on('click', function () {

      $.ajax({
        type: 'GET',
        url: '/contract/' + id,
        //data: {id: client_id},
        success: function (res) {
          $('#details-table > tbody').empty();//se remueve toda fila antes de cargar
          
          $.each(res.detalles, function (index, detalle) {
            var detail = $('<tr ></tr>');
            detail.append('<td>' + detalle._idEquipo.marca + '</td>');
            detail.append('<td>' + detalle._idEquipo.modelo + '</td>');
            detail.append('<td>' + detalle._idEquipo.serie + '</td>');
            detail.append('<td>' + detalle._idEquipo.proveedor + '</td>');
            detail.append('<td>' + detalle._idEquipo.tension + '</td>');
            detail.append('<td>' + detalle.volumenFijo + '</td>');
            detail.append('<td>' + detalle.cargoFijo + '</td>');
            detail.append('<td>' + detalle.costoExcedente + '</td>');
            detail.append('<td><input type="checkbox"  id="' + detalle._id + '" name="' + id + '"></td>');
            $("#details-table > tbody").append(detail);
          });

          if (res.detalles.length > 0)
            showDatailTable(true);
        }
      });
    });
  }

  function showDatailTable(show) {
    var columnTh = $("#details-table th:contains('Seleccione')");
    var columnTd = $('#details-table tr td:nth-child(' + (columnTh.index() + 1) + ')');
    if (show) {
      columnTh.hide();
      columnTd.hide();
      $('#cancel').hide();
      $('#delete').hide();
      $('#pre-delete').show();
      $('#detalles').show();
    } else {
      columnTh.show();
      columnTd.show();
      $('#pre-delete').hide();
      $('#delete').show();
      $('#cancel').show();
    }
  }

  //edit contract
  $('#edit-contract').on('click', function () {
    var checked = $("input[name=contract-radio]:radio:checked");
    if (checked[0]) {
      var contract = $(checked[0]).parent().parent()[0];
      editContract(contract);
    }
  });
  function editContract(contract) {

    var dateInicio = $(contract.cells[1]).text();//dd-mm-yyyy
    dateInicio = dateFormat(dateInicio);
    var dateFin = $(contract.cells[2]).text();//dd-mm-yyyy
    dateFin = dateFormat(dateFin);
    $.ajax({
      type: 'GET',
      url: '/contract/' + contract.id,
      data: { id: client_id },
      success: function (res) {

        $('#tipo-contrato').val($.trim($(contract.cells[0]).text()));
        $('#fecha-inicio').val(dateInicio);
        $('#fecha-fin').val(dateFin);
        $('#product-table > tbody > tr').remove();
        var detail;
        $.each(res.detalles, function () {
          detail = $('<tr name="' + this._idEquipo._id + '"></tr>');
          detail.append('<td>' + this._idEquipo.marca + '</td>');
          detail.append('<td>' + this._idEquipo.modelo + '</td>');
          detail.append('<td>' + this._idEquipo.serie + '</td>');
          detail.append('<td>' + this._idEquipo.proveedor + '</td>');
          detail.append('<td>' + this._idEquipo.tension + '</td>');
          detail.append('<td><input type="text" name="volumen-fijo" value="' + this.volumenFijo + '" /></td>');
          detail.append('<td><input type="text" name="cargo-fijo" value="' + this.cargoFijo + '" /></td>');
          detail.append('<td><input type="text" name="costo-excedente" value="' + this.costoExcedente + '" /></td>');
          detail.append('<td><input type="checkbox" id="' + this._idEquipo._id + '"></td>');
          detail.append('<td style="display:none" name="detail_id">' + this._id + '</td>');
          $("#product-table > tbody").append(detail);
        });
        _contract._new = false;
        _contract._id = contract.id;
        openTab('formulario');

      }
    });
  }

  //delete contract
  $('#delete-contract').on('click', function () {
    var checked = $("input[name=contract-radio]:radio:checked");
    if (checked[0]) {
      var contract = $(checked[0]).parent().parent()[0];
      deleteContract(contract);
    }
  });
  function deleteContract(contract) {
    $.ajax({
      type: 'DELETE',
      url: '/contract/' + contract.id,
      data: { json: JSON.stringify({ client_id: client_id }) },
      success: function (contract_id) {
        $('#contracts-table > tbody > #' + contract_id).remove();
        $('#details-table > tbody > tr > td > input[name = ' + contract_id + ']').parent().parent().remove();
      }
    });
  }


  function dateFormat(date) {//recibe dd-mm-yyyy string y devuelve yyyy-mm-dd tipo Date
    var dateSplit = date.split("-");
    date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    date = date.getFullYear() + "-" + (month) + "-" + (day);
    return date;
  }




});//fin de document.ready
