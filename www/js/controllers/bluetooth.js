angular.module('bluetooth', [])

<<<<<<< HEAD
.controller('bluetoothCtrl', function($scope, $localStorage, $translate, $ionicPopup, $timeout, $ionicLoading, $ionicModal, Data, $rootScope) {
=======
.controller('bluetoothCtrl', function($scope, $localStorage, $translate, $ionicPopup, $timeout, $ionicLoading, Data, $rootScope) {
>>>>>>> 90fff90fe967741fa04f92b2916cd9acf38f419a

$scope.showDevices = false;
$scope.data.batteryPercent = -1;
$scope.data.btnDisc = false;
$scope.data.btnFindDevs = true;
$scope.data.translogikOptions = false;
$scope.data.imgConBluetooth = false;

  ///////// FUNCIÓN DE INICIALIZACIÓN
  $scope.init = function(){
      var bluetoothName = $localStorage.dataBluetooth;

      if(bluetoothName.length > 0){
        console.log(bluetoothName.length)
        console.log("ya hay un bluetooth conectado llamado: " + $localStorage.dataBluetooth);
        console.log("so... mostrar sus opciones");
        $scope.data.translogikOptions = true;
        $scope.data.deviceActivated = true; 
        $scope.data.deviceName = bluetoothName;
        $scope.data.btnDisc = true;
      } else {
        console.log("No hay bluetooth entonces ir a pedir lista");
        bluetoothSerial.isEnabled(function() {
            $localStorage.bluetooth = true;
        }, function(reason) {
            $localStorage.bluetooth = false;
        });
        $scope.data.bluetooth = $localStorage.bluetooth;  
        
        $scope.data.btnFindDevs = true;

      }        
      $scope.$broadcast('scroll.refreshComplete');
  }


  $scope.showOkMessage = function(error){
      var popTitle = $translate.instant('MSG_ERROR')
      var aceptar = $translate.instant('MSG_ACEPTAR')                
      $ionicPopup.alert({
          title: popTitle,
          template: '<center><p><b>' + error + '</b></p></center>',
          okText: aceptar,
          okType: 'button-positive'
      });                    
  }
  $scope.showSuccessMessage = function(error){
      var aceptar = $translate.instant('MSG_ACEPTAR')                
      $ionicPopup.alert({
          template: '<center><p><b>' + error + '</b></p></center>',
          okText: aceptar,
          okType: 'button-balanced'
      });                    
  }
  $scope.showErrorMessage = function(success){
      var popTitle = $translate.instant('MSG_INFORMATION')
      var aceptar = $translate.instant('MSG_ACEPTAR')                
      $ionicPopup.alert({
          title: popTitle,
          template: '<center><p><b>' + success + '</b></p></center>',
          okText: aceptar,
          okType: 'button-assertive'
      });                    
  }


  /*----------------------BLUETOOTH FUNCIONES DE CONEXIÓN--------------------------*/
  var device;
  $scope.storage = [];
  reconnect_interval_timeout = null;
  reconnect_actual_interval = 0;

  ///////// ESCANEAR DISPOSITIVOS
  $scope.scanDevices = function(){
    bluetooth.getDeviceList(onDeviceList, onError);
    console.log("escaneo de dispositivos")
  }
  ///////// CONECTAR DISPOSITIVO
  $scope.connectDevice = function(dev) {       
      var device = JSON.parse(dev);
      if(device.address){
          $scope.data.deviceName = device.name;
          $localStorage.dataBluetooth = device.name;
          $scope.data.imgConBluetooth = true;
          $scope.data.deviceActivated = true;
          $scope.data.btnFindDevs = false;          
          bluetooth.connect(device.address, onConnectToDevice, onConnectionError);          
      }
  }
  ///////// DESCONECTAR DISPOSITIVO
  $scope.desconect = function(){
    console.log('send disconnect');
    $scope.data.deviceActivated = false;
    $scope.data.btnFindDevs = true;    
    $scope.data.translogikOptions = false;
    bluetooth.disconnect(onDisconnectFromDevice, onConnectionError);
  }

  ///////// LISTA DE DISPOSITIVOS
  function onDeviceList(data) {
      console.log(data);
      $scope.showDevices = true;
       $scope.devs = [];
        data.forEach(function(device) {
            $scope.devs.push(device);
        })
      if (data.length === 0) {
          $scope.showErrorMessage($translate.instant('MSG_NOT_DEVICES_CONNECTING'));
          $scope.showDevices = false;
      }
  }

  ///////// CUANDO HAY ERROR ENTONCES..
  function onError() {
      alert(JSON.stringify(error));
  }

  ///////// CONECTADO AL DISPOSITIVO
  function onConnectToDevice() {
      $scope.showSuccessMessage($translate.instant("MSG_BLUETOOTH_CONNECTING") + "\n " + $scope.data.deviceName)

      $scope.showDevices = false;      
      $scope.data.translogikOptions = true;
      $scope.data.imgConBluetooth = false;
      $scope.data.deviceActivated = true;      
      $scope.data.btnFindDevs = false;
      $scope.data.btnDisc = true;

      $scope.getBatteryStatus();
  }

  ///////// CONEXIÓN CON ERROR
  function onConnectionError() {         
      $scope.data.translogikOptions = false;
      $scope.data.deviceActivated = true;
      $scope.data.imgConBluetooth = false;      
      $scope.data.btnFindDevs = true;
      $scope.data.btnDisc = false;
      $scope.showDevices = true; 
      $localStorage.dataBluetooth = "";
      $scope.showErrorMessage($translate.instant("MSG_BLUETOOTH_ERROR_CONECTED"))
  }

  ///////// DESCONECTADO DE DISPOSITIVO
  function onDisconnectFromDevice(){
    console.log("Desconected");
    $scope.devs = [];
    $localStorage.dataBluetooth = "";
    console.log("se apago el dispositivo... ahora localStorage tiene? " + $localStorage.dataBluetooth)
  }
/*----------------------BLUETOOTH FUNCIONES DE CONEXIÓN--------------------------*/

  $scope.getBatteryStatus = function(){
    bluetooth.getBatteryStatus(function(data) {       
      var batteryLevel = parseFloat(data)      
      $scope.data.batteryPercent = (batteryLevel / 7.4) * 100;
       });
  }

  $scope.shutDown = function(){
      bluetooth.shutDown();
      $scope.data.translogikOptions = false;
      $scope.data.deviceActivated = true;
      $scope.data.imgConBluetooth = false;      
      $scope.data.btnFindDevs = true;
      $scope.data.btnDisc = false;
      $scope.showDevices = true; 
      $localStorage.dataBluetooth = "";
  }


 /*Read RFID*/
  var scan_rfid;
  var editable;
  var rfid_timeout_var = "off";
  var rfid_timeout_id;
  
  $scope.scanRFID = function() {
    console.log("entró a scan RFID")
    scan_rfid = false;
    editable = false;
    scan_rfid = !scan_rfid;
    if (scan_rfid) {
      bluetooth.callBackOnrfidNoTagFoundResponse = onNoTagsFound;

      bluetooth.readRFIDContinuous(function(data) {
          var epc_header = data.EPCheader;
          var cai = data.cai;
          var company_prefix = data.companyPrefix;
          var partition = data.partition;
          var serial_number = data.sn;
          var filter = data.filter;
          var matricule = '';//data.michelin;
          var encodingData = data.encodedData;

          console.log("rfid : cai="+cai);
          console.log("rfid : company_prefix="+company_prefix);
          console.log("rfid : partition="+partition);
          console.log("rfid : filter="+filter);
          console.log("rfid : epc_header="+epc_header);
          console.log("rfid : matricule="+matricule);
          console.log("rfid : serial_number="+serial_number);
          console.log("rfid : encodingData="+encodingData);

      });
    }else {
        console.log('No Read: '+data_localize.scan_rfid);
        bluetooth.rfidOff(function() {
        });
        bluetooth.callBackOnrfidNoTagFoundResponse = null;
    }

  }//end scanRFID Function

  $scope.readRFID = function(tag){    
    console.log("entró a read RFID")
    console.log("el TAG es: " + tag)

    var numberPattern = /\d+/g;

    var newTag = tag.match( numberPattern )
    newTag = String(newTag).replace(",","")
    console.log("el nuevo TAG es: " + newTag)

    bluetooth.callBackOnrfidNoTagFoundResponse = onNoTagsFound;
    if (rfid_timeout_var !== "off") {
        console.log('set timout frid' + rfid_timeout_var)
        rfid_timeout_id = window.setTimeout(function() {
            onNoTagsFound();
            bluetooth.rfidOff(function() {
            })
        }, rfid_timeout_var);
    }

    bluetooth.readRFID(function(data) {
      console.log('clear timeout frid')
      window.clearTimeout(rfid_timeout_id);
      var epc_header = data.EPCheader;
      var cai = data.cai;
      var company_prefix = data.companyPrefix;
      var partition = data.partition;
      var serial_number = data.sn;
      var filter = data.filter;
      var matricule = "";//data.michelin;
      var encodingData = data.encodedData;
      console.log("rfid : cai = "+cai);
      console.log("rfid : company_prefix = "+company_prefix);
      console.log("rfid : partition = "+partition);
      console.log("rfid : filter = "+filter);
      console.log("rfid : epc_header = "+epc_header);
      console.log("rfid : matricule = "+matricule);
      console.log("rfid : serial_number = "+serial_number);
      console.log("rfid : encodingData = "+encodingData);

      if(String(newTag) == String(serial_number)){
        alert("ES EL MISMO");
        $scope.data.tagDetected = "SI"
      } else {
        alert("NO ES EL MISMO TAG\nLEÍDO: " + serial_number + "\nORIGINAL: " + newTag);
      }
    });
  }

  $scope.writeRFID = function(tag){
    console.log("el tag a escribir es: " +  tag)
    
    var encodedData = encodeDataRFID(1, 0, 1, 1, 1, tag); //Toma los datos guardados en un scope "tag_data" y genera una cadena en 64b


    bluetooth.writeRFID(encodedData, function(data) {
      var loading = $translate.instant('MSG_LOADING');
      $ionicLoading.show({
          template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
          content: loading,
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      $timeout(function() {
        console.log("_______________________________________________")
        console.log(data);
        alert('Escrito')
        bluetooth.rfidOff(function(){}); 
        $ionicLoading.hide();               
        }, 3000); 

    });       
  };

  $scope.cancelWriteRFID = function () {
    console.log("entro a cancelar");
    bluetooth.rfidOff();
    $scope.showOkMessage($translate.instant('NFC_ESCRITURA_CANCELADA'));        
  };

  $scope.readTag = function(){   
    console.log("entró a leer tag")
    $scope.data.formFindTag = false;
    $scope.data.dataResult = false; 
    $scope.data.readingTag = true;
    $scope.data.notResults = false;

    bluetooth.callBackOnrfidNoTagFoundResponse = onNoTagsFound;
    if (rfid_timeout_var !== "off") {
        console.log('set timout frid' + rfid_timeout_var)
        rfid_timeout_id = window.setTimeout(function() {
            onNoTagsFound();
            bluetooth.rfidOff(function() {
            })
        }, rfid_timeout_var);
    }

    bluetooth.readRFID(function(data) {
      console.log('clear timeout frid')
      window.clearTimeout(rfid_timeout_id);
      var epc_header = data.EPCheader;
      var cai = data.cai;
      var company_prefix = data.companyPrefix;
      var partition = data.partition;
      var serial_number = data.sn;
      var filter = data.filter;
      var matricule = "";//data.michelin;
      var encodingData = data.encodedData;
      console.log("rfid : cai = "+cai);
      console.log("rfid : company_prefix = "+company_prefix);
      console.log("rfid : partition = "+partition);
      console.log("rfid : filter = "+filter);
      console.log("rfid : epc_header = "+epc_header);
      console.log("rfid : matricule = "+matricule);
      console.log("rfid : serial_number = "+serial_number);
      console.log("rfid : encodingData = "+encodingData);
      $scope.findTag(String(serial_number));      
    });

  }

  $scope.cancelReadTag = function(){
      $scope.data.formFindTag = true;
      $scope.data.dataResult = false; 
      $scope.data.readingTag = false;
      $scope.data.notResults = false;

      bluetooth.rfidOff();
      $scope.showOkMessage()   
  }
  function onNoTagsFound() {
      scan_rfid = false;
      //$('#read_rfid_Button_Scan_rfid span span span').text(data_localize.scan_rfid);
      bluetooth.callBackOnrfidNoTagFoundResponse = null;
      alert(data_localize.rfid_tag_not_found);
      //navigator.notification.alert(data_localize.rfid_tag_not_found, null, data_localize.alert, data_localize.ok);

  }

  $scope.bluetoothOptions = function(){
      console.log("entró")
      bluetoothSerial.showBluetoothSettings(
          console.log("entró a settings"),
          console.log("error")
      );
  }
        //////////////////////BLUETOOTH MODULE/////////////////////
  $scope.data.formFindTag = true;
  $scope.data.dataResult = false;
  $scope.data.readingTag = false;
  $scope.data.notResults = false;

  $scope.readOtherTag = function(){

      $scope.data.formFindTag = true;
      $scope.data.dataResult = false; 
      $scope.data.readingTag = false;
      $scope.data.notResults = false;                                   
  }
  
  $scope.manualWrite = function(){
      $scope.data.tagCamion = $scope.data.tagValue;
  }

  $scope.findTag = function(tag){
    //var numberPattern = /[^0-9]/g;;
    //var newTag = tag.replace( numberPattern, "");
    //console.log("el nuevo tag es " + newTag);

    var loading = $translate.instant('MSG_LOADING');
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
        content: loading,
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    }); 

    //BUSCAMOS NUESTRO TAG
    var DataPromise = Data.getHistoryByTag($rootScope.url, tag)
    DataPromise.then(function(result) {
        if (result['exist'] == 'YES') {               
            $scope.data.formFindTag = false;
            $scope.data.dataResult = true;
            $scope.data.readingTag = false;
            $scope.data.notResults = false;
            $ionicLoading.hide();
        } else if (result['exist'] == 'NO') {
            $scope.data.formFindTag = false;
            $scope.data.dataResult = false;
            $scope.data.readingTag = false;
            $scope.data.notResults = true;
            $ionicLoading.hide();
        }

    }, function(reason) {
        $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/><b>' + $translate.instant('MSG_TRY_AGAIN'));
        $ionicLoading.hide();
    })    

    var DataPromise = Data.getHistoryByTag($rootScope.url, tag)
      var loading = $translate.instant('MSG_LOADING');
              $ionicLoading.show({
                      template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                      content: loading,
                      animation: 'fade-in',
                      showBackdrop: true,
                      maxWidth: 200,
                      showDelay: 0
              });

              DataPromise.then(function(result) {
                console.log(result);
                $ionicLoading.hide();
                    
                }, function(reason) {
                    //ERROR DE CONEXIÓN
                    $ionicLoading.hide();
                    var error = $translate.instant('MSG_ERROR');
                    var aceptar = $translate.instant('MSG_ACEPTAR');
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: error,
                        template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                })

  }


   $scope.openModal = function(index) {
        console.log("Entramos al modal!" + index)
        if (index == 1) $scope.oModal1.show();
       
    };

    $scope.closeModal = function(index) {
        if (index == 1) $scope.oModal1.hide();
       
    };

    $ionicModal.fromTemplateUrl('templates/detallesLlanta.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal1 = modal;
    });

});