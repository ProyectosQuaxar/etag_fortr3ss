angular.module('tires', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('TiresCtrl', function($ionicPlatform, ionicMaterialInk, $ionicModal, $scope, $localStorage, $translate, $ionicLoading, $ionicPopup, Data, StorageService, $rootScope, $state, $timeout, $ionicScrollDelegate, Check){

        //$scope.customers = {};
        //$scope.fleets = {};
        //$scope.company = "";
        $scope.truckModel = {};     
        $scope.truckModels = {};
        $scope.truckTypes = {};
        $scope.trucks = {};
        $scope.truckTag = "";
        $scope.data.truckTag = ""
        $scope.data.placas = "";
        $scope.data.llantas = "";
        $scope.data.flota = "";
        $scope.data.img = "";
        $scope.data.tipo = "";
        $scope.data.descripcion = "";     
        $scope.idFlota = "";
        $scope.tipo = "";
        $scope.tiresnumber = "";
        $scope.data.tiresData = [];
        $scope.data.semaphore = "";
        $scope.disableArea = true;
        
        $scope.data.truckId = "";
        $scope.data.fleet = "";
        $scope.data.company = "";
        $scope.data.semaphore = "";
        $scope.data.pressure = "";
        $scope.data.tiresAvailable = 'false'
        $scope.noTiresInCustomer = 'false';
        $scope.data.tiresInTruck = false;
        $scope.data.imgTruck = "";
        $scope.data.numLlantas = "";
        $scope.data.kms = 0;
        $scope.selection = {
            ids: {
                "ninguna": false
            }
        };
        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);    

        $scope.init = function() {
            $scope.fleets = $localStorage.fleets;
            console.log("Contenido de Fleets: " + $scope.fleets);
            $scope.customers = $localStorage.customers;
            $scope.data.tireModels = $localStorage.tireModels;
            if($localStorage.addTire){
                $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;
            }            
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
        $scope.getFlotas = function(company) {
            $scope.data.company = company;
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado
                //comparamos si la compañia seleccionada es la misma que  
                console.log("company: " + company + " localStorage: " + $localStorage.company)           
                if (company == $localStorage.company) {
                    //seleccionar las flotas almacenadas en Storage
                    $scope.fleet = $localStorage.fleet;
                    $scope.fleets = $localStorage.fleets;
                    console.log($scope.fleets)
                    $scope.idFlota = $localStorage.idFlota;
                } else {
                    //informamos que 
                    var msgError = $translate.instant('MSG_USEMODE_OFFLINE_DESC')
                    var popTitle = $translate.instant('MSG_ALERT_OFFLINE_ACTIVE')
                    var aceptar = $translate.instant('MSG_ACEPTAR')
                    $ionicPopup.alert({
                        title: popTitle,
                        template: '<center><p><b>' + msgError + ':<br>' + $localStorage.companyName + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-positive'
                    });
                }
            } else {
                //si hay conexión a internet
                var loading = $translate.instant('MSG_LOADING');
                var DataPromise = Data.getFlotasbyCliente($rootScope.url, company)
                DataPromise.then(function(result) {
                    if (result['fleets']) {
                        $scope.fleets = result['fleets'];
                    }
                }, function(reason) {
                    var error = $translate.instant('MSG_ERROR');
                    var aceptar = $translate.instant('MSG_ACEPTAR');
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicPopup.alert({
                        title: error,
                        template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                })
            }
        }
        $scope.getTrucksByFleet = function(fleet) {
            $scope.data.fleet = fleet;
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado
                //comparamos si la compañia seleccionada es la misma que  
                //seleccionar las flotas almacenadas en Storage
                    $scope.trucks = $localStorage.trucks; 

            } else {

                //si hay conexión a internet
                var DataPromise = Data.getTrucksByFlota($rootScope.url, fleet)
                DataPromise.then(function(result) {
                    if (result['trucks']) {
                        $scope.trucks = result['trucks'];
                    }

                }, function(reason) {
                    var error = $translate.instant('MSG_ERROR');
                    var aceptar = $translate.instant('MSG_ACEPTAR');
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicPopup.alert({
                        title: error,
                        template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                })
            }
        }
        $scope.findTires = function (truck){            
            var truckArray = JSON.parse(truck);
            console.log(truckArray)
            var llantasARegistrar = 0;
            var llantasRegistradas = 0;
            $scope.data.tiresData = [];
            $scope.data.tagTruck = truckArray['tag'];
            $scope.data.truckInspectionated = truckArray;
            $scope.data.truckId = truckArray['id'];
            if ($localStorage.appModeStatus) {
                // Si estamos fuera de línea
                if($localStorage.tires.length != 0){                    
                     angular.forEach($localStorage.tires, function(value, key) {                            
                        if(value.camionId == truckArray['id']){
                            //console.log(value.camionId);                    
                            //console.log("TAG ID: " + value.tagId + "Posición:" + value.position) 
                            $scope.data.tiresData.push(value.tagId, value.position);                    
                        }                  
                    });                                                        
                }                
                //una vez obtenidas las llantas comparamos el tamaño contra el numero original.
                angular.forEach($localStorage.truckTypes, function(value, key){
                    if(truckArray['tipo'] == value.id){                        
                        llantasARegistrar = value.numLlantas;
                    }
                })

                llantasRegistradas = Object.keys($scope.data.tiresData).length;
                if(llantasRegistradas != 0){
                    llantasRegistradas = llantasRegistradas/2;
                }
                $scope.data.llantasRegistradas = llantasRegistradas;
                $scope.data.llantasARegistrar = llantasARegistrar;

                llantasARegistrar = llantasARegistrar - llantasRegistradas;
                console.log(llantasARegistrar)
                if(llantasARegistrar <= 0){
                    console.log("entró a true")
                    $scope.data.tiresAvailable = "true"
                    $scope.data.tiresInTruck = "true"
                } else {
                    console.log("entró a false")
                    $scope.data.tiresAvailable = "false"
                    $scope.data.tiresInTruck = "false"
                }

            } else {
                // Si estamos en línea
                var DataPromise = Data.getTiresByTruck($rootScope.url, truckArray['id'])
                DataPromise.then(function(result) {
                    
                    //Obtenemos el tamaño original de llantas
                    angular.forEach($localStorage.truckTypes, function(value, key){
                        if(truckArray['tipo'] == value.id){                        
                            llantasARegistrar = value.numLlantas;
                        }
                    })                    


                    if (result['tires']) {

                        if($localStorage.tires.length != 0){                    
                             angular.forEach(result['tires'], function(value, key) {                            
                                if(value.camionId == truckArray['id']){
                                    //console.log(value.camionId);                    
                                    //console.log("TAG ID: " + value.tagId + "Posición:" + value.position) 
                                    $scope.data.tiresData.push(value.tagId, value.position);                    
                                }                  
                            });                                                        
                        }                          
                        /***************************************/
              

                        llantasRegistradas = Object.keys($scope.data.tiresData).length;
                        if(llantasRegistradas != 0){
                            llantasRegistradas = llantasRegistradas/2;
                        }
                        $scope.data.llantasRegistradas = llantasRegistradas;
                        $scope.data.llantasARegistrar = llantasARegistrar;

                        llantasARegistrar = llantasARegistrar - llantasRegistradas;
                        if(llantasARegistrar <= 0){
                            $scope.data.tiresAvailable = "true"
                            $scope.data.tiresInTruck = "true"
                        } else {
                            $scope.data.tiresAvailable = "false"
                            $scope.data.tiresInTruck = "false"
                        }                    
                        /***************************************/ 
                    } else {
                        $scope.data.llantasARegistrar = llantasARegistrar;
                        $scope.data.tiresAvailable = "false"
                        $scope.data.tiresInTruck = "false"
                    }
                                                                       
                }, function(reason) {
                    var error = $translate.instant('MSG_ERROR');
                    var aceptar = $translate.instant('MSG_ACEPTAR');
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicPopup.alert({
                        title: error,
                        template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                })            
            }
        }
        $scope.stateChanged = function(){
            var condFounds = ""; 
            angular.forEach($scope.selection.ids, function(value, key) {
                condFounds = key + ": " +value;                    
                if(key == "OTRA"){
                    if (value) {
                        console.log("Activada") 
                        $scope.disableArea = false;                                     
                        condFounds = "";                                                   
                    } else {
                        console.log("Desactivada")                
                        $scope.disableArea = true;
                        $scope.data.others = "";                        
                        condFounds = "";                                                                          
                    } 
                }
            });                    
        } 
        $scope.generateTires = function (){
            console.log("****************** \n en Generate Tires")
            console.log("company :" + $scope.data.company)
            console.log("fleet :" + $scope.data.fleet)
            console.log("truckId :" + $scope.data.truckId)
            console.log("kms :" + $scope.data.kms)

            $localStorage.addTire = [];
            var llantasARegistrar = $scope.data.llantasARegistrar;            
            var tag = $scope.data.tagTruck;
            $scope.data.tireConditions = $localStorage.tireConditions;
            for (var i=1; i<llantasARegistrar+1; i++) {
                $localStorage.addTire.push(
                    {posicion: i, tag: tag+(i < 10 ? '0' : '') + i}
                );                
            }
            var tipo = $scope.data.truckInspectionated['tipo'];

            angular.forEach($localStorage.truckTypes, function(value, key) {                    
                if(tipo == value.id){
                    $scope.data.imgTruck = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                    $scope.data.numLlantas = value.numLlantas;
                    $scope.data.truckTypeName = value.nombre
                }
            });
            $scope.data.addTire = $localStorage.addTire;
            $scope.truckTypes = $localStorage.truckTypes;
            $state.go("app.addMultiTires", {
                animation: 'slide-in-down'
            });                           
        }
        $scope.refreshDataTires = function(){
            angular.forEach($localStorage.trucks, function(value, key) {                            
                    if(value.id == $scope.truckId){                                                
                        $scope.truckModel = value.idModelo;
                        $scope.truckTag = value.tag;
                        $scope.data.truckTag = value.tag;
                        $scope.placas = value.placas;
                        $scope.data.placas = value.placas;
                        $scope.idFlota = value.idFlota;
                        $scope.tipo = value.tipo;                                        
                    }
                }); 
                angular.forEach($localStorage.truckTypes, function(value, key){
                    if (value.id == $scope.tipo){ 
                        $scope.data.tipo = value.descripcion; 
                        $scope.data.llantas = value.numLlantas;
                        $scope.data.img = value.img;
                        console.log($scope.data.img)
                    }    
                });
        } 
        $scope.getTires = function(tiresNumber) {
            return new Array(tiresNumber);
        }
        $scope.getBrands = function() {
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado                
                $scope.data.tireBrands = $localStorage.tireBrands;
                console.log($scope.tireBrands);
            } else {
                //si hay conexión a internet
                var loading = $translate.instant('MSG_LOADING');
                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                    content: loading,
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                var DataPromise = Data.getTireBrands($rootScope.url)
                DataPromise.then(function(result) {
                    if (result['marcas']) {
                        $scope.data.tireBrands = result['marcas'];
                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                    }

                }, function(reason) {
                    $ionicLoading.hide();
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicLoading.hide();
                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)                    
                })
            }
            if($localStorage.submitDataTruck){                
                console.log("Hay datos de por medio :)")
                console.log($localStorage.submitDataTruck)                
            } else {
                console.log("No hay Info :/")
            }
        }
        $scope.getSizesByBrand = function(tirebrand) {
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado                
                $scope.data.tireSizes = $localStorage.tireSizes;
            } else {
                //si hay conexión a internet
                var DataPromise = Data.getTireSizebyBrand($rootScope.url, tirebrand)
                DataPromise.then(function(result) {
                    if (result['medidas']) {
                        $scope.data.tireSizes = result['medidas'];
                    }

                }, function(reason) {
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)
                })
            }
        }
        $scope.getDesignBySize = function(size) {
            console.log(size);
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado                
                $scope.data.tireModels = $localStorage.tireModels;
                console.log($scope.data.tireModels);
            } else {
                //si hay conexión a internet
                var DataPromise = Data.getTireDesignbySize($rootScope.url, size)
                DataPromise.then(function(result) {
                    if (result['diseno']) {
                        $scope.data.tireModels = result['diseno'];
                    }
                }, function(reason) {
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)
                })
            }
        }
        $scope.startSemaphore = function(wear) {
            if (wear <= 3){
                console.log("Semaforo Rojo")
                $scope.data.semaphore = "Rojo";
            }
            if (wear <= 6 && wear >= 3.1){
                console.log("Semaforo Amarillo")
                $scope.data.semaphore = "Amarillo";
            }
            if (wear <= 10 && wear >= 6.1){
                console.log("Semaforo Verde")
                $scope.data.semaphore = "Verde";
            }
            if (wear >= 10.1){
                console.log("Semaforo blanco")
                $scope.data.semaphore = "Blanco";
            }
            console.log(wear);
        }
        $scope.isValid = function(value) {
            return !value
        }
        $scope.deletePos = function(pos){
            console.log("entró a borrar")
            var tiresToAdd = $localStorage.addTire;
            for (i = 0; i < tiresToAdd.length; i++) {                                
                if (tiresToAdd[i].posicion == pos) {                                    
                    $localStorage.addTire.splice(i, 1);
                }
            } 
            $scope.data.addTire = $localStorage.addTire;
            $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;
            $ionicScrollDelegate.scrollTop();
        }

        $scope.insertTire = function(tirebrand, size, design, tireType, price, dot, tag, truckPos, wear, pressure, tagInstalado, semaphore){
            console.log(tirebrand + " " + size + " " + design+ " " + tireType+ " " +price+ " " + dot+ " " + tag+ " " + truckPos+ " " + wear+ " " + pressure+ " " + tagInstalado+ " " + semaphore)
            var nullValues = 0;
            var otherDetected = false;
            if ($scope.isValid(tagInstalado)) {
                tagInstalado = 'NO'
            } else {
                tagInstalado = 'SI'
            }
            console.log("entonces tag instalado? " + tagInstalado)

            //IF NULL
            if($scope.isValid(tirebrand)){
                nullValues++;
            }
            if($scope.isValid(size)){
                nullValues++;
            }           
            if($scope.isValid(design)){
                nullValues++;
            }           
            if($scope.isValid(price)){
                $scope.data.price = 0;
                $scope.price = 0;
            }           
            if($scope.isValid(dot)){
                $scope.data.dot = 0;
                $scope.dot = 0;
            }          
            if($scope.isValid(tag)){
                nullValues++;
            }
            if($scope.isValid(truckPos)){
                nullValues++;
            }              
            if($scope.isValid(wear)){
                nullValues++;
            }else {
                $scope.data.wear = wear;                
            } 
            if($scope.isValid(pressure)){
                nullValues++;
            }else {
                $scope.data.pressure = pressure;                
            }                
            if($scope.isValid(semaphore)){
                nullValues++;
            }
            console.log("Marca: " + tirebrand)
            console.log("Medida: " + size)
            console.log("Diseño: " + design)
            console.log("Tipo de llanta:" + tireType)
            console.log("Precio: " + price) 
            console.log("DOT: " + dot)
            console.log("TAG Llanta: " + tag)                    
            console.log("Posicion: " + truckPos)
            console.log("Desgaste: " + wear)    
            console.log("Presión: " + pressure)
            console.log("Semaforo: " + semaphore)

            $scope.data.tagInstalado = tagInstalado;
            console.log("TAG instalado: " + $scope.data.tagInstalado)   

            console.log("lo guardad en Storage");
            var submitDataTruck = $localStorage.submitDataTruck;
            console.log("[company]: " + submitDataTruck.company)
            console.log("[fleet]: " + submitDataTruck.fleet)
            console.log("[truckId]: " + submitDataTruck.truckId)
            console.log("[kms] : " + submitDataTruck.kms)
            console.log("Se removera la posicion #" + truckPos) 

            if(nullValues == 0){
            
                console.log("procedemos a insertar llanta")
                var condFounds = "";
                angular.forEach($scope.selection.ids, function(value, key) {
                    if(key != "ninguna" || key != 'OTRA'){
                        condFounds = condFounds + key + ","
                    }
                    if(key == "OTRA") {
                        if(value){
                            console.log("OTRA: TRUE")
                            otherDetected = true;
                        }
                    }
                });
                console.log("entonces, las condiciones encontradas son: " + condFounds)
                
                if(otherDetected){
                    if($scope.data.others === undefined || $scope.data.others == ""){
                        console.log("NO LA ESCRIBIO")
                        var popTitle = $translate.instant('MSG_ERROR')
                            var aceptar = $translate.instant('MSG_ACEPTAR')
                            var msgError = $translate.instant('INSPECTION_WRITE_REMAINING')                
                            $ionicPopup.alert({
                                title: popTitle,
                                template: '<center><p><b>!Escriba la otra condición encontrada!</b></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                        });

                    } else {
                        condFounds =  condFounds + $scope.data.others 
                        /////////////////////////INSERTAR LLANTA
                        if ($localStorage.appModeStatus) {
                            console.log("modo Offline activado")
                            var tiresToAdd = $localStorage.addTire;
                            for (i = 0; i < tiresToAdd.length; i++) {                                
                                if (tiresToAdd[i].posicion == truckPos) {                                    
                                    $localStorage.addTire.splice(i, 1);
                                }
                            }    
                            $scope.data.addTire = $localStorage.addTire;
                            $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;                            
                            $ionicScrollDelegate.scrollTop();
                        } else {
                            console.log("modo online activado")

                            //Procedemos a insertar llantas
                            var loading = $translate.instant('MSG_LOADING');
                            var DataPromise = Data.insertTire($rootScope.url, $localStorage.languague, submitDataTruck.company, submitDataTruck.fleet, submitDataTruck.truckId, tirebrand, size, design, price, dot, tag, truckPos, semaphore, wear, submitDataTruck.kms, pressure, tagInstalado, condFounds, $localStorage.inspectionId);
                            DataPromise.then(function(result) {
                                console.log("entonces despues de subir las condiciones son? " + condFounds)
                                console.log(result['result'])
                                $scope.selection = {
                                    ids: {
                                        "ninguna": false
                                    }
                                };
                                $scope.data.others = "";
                                if(result['result'] == "OK"){
                                    $scope.showSuccessMessage($translate.instant("INSPECTION_TIRE_SAVED_SUCCESSFULLY"));
                                } else if(result['result'] == "TIRE EXIST"){
                                    $scope.showErrorMessage($translate.instant('TIRES_TIRE_EXIST'));
                                }   else if(result['result'] == "error"){
                                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + " "+ $translate.instant('MSG_TRY_AGAIN'));
                                    console.log("hay errores :/")
                                    console.log(result['result'])
                                }                        
                            }, function(reason) {
                                $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + " "+ $translate.instant('MSG_TRY_AGAIN'));
                            })


                            var tiresToAdd = $localStorage.addTire;
                            for (i = 0; i < tiresToAdd.length; i++) {                                
                                if (tiresToAdd[i].posicion == truckPos) {                                    
                                    $localStorage.addTire.splice(i, 1);
                                }
                            }    
                            $scope.data.addTire = $localStorage.addTire;
                            $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;  
                            $ionicScrollDelegate.scrollTop();  
                        }                          
                        /////////////////////////INSERTAR LLANTA                                                
                    }                    
                } else {
                    /////////////////////////INSERTAR LLANTA
                    if ($localStorage.appModeStatus) {
                        console.log("modo Offline activado")
                        var tiresToAdd = $localStorage.addTire;
                        for (i = 0; i < tiresToAdd.length; i++) {                                
                            if (tiresToAdd[i].posicion == truckPos) {                                    
                                $localStorage.addTire.splice(i, 1);
                            }
                        }    

                        console.log("[company]: " + submitDataTruck.company)
                        console.log("[fleet]: " + submitDataTruck.fleet)
                        console.log("[truckId]: " + submitDataTruck.truckId)
                        console.log("[kms] : " + submitDataTruck.kms)

                        var tireAdd = {
                            id: tag,
                            camionId: submitDataTruck.truckId,
                            customerId: submitDataTruck.company,
                            desgaste: wear,
                            flotaId: submitDataTruck.fleet ,
                            kilometraje: submitDataTruck.kms,
                            position: truckPos,
                            pr: pressure,
                            price: price,
                            registerDate: null,
                            semaforo: semaphore,
                            tagId: tag,
                            tagInstalado: tagInstalado,
                            tireBrand: tirebrand,
                            tireModel: design,
                            tireSize: size,
                            tireType: tireType,
                            year: dot
                        }

                        StorageService.addTire(tireAdd);
                        $scope.data.addTire = $localStorage.addTire;
                        $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;  
                        $ionicScrollDelegate.scrollTop();

                    } else {
                        console.log("modo online activado")

                        //Procedemos a insertar llantas
                        var loading = $translate.instant('MSG_LOADING');
                        var DataPromise = Data.insertTire($rootScope.url, $localStorage.languague, submitDataTruck.company, submitDataTruck.fleet, submitDataTruck.truckId, tirebrand, tireType, size, design, price, dot, tag, truckPos, semaphore, wear, submitDataTruck.kms, pressure, tagInstalado, condFounds, $localStorage.inspectionId);
                        DataPromise.then(function(result) {

                            console.log(result['result'])
                            $scope.data.others = "";
                            $scope.selection = {
                                ids: {
                                    "ninguna": false
                                }
                            };
                            $scope.disableArea = true;
                            if(result['result'] == "OK"){
                                $scope.showSuccessMessage($translate.instant("INSPECTION_TIRE_SAVED_SUCCESSFULLY"));
                            } else if(result['result'] == "TIRE EXIST"){
                                $scope.showErrorMessage($translate.instant('TIRES_TIRE_EXIST'));
                            }   else if(result['result'] == "error"){
                                $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + " "+ $translate.instant('MSG_TRY_AGAIN'));
                                console.log("hay errores :/")
                                console.log(result['result'])
                            }                        
                        }, function(reason) {
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + " "+ $translate.instant('MSG_TRY_AGAIN'));
                        })


                        var tiresToAdd = $localStorage.addTire;
                        for (i = 0; i < tiresToAdd.length; i++) {                                
                            if (tiresToAdd[i].posicion == truckPos) {                                    
                                $localStorage.addTire.splice(i, 1);
                            }
                        }    
                        $scope.data.addTire = $localStorage.addTire;
                        $scope.totalLlantasInspeccionar = Object.keys($localStorage.addTire).length;  
                        $ionicScrollDelegate.scrollTop();  
                    }                    
                    /////////////////////////INSERTAR LLANTA
                }           
            } else {
                $scope.showErrorMessage(nullValues + " "+ $translate.instant("MSG_FIELDS_ARE_MISSING"))
            }            
        }     
        $scope.selectCliente = function(company) {
            if(company != "0"){            
                console.log("entro a cambiar cliente")
                $localStorage.trucks = ''
                $localStorage.fleets = ''
                $localStorage.tires = ''

                $localStorage.company = company;
                var error = $translate.instant('MSG_ERROR');

                angular.forEach($localStorage.customers, function(value, key) {
                    if (company == value.id) {
                        $localStorage.companyName = value.nameCompany;
                        $scope.nameCompany = value.nameCompany;
                        $localStorage.customerEmail = value.email;
                    }
                });
                var aceptar = $translate.instant('MSG_ACEPTAR');
                var loading = $translate.instant('MSG_LOADING');

                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                    content: loading,
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var DataPromise = Data.allTrucksTiresByFleet($rootScope.url, company)
                DataPromise.then(function(result) {
                    if (result) {
                        console.log("tipo: " + $localStorage.usertype)
                        if($localStorage.usertype == 'auditor'){
                            angular.extend($scope.customers, result['clientes']);
                        }                        
                        $localStorage.trucks = result['trucks'];
                        $localStorage.fleets = result['fleets'];
                        $localStorage.tires = result['tires'];
                        $localStorage.truckBrands = result['truckBrands'];
                        $localStorage.truckModels = result['truckModels'];
                        $localStorage.truckTypes = result['truckTypes'];
                        $localStorage.pressureTypes = result['pressureTypes'];
                        $scope.flotas = $localStorage.fleets;
                        $scope.totalReceive = 0;
                        
                        var countTrucks;

                        if ($localStorage.trucks !== undefined) {
                            countTrucks = $localStorage.trucks;
                            var totalTrucks = Object.keys(countTrucks).length;
                            $localStorage.totalTrucks = totalTrucks;
                            $scope.totalReceive += totalTrucks;
                        }
                        $scope.totalTrucks = $localStorage.totalTrucks;

                        var countFleets
                        if ($localStorage.fleets !== undefined) {
                            countFleets = $localStorage.fleets;
                            var totalFleets = Object.keys(countFleets).length;
                            $localStorage.totalFleets = totalFleets;
                            $scope.totalFleets = totalFleets;
                            $scope.totalReceive += totalFleets;
                        }

                        var countTires
                        if ($localStorage.tires !== undefined) {
                            countTires = $localStorage.tires;
                            var totalTires = Object.keys(countTires).length;
                            $localStorage.totalTires = totalTires;
                            $scope.totalTires = totalTires;
                            $scope.totalReceive += totalTires;
                        }

                        var countTruckBrands;
                        if ($localStorage.truckBrands !== undefined) {
                            countTruckBrands = $localStorage.truckBrands;
                            var totalTruckBrands = Object.keys(countTruckBrands).length;
                            $localStorage.totalTruckBrands = totalTruckBrands;
                            $scope.totalTruckBrands = totalTruckBrands;
                        }

                        var countTruckModels
                        if ($localStorage.truckModels !== undefined) {
                            countTruckModels = $localStorage.truckModels;
                            var totalTruckModels = Object.keys(countTruckModels).length;
                            $localStorage.totalModels = totalTruckModels;
                            $scope.totalTruckModels = totalTruckModels;
                        }

                        var countTruckTypes
                        if ($localStorage.truckTypes !== undefined) {
                            countTruckTypes = $localStorage.truckTypes;
                            var totalTruckTypes = Object.keys(countTruckTypes).length;
                            $localStorage.totalTruckTypes = totalTruckTypes;
                            $scope.totalTruckTypes = totalTruckTypes;
                        }

                        var countPressureTypes
                        if ($localStorage.pressureTypes !== undefined) {
                            countPressureTypes = $localStorage.pressureTypes;
                            var totalPressureTypes = Object.keys(countPressureTypes).length;
                            $localStorage.totalPressureTypes = totalPressureTypes;
                            $scope.totalPressureTypes = totalPressureTypes;
                        }


                        $ionicLoading.hide();
                        $scope.changeCompany = false;
                        $state.go('app.dashboard', {
                            animation: 'slide-in-down'
                        });

                    } else {
                        $ionicLoading.hide();
                        var msgError = $translate.instant('DASHBOARD_ERROR_DOWNLOADING_DATA');
                        $ionicPopup.alert({
                            title: error,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    }

                }, function(reason) {
                    $ionicLoading.hide();
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
                $scope.$broadcast('scroll.refreshComplete');
            }
        }
        $scope.startInsertTires = function(){
            $localStorage.submitDataTruck = {"company":$scope.data.company,"fleet":$scope.data.fleet,"truckId":$scope.data.truckId,"kms":$scope.data.kms};
            console.log("datos del camión a subir: ")
            console.log($localStorage.submitDataTruck)
            if ($scope.data.kms === undefined || $scope.data.kms == '') {
                $scope.showErrorMessage($translate.instant('TIRES_KM_DIFERENT_ZERO'))
            } else {                
                if($scope.data.kms <= 0){
                    $scope.showErrorMessage($translate.instant('TIRES_KM_DIFERENT_ZERO'))
                } else {
                    var truck = $scope.data.truckInspectionated;

                    if ($localStorage.appModeStatus) {                        
                        var storageSemaphoreInspection = {
                                userId: $localStorage.userId, 
                                tag:truck.tag,
                                marca:"", 
                                modelo:"", 
                                unidad:truck.unidad,
                                kilometros:$scope.data.kms, 
                                placas:truck.placas, 
                                tagInstalado:truck.tagInstalado, 
                                kmZero:"", 
                                tipoInspeccion:"Manual"
                            }
                            StorageService.addSemaphoreInspection(storageSemaphoreInspection);
                            $ionicScrollDelegate.scrollTop();
                        //Si está en modo offline y se insertó entonces
                        $scope.generateTires()
                    } else {
                        //INICIA INSPECCION ONLINE
                        var DataPromise = Data.insertTruckHistorial($rootScope.url, $localStorage.userId, truck.tag, "", "", truck. unidad, $scope.data.kms, truck.placas, truck.tagInstalado, "", "Manual")
                        DataPromise.then(function(result) {
                            if (result['message'] == 'success') {
                                //DATOS CARGADOS                                                                                                
                                $localStorage.inspectionId = result['historyId'];
                                //Si está en modo online y se insertó entonces
                                $scope.generateTires()
                                $ionicScrollDelegate.scrollTop();
                            } else if (result['message'] == "Can't insert truck history") {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_INSERT_THISTORY'))
                            } else if (result['message'] == "Can't update truck information") {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_UPDATE_INFORMATION'))
                            } else if (result['message'] == "Truck tag not exists") {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $scope.showErrorMessage($translate.instant('INSPECTION_TRUCK_TAG_NOT_EXIST'))
                            } else {
                                //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)                            
                            }

                        }, function(reason) {
                            //ERROR DE CONEXIÓN
                                var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)   
                        })                        
                    }                                    
                }
            }
        }



        $scope.openModal = function(index) {
            console.log("Entramos al modal!")
            if (index == 1) {
                $scope.idAccount = $localStorage.companyIdAccount;
                $scope.oModal1.show();
            }
            if (index == 2) $scope.oModal2.show();
            if (index == 3) {
                $scope.brandId = $scope.tirebrand;
                $scope.tireBrands = $localStorage.tireBrands;
                $scope.oModal3.show();
            }
            if (index == 4) $scope.oModal4.show();
            if (index == 5) $scope.oModal5.show();        
        };
        
        $scope.closeModal = function(index) {
            if (index == 1) $scope.oModal1.hide();
            if (index == 2) $scope.oModal2.hide();      
            if (index == 3) $scope.oModal3.hide();
            if (index == 4) $scope.oModal4.hide();
            if (index == 5) $scope.oModal5.hide();
        };

        $ionicModal.fromTemplateUrl('templates/detallesAllTires.html', {
            id: '1', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal1 = modal;
        });

        
        $ionicModal.fromTemplateUrl('templates/addTireBrand.html', {
            id: '2', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal2 = modal;
        });

         // Modal 2
        $ionicModal.fromTemplateUrl('templates/addTireSize.html', {
            id: '3', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal3 = modal;
        });

        $ionicModal.fromTemplateUrl('templates/addTireDesign.html', {
            id: '4', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal4 = modal;
        });

        $ionicModal.fromTemplateUrl('templates/detallesDepth.html', {
            id: '5', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal5 = modal;
        });


        $scope.addTireBrand = function(tireBrand){
            var addTireBrand = tireBrand
            console.log(addTireBrand);
            if ($localStorage.appModeStatus) {
                console.log("modo Offline activado")
                var tireBrand = {
                    id: tireBrand,    
                    nombre: tireBrand
                }
                StorageService.addTireBrand(tireBrand);  
                console.log($localStorage.tireBrand);
                $scope.data.tireBrand.push(tireBrand);
                //$localStorage.tireBrand.push(tireBrand);  ;                          
                $scope.closeModal(2);
            } else {
                console.log("modo online activado")
                 //ONLINE
                            var DataPromise = Data.addTireBrand($rootScope.url, $localStorage.languague, tireBrand)
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS                                                                                                
                                    console.log("Datos cargados con exito")
                                    if(result['result']){
                                    console.log("entró a actualizar la lista de Tire Brands");
                                        $localStorage.tireBrands = result['result'];
                                        $scope.data.tireBrands = $localStorage.tireBrands;
                                        $scope.tirebrand = result['id'];
                                    }
                                    $scope.closeModal(1);
                                    //Si está en modo online y se insertó entonces                                
                                    $ionicScrollDelegate.scrollTop();
                                } else if (result['message'] == "error") {
                                    //DATOS CON ERRORES O INCOMPLETOS
                                    $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_INSERT_THISTORY'))                            
                                } else {
                                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)                            
                                }

                            }, function(reason) {
                                //ERROR DE CONEXIÓN
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)   
                            }) 
            }
        }

        $scope.recallToInspection = function() {
            $state.go('app.dashboard', {
                animation: 'slide-in-down'
            });            
        }

        $scope.addTireSize = function(brandId, tireSize){
            console.log(brandId)
            console.log(tireSize)
             var addBrandId = brandId;
             var addTireSize = tireSize;
             if ($localStorage.appModeStatus) {
                console.log("modo Offline activado")
                if ($localStorage.appModeStatus) {                
                     console.log("modo Offline activado")
                    var tireSize = {
                    id: tireSize,    
                    marca: brandId,
                    medida: tireSize
                }
                StorageService.addTireSize(tireSize);  
                $scope.data.tireSizes.push(tireSize);
                //$localStorage.tireSizes.push(tireSize);                          
                $scope.closeModal(3);
                
            } else {
                console.log("modo online activado")
                 //ONLINE
                            var DataPromise = Data.addTireSize($rootScope.url, $localStorage.languague, brandId, tireSize)
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS                                                                                                
                                    console.log("Datos cargados con exito")
                                    if(result['result']){
                                    console.log("entró a actualizar la lista de Tire Brands");
                                        $localStorage.tireSizes = result['result'];                                        
                                        $scope.data.tireSizes = $localStorage.tireSizes;
                                        $scope.size = result['id'];
                                    }
                                    $scope.closeModal(2);
                                    //Si está en modo online y se insertó entonces                                
                                } else if (result['message'] == "error") {
                                    //DATOS CON ERRORES O INCOMPLETOS
                                    $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_INSERT_THISTORY'))                            
                                } else {
                                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)                            
                                }

                            }, function(reason) {
                                //ERROR DE CONEXIÓN
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)   
                            }) 
            }

        }
    }
    
 //Es Diseño
        $scope.addTireModel = function(tireSizeId, tireModel, tireModelDepth, typeSelect, tireModelKm, tireModelInitRem, tireModelMinRem){
            console.log(tireSizeId)
            console.log(tireModel)
            console.log(tireModelDepth)
            console.log(typeSelect)
            console.log(tireModelKm)
            console.log(tireModelInitRem)
            console.log(tireModelMinRem)
            
            
             if ($localStorage.appModeStatus) {
              
                var tireModel = {
                    id: tireModel,    
                    kilometraje: tireModelKm,
                    medida: tireSizeId,
                    nombre: tireModel,
                    profundidad: tireModelDepth,
                    remanenteInicial: tireModelInitRem,
                    remaneneteMinimo: tireModelMinRem,
                    tipo: typeSelect,
                }
                StorageService.addTireModel(tireModel);  
                $scope.tireModels.push(tireModel);
                $localStorage.tireModels.push(tireModel);                          
                $scope.closeModal(4);   

            } else {
                console.log("modo online activado")
                 //ONLINE
                var DataPromise = Data.addTireModel($rootScope.url, $localStorage.languague, tireSizeId, tireModel, tireModelDepth, typeSelect, tireModelKm, tireModelInitRem, tireModelMinRem)
                DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS                                                                                                
                                    console.log("Datos cargados con exito")
                                    if(result['result']){
                                    console.log("entró a actualizar la lista de Tire Models/Design");
                                        $localStorage.tireModels = result['result'];                                        
                                        $scope.data.tireModels = $localStorage.tireModels;
                                        $scope.design = result['id'];
                                    }
                                    $scope.closeModal(3);
                                    //Si está en modo online y se insertó entonces                                
                                    $ionicScrollDelegate.scrollTop();
                                } else if (result['message'] == "error") {
                                    //DATOS CON ERRORES O INCOMPLETOS
                                    $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_INSERT_THISTORY'))                            
                                } else {
                                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)                            
                                }

                            }, function(reason) {
                                //ERROR DE CONEXIÓN
                                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                    $scope.showErrorMessage(errorConexion + '<br/><b>' + tryAgain)   
                            }) 
                           
            }

        }
       
        $scope.recallToInspection = function() {
             $state.go('app.dashboard', {
                animation: 'slide-in-down'
            });     
        }

})
