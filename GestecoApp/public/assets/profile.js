$(document).ready(function(){

  var client_id = $('#client-id').text();
  var id_tags = ['#sector-nav', '#contract-nav', '#service-nav'];
  var urls = ['/sector', '/contract', '/service'];
  var menu_item = ['sectores', 'contratos', 'servicios'];

  $.each(id_tags, function(index, value){
    $(value).on('click', function(){
        $.ajax({
          type: 'GET',
          url: urls[index],
          data: {id: client_id},
          success: function(responseHTML){
            $('#menu-item').text(' - ' + menu_item[index]);
            $('#main').html(responseHTML);
          }
        });
    });

  });

});




// dos funciones para sidenav
  function openNav() {
      document.getElementById("mySidenav").style.width = "20%";
      //document.getElementById("main").style.marginLeft = "20%";
      //document.getElementById("main").style.marginRight = "20%";
      span.style.visibility= "hidden";
  }

  function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      //document.getElementById("main").style.marginLeft = "0";
      //document.getElementById("main").style.marginRight = "0";
      document.getElementById("span").style.visibility= "visible";
  }
// fin de funciones para sidenav
