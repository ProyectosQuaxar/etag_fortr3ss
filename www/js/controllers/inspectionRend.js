angular.module('inspectionRend', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
.controller('InspectionRendCtrl', function($ionicPlatform, ionicMaterialInk, ionicMaterialMotion, $timeout, $stateParams, $scope, $localStorage, $translate, $ionicLoading, Data, $ionicPopup, $rootScope, $ionicModal, $ionicHistory, $state, StorageService, $ionicScrollDelegate, Check) {
	$ionicPlatform.offHardwareBackButton(function() {
      console.log("Hola"); 
    });
    $ionicPlatform.registerBackButtonAction(function(event) {
    }, 100);

    $scope.selection = {
        ids: {
            "ninguna": false
        }
    };
	$scope.camionExiste = false;
    $scope.camionEncontrado = true;
    $scope.data.tagId = 0;
    $scope.activatedNFC = false;
    $scope.data.images = {}
    $scope.devices = {}
    $scope.data.showDevs = '';
    $scope.data.deviceConected = ''; 
    $scope.data.deviceName = '';
    $scope.showDevs = false;
    $scope.disableArea = true;
    
    $ionicPlatform.offHardwareBackButton(function() {
      console.log("Hola"); 
    });
    $ionicPlatform.registerBackButtonAction(function(event) {
    }, 100);


    $scope.stateChanged = function(){
        angular.forEach($scope.selection.ids, function(value, key) {                
            if(key == "OTRA"){
                if (value) {
                    console.log("Activada") 
                    $scope.disableArea = false;                                                                                      
                } else {
                    console.log("Desactivada")                
                    $scope.disableArea = true;
                    $scope.data.others = "";                                                                                                 
                } 
            }
        });                    
    }

	$scope.init = function() {
        $scope.data.kilometraje = "";
        $scope.inspectionMode = $localStorage.inspectionMode;
        $scope.trucks = $localStorage.trucks;

        if ($scope.inspectionMode === undefined) {
            $localStorage.inspectionMode = 'Manual';               
        }

        if ($scope.inspectionMode == 'Manual') {
            console.log("inspección manual detectada")
        }

        if ($scope.inspectionMode == 'Translogik') {            	
           	console.log("inspección translogik detectada")
        }
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.recallToInspection = function() {
        $state.go('app.dashboard', {
            animation: 'slide-in-down'
        });            
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

    $scope.findTruck = function(tagCamion) {    	
            $scope.tagCamion = tagCamion;
            if ($scope.tagCamion !== undefined) {
                if ($localStorage.appModeStatus) {
                    //si el modo offline está activado
                    var trucks = $localStorage.trucks;
                    var truckExist = false;
                    var idtruck = ""
                    angular.forEach(trucks, function(value, key) {
                        if (tagCamion == value.tag) {
                            truckExist = true;
                            idtruck = value.id;
                        }
                    });
                    console.log("camionExiste? " + truckExist)
                    if (truckExist) {
                        //BUSCAMOS EN LOCALSTORAGE y enviamos los valores recibidos
                        $scope.camionExiste = true;
                        $scope.trucks = $localStorage.trucks;
                        $scope.tires = $localStorage.tires;
                        $scope.truckTypes = $localStorage.truckTypes;
                        $scope.pressureTypes = $localStorage.pressureTypes;
                        $scope.imageURL = "";
                        var tireNumber = 0;

                        angular.forEach($localStorage.tires, function(value, key) {                                                     
                            if(value.camionId == idtruck){
                                tireNumber = tireNumber + 1;
                            }
                        });
                        $scope.data.tiresRegistred = tireNumber;
                    } else {
                        var msgError = $translate.instant('DASHBOARD_CAMION') + ': <strong>' + tagCamion + '</strong> ' + $translate.instant('MSG_NOTAVAILABLE') + ' ' + $translate.instant('MSG_INTHIS') + ' ' + $translate.instant('DASHBOARD_CLIENTE_LABEL')
                        var popTitle = $translate.instant('MENU_MODO_OFFLINE_ACTIVE')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</p></center>',
                            okText: aceptar,
                            okType: 'button-positive'
                        });
                    }
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

                    var DataPromise = Data.getTruckData($rootScope.url, tagCamion)
                    DataPromise.then(function(result) {
                            if (result['message'] == 'found') {
                                //DATOS CARGADOS
                                $ionicLoading.hide();
                                $scope.camionExiste = true;
                                $scope.trucks = result['truck'];
                                $scope.tires = result['tires'];
                                $scope.historialInspections = result['historialInspections'];
                                $localStorage.inspectionTrucks = result['truck'];
                                $localStorage.inspectionTires = result['tires'];
                                $scope.truckTypes = $localStorage.truckTypes;
                                $scope.pressureTypes = $localStorage.pressureTypes;
                                $scope.tagCamion = tagCamion;
                                $scope.userId = $localStorage.userId;
                                $scope.showHistorialInspecciones = false;

                                var countTiresRegistred = 0;
                                if ($localStorage.inspectionTires !== undefined) {

                                    countTiresRegistred = $localStorage.inspectionTires;

                                    var tiresRegistred = Object.keys(countTiresRegistred).length;

                                    $scope.tiresRegistred = tiresRegistred;
                                } else {
                                    $scope.tiresRegistred = 0;
                                }

                            } else if (result['message'] == 'not found') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();

                                var error = $translate.instant('MSG_ERROR');
                                var aceptar = $translate.instant('MSG_ACEPTAR');
                                var notFound = $translate.instant('DASHBOARD_CAMION') + " <strong>" + tagCamion + "</strong> " + $translate.instant('MSG_NOT_FOUND')
                                $ionicPopup.alert({
                                    title: error,
                                    template: '<center>' + notFound + '</center>',
                                    okText: aceptar,
                                    okType: 'button-assertive'
                                });

                            } else {
                                //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                $ionicLoading.hide();
                                var error = $translate.instant('MSG_ERROR');
                                var aceptar = $translate.instant('MSG_ACEPTAR');
                                var errorOcurred = $translate.instant('MSG_ERROR_OCURRED');
                                var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                                $ionicPopup.alert({
                                    title: error,
                                    template: '<center><p>' + errorOcurred + '<br/><b>' + tryAgain + '</b></p></center>',
                                    okText: aceptar,
                                    okType: 'button-assertive'
                                });
                            }

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
                        .finally(function() {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                }
            } else {
                var msgError = $translate.instant('MSG_ERROR_TAGEMPTY')
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + msgError + '</p></center>',
                    okText: aceptar,
                    okType: 'button-positive'
                });
            }
    }
    $scope.startInspectionRend = function(userId, tag, marca, modelo, unidad, placas, tagInstalado) {
            $scope.disableArea = true;
            $scope.selection = {
                ids: {
                    "ninguna": false
                }
            };            
            
            var _userId = userId;
            if(_userId === undefined || _userId == ""){
                _userId = $localStorage.userId;
            } 

            var loading = $translate.instant('MSG_LOADING');
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                content: loading,
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });


            if ($scope.data.kmZero === undefined) {
                $scope.data.kmZero = ""
            }
            if ($scope.data.kilometraje === undefined) {
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                var msgError = $translate.instant('INSPECTION_WRITE_KILOMETRAGE')
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + msgError + '</b></p></center>',
                    okText: aceptar,
                    okType: 'button-assertive'
                });
                $ionicLoading.hide();
            } else {
                var loading = $translate.instant('MSG_LOADING');
                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                    content: loading,
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                if ($localStorage.appModeStatus) {
                    //si el modo offline está activado
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tag){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                        }
                    });

                    var storageRendInspection = {
                        idtruck: idtruck,
                        userId: _userId, 
                        tag:tag,
                        marca:marca, 
                        modelo:modelo, 
                        unidad:unidad, 
                        placas:placas, 
                        tagInstalado:tagInstalado, 
                        kmZero:$scope.data.kmZero, 
                        tipoInspeccion:$localStorage.inspectionMode
                    }

                    StorageService.addRendInspection(storageRendInspection);                    

                    $localStorage.inspectionTires = []

                    angular.forEach($localStorage.tires, function(value, key) {                                                     
                        if(value.camionId == idtruck){
                            console.log(value.camionId + " == " + idtruck)
                            var tire = {
                                id:value.id,
                                camionId:value.camionId,
                                customerId:value.customerId,
                                desgaste:value.desgaste,
                                flotaId:value.flotaId,
                                kilometraje:value.kilometraje,
                                position:value.position,
                                pr:value.pr,
                                price:value.price,
                                registerDate:value.registerDate,
                                semaforo:value.semaforo,
                                tagId:value.tagId,
                                tagInstalado:value.tagInstalado,
                                tireBrand:value.tireBrand,
                                tireModel:value.tireModel,
                                tireSize:value.tireSize,
                                year:value.year                                                                                                
                            }
                            $localStorage.inspectionTires.push(tire)
                        }
                    }); 
                    if ($scope.inspectionMode == 'Manual') {
                    	console.log("Redireccionando a rManual")
            			$state.go('app.rManual');
        			}
        			if ($scope.inspectionMode == 'Translogik') {            	
           				console.log("Redireccionando a rTranslogik")
            			$state.go('app.rTranslogik');
        			}                    
                    $scope.data.inspectionTires = $localStorage.inspectionTires;
                    $scope.data.tireConditions = $localStorage.tireConditions;
                    $scope.data.tireModels = $localStorage.tireModels;
                    $scope.data.tireSizes = $localStorage.tireSizes;
                    $scope.data.tireBrands = $localStorage.tireBrands;
                    $scope.data.historyId = $localStorage.inspectionId;
                    $scope.data.truckTag = tag;

                    $ionicLoading.hide();                        
                } else {
                    //INICIA INSPECCION ONLINE
                    
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, $localStorage.inspectionMode)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();
                            $ionicHistory.clearCache().then(function() {
                                if ($scope.inspectionMode == 'Manual') {
			                    	console.log("Redireccionando a rManual")
			            			$state.go('app.rManual');
			        			}
			        			if ($scope.inspectionMode == 'Translogik') {            	
			           				console.log("Redireccionando a rTranslogik")
			            			$state.go('app.rTranslogik');
			        			}   
                                $scope.data.activatedNFC = $localStorage.activatedNFC;
                                $scope.data.inspectionTrucks = $localStorage.inspectionTrucks;
                                $scope.data.inspectionTires = $localStorage.inspectionTires;
                                $scope.data.tireConditions = $localStorage.tireConditions;
                                $scope.data.tireModels = $localStorage.tireModels;
                                $scope.data.tireSizes = $localStorage.tireSizes;
                                $scope.data.tireBrands = $localStorage.tireBrands;
                                $localStorage.inspectionId = result['historyId'];
                                $scope.data.historyId = $localStorage.inspectionId;
                                $scope.data.truckTag = tag;
                                $scope.data.tagDetected = 'NO';
                                $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;
                                console.log($scope.data.inspectionTrucks[0].tipo)
                                $scope.URL = $scope.data.inspectionTrucks[0].tipo;
                                angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                    if(value.id == $scope.data.inspectionTrucks[0].tipo){
                                        console.log (value.img)
                                        $scope.data.imageURL = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                        console.log($scope.data.imageURL)                                    
                                    }
                                }); 
                            });







                        } else if (result['message'] == "Can't insert truck history") {
                            //DATOS CON ERRORES O INCOMPLETOS
                            $ionicLoading.hide();

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgError = $translate.instant('INSPECTION_CANNOT_INSERT_THISTORY');
                            $ionicPopup.alert({
                                title: error,
                                template: "<center><b>" + msgError + "</b></center>",
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else if (result['message'] == "Can't update truck information") {
                            //DATOS CON ERRORES O INCOMPLETOS
                            $ionicLoading.hide();

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgError = $translate.instant('INSPECTION_CANNOT_UPDATE_INFORMATION');
                            $ionicPopup.alert({
                                title: error,
                                template: "<center><b>" + msgError + "</b></center>",
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else if (result['message'] == "Truck tag not exists") {
                            //DATOS CON ERRORES O INCOMPLETOS
                            $ionicLoading.hide();

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgError = $translate.instant('INSPECTION_TRUCK_TAG_NOT_EXIST');
                            $ionicPopup.alert({
                                title: error,
                                template: "<center><b>" + msgError + "</b></center>",
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $ionicLoading.hide();
                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var errorOcurred = $translate.instant('MSG_ERROR_OCURRED');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                            $ionicPopup.alert({
                                title: error,
                                template: '<center><p>' + errorOcurred + '<br/><b>' + tryAgain + '</b></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });
                        }

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
                    //FINALIZA INSPECCIÓN ONLINE
                }
            }
    }
    $scope.getTag = function(tag){
        var storageTag = $localStorage.tag;            
        if(storageTag !== undefined){
            if(storageTag == tag){                
            $scope.data.tagDetected = 'SI'
            } else {
                var msgError = "TAG: " + tag + " es distinto a: "+storageTag + "\nÚltimo TAG Leído.";
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + msgError + '</p></center>',
                    okText: aceptar,
                    okType: 'button-positive'
                });                    
                $scope.data.tagDetected = 'NO'
            }
        } else {
                var msgError = "Ningun TAG almacenado todavía";
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + msgError + '</p></center>',
                    okText: aceptar,
                    okType: 'button-positive'
                });
        }
    }
    $scope.getPresure = function(intentos){               
        $timeout(function() {
            if(intentos < 50)
            {
                bluetoothSerial.read(function (data) {
                    $scope.setPressureValue(data)
                },
                    $scope.getPresure(intentos+1)
                )
            }
        }, 500);
    }
    $scope.setPressureValue = function(value){
        $scope.data.psi = parseFloat(value.substring(1, value.length - 1));
    }
    $scope.getRemainingsPos1 = function(intentos, position){
            console.log("intento: #" + intentos + " lectura #" + position)
            var pos = position;

            $timeout(function() {
                if(intentos < 50)
                {
                    bluetoothSerial.read(function (data) {
                        console.log("Remanente: "+data)
                        pos = pos + $scope.setRemaining1(data,pos)
                        $scope.getRemainingsPos1(intentos+1,pos);
                    },
                        function(){
                            //programar error
                        console.log("error");
                        
                        }

                    )                    
                }
            }, 500);                        
    }
    $scope.getRemainingsPos2 = function(intentos, position){
            console.log("intento: #" + intentos + " lectura #" + position)
            var pos = position;

            $timeout(function() {
                if(intentos < 50)
                {
                    bluetoothSerial.read(function (data) {
                        console.log("Remanente: "+data)
                        pos = pos + $scope.setRemaining2(data,pos)
                        $scope.getRemainingsPos2(intentos+1,pos);
                    },
                        function(){
                            //programar error
                        console.log("error");
                        
                        }

                    )                    
                }
            }, 500);                        
    }
    $scope.getRemainingsPos3 = function(intentos, position){
            console.log("intento: #" + intentos + " lectura #" + position)
            var pos = position;

            $timeout(function() {
                if(intentos < 50)
                {
                    bluetoothSerial.read(function (data) {
                        console.log("Remanente: "+data)
                        pos = pos + $scope.setRemaining3(data,pos)
                        $scope.getRemainingsPos3(intentos+1,pos);
                    },
                        function(){
                            //programar error
                        console.log("error");                        
                        }

                    )                    
                }
            }, 500);                        
    }
    $scope.setRemaining1 = function(data,position){
        if(data.charAt(0) == "T"){                
            // Milimetraje / Remanente
            var milimetraje = parseFloat(data.substring(1, data.length - 1));
            if(position == 1){
                $scope.data.pos1_rem1 = milimetraje   
            } else if(position == 2){
                $scope.data.pos1_rem2 = milimetraje   
            } else if(position == 3){
                $scope.data.pos1_rem3 = milimetraje   
            } else if(position == 4){
                $scope.data.pos1_rem4 = milimetraje   
            }
            return 1;
        } else {
            return 0;
        }        
    }
    $scope.setRemaining2 = function(data,position){
        if(data.charAt(0) == "T"){                
            // Milimetraje / Remanente
            var milimetraje = parseFloat(data.substring(1, data.length - 1));
            if(position == 1){
                $scope.data.pos2_rem1 = milimetraje   
            } else if(position == 2){
                $scope.data.pos2_rem2 = milimetraje   
            } else if(position == 3){
                $scope.data.pos2_rem3 = milimetraje   
            } else if(position == 4){
                $scope.data.pos2_rem4 = milimetraje   
            }
            return 1;
        } else {
            return 0;
        }        
    }
    $scope.setRemaining3 = function(data,position){
        if(data.charAt(0) == "T"){                
            // Milimetraje / Remanente
            var milimetraje = parseFloat(data.substring(1, data.length - 1));
            if(position == 1){
                $scope.data.pos3_rem1 = milimetraje   
            } else if(position == 2){
                $scope.data.pos3_rem2 = milimetraje   
            } else if(position == 3){
                $scope.data.pos3_rem3 = milimetraje   
            } else if(position == 4){
                $scope.data.pos3_rem4 = milimetraje   
            }
            return 1;
        } else {
            return 0;
        }        
    }
    $scope.clearTruck = function() {            
        $scope.camionExiste = false;
        $scope.trucks = $localStorage.trucks;
        $scope.data.tagCamion = undefined;
    }
    var setTagTruck = function($event) {
        console.log($event.target.value);
    };
    $scope.addTireInspection = function(tire) {
        console.log(tire)
        var condFounds = "";
        var otherDetected = false;
        angular.forEach($scope.selection.ids, function(value, key) {
        condFounds = condFounds + key + ","              
            if(key == "OTRA"){
                if (value) {
                    otherDetected = true;                                               
                }
            }
        });  

        if(condFounds != undefined){
            condFounds = condFounds.substring(0, condFounds.length - 1);
        } else {
            condFounds = ""
        }        

        if($scope.data.tagDetected === undefined) {
            $scope.data.tagDetected = 'NO'
        }        
        
        if(otherDetected){
             console.log("OTRA CONDICION encontrada")
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

            } else{                                    
               console.log("SI LA ESCRIBIO")
               condFounds = condFounds + "," + $scope.data.others;
                console.log("las condiciones encontradas son: "+condFounds)

                $scope.userId = $localStorage.userId;
                var loading = $translate.instant('MSG_LOADING');

                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                    content: loading,
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });                    
                if ($scope.data.psi === undefined) {
                    $ionicLoading.hide();

                    var popTitle = $translate.instant('MSG_ERROR')
                    var aceptar = $translate.instant('MSG_ACEPTAR')
                    var msgError = $translate.instant('INSPECTION_WRITE_PRESSURE')                
                    $ionicPopup.alert({
                        title: popTitle,
                        template: '<center><p><b>' + msgError + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                } else {
                    console.log("los datos de rendimiento son: ")
                    console.log(tire)
                    if ($localStorage.appModeStatus) {
                        //si el modo offline está activado
                        var commentsCheck = "";
                        commentsCheck = Check.isNull($scope.data.comments);
                        if (commentsCheck == "" ){
                            console.log("Comentarios vacios")
                            var tireInspection = {
                                idtruck         : tire.camionId,
                                userId          : $scope.userId, 
                                tagId           : tire.tagId, 
                                historyId       : $scope.data.historyId, 
                                tireBrand       : tire.tireBrand, 
                                tireSize        : tire.tireSize, 
                                tireModel       : tire.tireModel, 
                                position        : tire.position, 
                                tagInstalado    : tire.tagInstalado, 
                                kilometraje     : $scope.data.kilometraje, 
                                truckTag        : $scope.data.truckTag, 
                                pos1_rem1:$scope.data.pos1_rem1,
                                pos1_rem2:$scope.data.pos1_rem2,
                                pos1_rem3:$scope.data.pos1_rem3,
                                pos1_rem4:$scope.data.pos1_rem4,
                                pos2_rem1:$scope.data.pos2_rem1,
                                pos2_rem2:$scope.data.pos2_rem2,
                                pos2_rem3:$scope.data.pos2_rem3,
                                pos2_rem4:$scope.data.pos2_rem4,
                                pos3_rem1:$scope.data.pos3_rem1,
                                pos3_rem2:$scope.data.pos3_rem2,
                                pos3_rem3:$scope.data.pos3_rem3,
                                pos3_rem4:$scope.data.pos3_rem4,
                                psi             : $scope.data.psi, 
                                comments        : ' ', 
                                condFounds      : condFounds,
                                tagDetected     : $scope.data.tagDetected
                            }
                        }   else {
                            console.log("Existen comentarios")
                             var tireInspection = {
                                idtruck         : tire.camionId,
                                userId          : $scope.userId, 
                                tagId           : tire.tagId, 
                                historyId       : $scope.data.historyId, 
                                tireBrand       : tire.tireBrand, 
                                tireSize        : tire.tireSize, 
                                tireModel       : tire.tireModel, 
                                position        : tire.position, 
                                tagInstalado    : tire.tagInstalado, 
                                kilometraje     : $scope.data.kilometraje, 
                                truckTag        : $scope.data.truckTag, 
                                pos1_rem1:$scope.data.pos1_rem1,
                                pos1_rem2:$scope.data.pos1_rem2,
                                pos1_rem3:$scope.data.pos1_rem3,
                                pos1_rem4:$scope.data.pos1_rem4,
                                pos2_rem1:$scope.data.pos2_rem1,
                                pos2_rem2:$scope.data.pos2_rem2,
                                pos2_rem3:$scope.data.pos2_rem3,
                                pos2_rem4:$scope.data.pos2_rem4,
                                pos3_rem1:$scope.data.pos3_rem1,
                                pos3_rem2:$scope.data.pos3_rem2,
                                pos3_rem3:$scope.data.pos3_rem3,
                                pos3_rem4:$scope.data.pos3_rem4,
                                psi             : $scope.data.psi, 
                                comments        : $scope.data.comments, 
                                condFounds      : condFounds,
                                tagDetected     : $scope.data.tagDetected                        
                            }
                       
                        }

                        StorageService.addTireRendToInspection(tireInspection);

                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgOk = $translate.instant('INSPECTION_TIRE_SAVED_SUCCESSFULLY')
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            template: '<center><p><b>' +  msgOk + '</p></center>',
                            okText: aceptar,
                            okType: 'button-balanced'
                        });

                        var tiresToInspection = $localStorage.inspectionTires;
                        for (i = 0; i < tiresToInspection.length; i++) {                                
                            if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                $localStorage.inspectionTires.splice(i, 1);
                            }
                        }               

                        $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length; 
                        $scope.data.pos1_rem1 = ""; $scope.data.pos1_rem2 = ""; $scope.data.pos1_rem3 = ""; $scope.data.pos1_rem4 = ""; $scope.data.pos2_rem1 = ""; $scope.data.pos2_rem2 = ""; $scope.data.pos2_rem3 = ""; $scope.data.pos2_rem4 = ""; $scope.data.pos3_rem1 = ""; $scope.data.pos3_rem2 = ""; $scope.data.pos3_rem3 = ""; $scope.data.pos3_rem4 = "";
                        $scope.data.dr = "";
                        $scope.data.psi = "";
                        $scope.data.comments = "";
                        $scope.data.tagDetected = "NO";
                        $ionicScrollDelegate.scrollTop();
                        $scope.data.others = ""
                        $scope.disableArea = true;

                        $scope.selection = {
                            ids: {
                                "ninguna": false
                            }
                        };                                                        
                        $ionicLoading.hide();
                    } else {

                        //ONLINE START
                        var DataPromise = Data.insertTireHistorialRend($rootScope.url, $scope.userId, tire.tagId, $scope.data.historyId, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, $scope.data.kilometraje, $scope.data.truckTag, $scope.data.psi, $scope.data.comments, condFounds, $scope.data.tagDetected, $scope.data.pos1_rem1, $scope.data.pos1_rem2, $scope.data.pos1_rem3, $scope.data.pos1_rem4, $scope.data.pos2_rem1, $scope.data.pos2_rem2, $scope.data.pos2_rem3, $scope.data.pos2_rem4, $scope.data.pos3_rem1, $scope.data.pos3_rem2, $scope.data.pos3_rem3, $scope.data.pos3_rem4);                    
                        DataPromise.then(function(result) {
                            if (result['message'] == "success") {                            
                                var tiresToInspection = $localStorage.inspectionTires;
                                for (i = 0; i < tiresToInspection.length; i++) {                                
                                    if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                        $localStorage.inspectionTires.splice(i, 1);
                                    }
                                }
                                $ionicLoading.hide();
                                
                                var aceptar = $translate.instant('MSG_ACEPTAR')
                                var datosPos = $translate.instant('INSPECTION_TIRE_DATA')
                                var charged = $translate.instant('INSPECTION_HAS_BEEN_UPLOADED')
                                $ionicPopup.alert({
                                    template: '<center><p><b>¡ ' + datosPos + ' ' + tire.position + ' ' + charged + '!</b></p></center>',
                                    okText: aceptar,
                                    okType: 'button-positive'
                                });                            
                                $scope.data.inspectionTrucks = $localStorage.inspectionTrucks;
                                $scope.data.inspectionTires = $localStorage.inspectionTires;
                                $scope.data.tireConditions = $localStorage.tireConditions;
                                $scope.data.tireModels = $localStorage.tireModels;
                                $scope.data.tireSizes = $localStorage.tireSizes;
                                $scope.data.tireBrands = $localStorage.tireBrands;
                                $scope.data.historyId = $localStorage.inspectionId;
                                $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;

                                if($scope.data.tiresRegistred == 0){
                                    $localStorage.inspectionTrucks = "";
                                    $scope.data.inspectionMode = $localStorage.inspectionMode;
                                }                          
                                $scope.selection = {
                                    ids: {
                                        "ninguna": false
                                    }
                                };
                                $scope.data.dr = "";
                                $scope.data.psi = "";
                                $scope.data.comments = "";
                                $scope.data.tagDetected = "NO";
                                $scope.data.pos1_rem1 = "";
                                $scope.data.pos1_rem2 = "";
                                $scope.data.pos1_rem3 = "";
                                $scope.data.pos1_rem4 = "";
                                $scope.data.pos2_rem1 = "";
                                $scope.data.pos2_rem2 = "";
                                $scope.data.pos2_rem3 = "";
                                $scope.data.pos2_rem4 = "";
                                $scope.data.pos3_rem1 = "";
                                $scope.data.pos3_rem2 = "";
                                $scope.data.pos3_rem3 = "";
                                $scope.data.pos3_rem4 = "";
                                $ionicScrollDelegate.scrollTop();
                                $scope.data.others = ""
                            } else if (result['message' == "User invalid"]) {
                                $ionicLoading.hide();
                                var error = $translate.instant('MSG_ERROR');
                                var aceptar = $translate.instant('MSG_ACEPTAR');
                                var errorDesc = "User invalid" //$translate.instant('MSG_TRY_AGAIN');
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: error,
                                    template: '<center><p>' + errorDesc + '</p></center>',
                                    okText: aceptar,
                                    okType: 'button-assertive'
                                });
                            } else {
                                $ionicLoading.hide();
                            }
                            $scope.disableArea = true;
                        }, function(reason) {
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
                        //ONLINE END
                    }
                }
                                                                           
            } 
        } else {
                $scope.userId = $localStorage.userId;
                var loading = $translate.instant('MSG_LOADING');

                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                    content: loading,
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });                    


                if ($scope.data.psi === undefined) {
                    $ionicLoading.hide();

                    var popTitle = $translate.instant('MSG_ERROR')
                    var aceptar = $translate.instant('MSG_ACEPTAR')
                    var msgError = $translate.instant('INSPECTION_WRITE_PRESSURE')                
                    $ionicPopup.alert({
                        title: popTitle,
                        template: '<center><p><b>' + msgError + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                } else {
                    if ($localStorage.appModeStatus) {
                        //si el modo offline está activado

                        if (commentsCheck == "" ){
                            console.log("Comentarios vacios")
                            var tireInspection = {
                                idtruck         : tire.camionId,
                                userId          : $scope.userId, 
                                tagId           : tire.tagId, 
                                historyId       : $scope.data.historyId, 
                                tireBrand       : tire.tireBrand, 
                                tireSize        : tire.tireSize, 
                                tireModel       : tire.tireModel, 
                                position        : tire.position, 
                                tagInstalado    : tire.tagInstalado, 
                                kilometraje     : $scope.data.kilometraje, 
                                truckTag        : $scope.data.truckTag, 
                                pos1_rem1:$scope.data.pos1_rem1,
                                pos1_rem2:$scope.data.pos1_rem2,
                                pos1_rem3:$scope.data.pos1_rem3,
                                pos1_rem4:$scope.data.pos1_rem4,
                                pos2_rem1:$scope.data.pos2_rem1,
                                pos2_rem2:$scope.data.pos2_rem2,
                                pos2_rem3:$scope.data.pos2_rem3,
                                pos2_rem4:$scope.data.pos2_rem4,
                                pos3_rem1:$scope.data.pos3_rem1,
                                pos3_rem2:$scope.data.pos3_rem2,
                                pos3_rem3:$scope.data.pos3_rem3,
                                pos3_rem4:$scope.data.pos3_rem4,
                                psi             : $scope.data.psi, 
                                comments        : ' ', 
                                condFounds      : condFounds,
                                tagDetected     : $scope.data.tagDetected
                            }
                        }   else {
                            console.log("Existen comentarios")
                             var tireInspection = {
                                idtruck         : tire.camionId,
                                userId          : $scope.userId, 
                                tagId           : tire.tagId, 
                                historyId       : $scope.data.historyId, 
                                tireBrand       : tire.tireBrand, 
                                tireSize        : tire.tireSize, 
                                tireModel       : tire.tireModel, 
                                position        : tire.position, 
                                tagInstalado    : tire.tagInstalado, 
                                kilometraje     : $scope.data.kilometraje, 
                                truckTag        : $scope.data.truckTag, 
                                pos1_rem1:$scope.data.pos1_rem1,
                                pos1_rem2:$scope.data.pos1_rem2,
                                pos1_rem3:$scope.data.pos1_rem3,
                                pos1_rem4:$scope.data.pos1_rem4,
                                pos2_rem1:$scope.data.pos2_rem1,
                                pos2_rem2:$scope.data.pos2_rem2,
                                pos2_rem3:$scope.data.pos2_rem3,
                                pos2_rem4:$scope.data.pos2_rem4,
                                pos3_rem1:$scope.data.pos3_rem1,
                                pos3_rem2:$scope.data.pos3_rem2,
                                pos3_rem3:$scope.data.pos3_rem3,
                                pos3_rem4:$scope.data.pos3_rem4,
                                psi             : $scope.data.psi, 
                                comments        : $scope.data.comments, 
                                condFounds      : condFounds,
                                tagDetected     : $scope.data.tagDetected                        
                            }
                       
                        }

                        StorageService.addTireRendToInspection(tireInspection);
                        $scope.showSuccessMessage($translate.instant('INSPECTION_TIRE_SAVED_SUCCESSFULLY'));                       

                        var tiresToInspection = $localStorage.inspectionTires;
                        for (i = 0; i < tiresToInspection.length; i++) {                                
                            if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                $localStorage.inspectionTires.splice(i, 1);
                            }
                        }               

                        $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;
                        
                        $scope.data.pos1_rem1 = ""; $scope.data.pos1_rem2 = ""; $scope.data.pos1_rem3 = ""; $scope.data.pos1_rem4 = ""; $scope.data.pos2_rem1 = ""; $scope.data.pos2_rem2 = ""; $scope.data.pos2_rem3 = ""; $scope.data.pos2_rem4 = ""; $scope.data.pos3_rem1 = ""; $scope.data.pos3_rem2 = ""; $scope.data.pos3_rem3 = ""; $scope.data.pos3_rem4 = "";
                        $scope.data.dr = "";
                        $scope.data.psi = "";
                        $scope.data.comments = "";
                        $scope.data.tagDetected = "NO";
                        $ionicScrollDelegate.scrollTop();
                        $scope.data.others = ""
                        $scope.disableArea = true;

                        $scope.selection = {
                            ids: {
                                "ninguna": false
                            }
                        };

                        $ionicLoading.hide();
                    } else {
                        //ONLINE START                        
                        var DataPromise = Data.insertTireHistorialRend($rootScope.url, $scope.userId, tire.tagId, $scope.data.historyId, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, $scope.data.kilometraje, $scope.data.truckTag, $scope.data.psi, $scope.data.comments, condFounds, $scope.data.tagDetected, $scope.data.pos1_rem1, $scope.data.pos1_rem2, $scope.data.pos1_rem3, $scope.data.pos1_rem4, $scope.data.pos2_rem1, $scope.data.pos2_rem2, $scope.data.pos2_rem3, $scope.data.pos2_rem4, $scope.data.pos3_rem1, $scope.data.pos3_rem2, $scope.data.pos3_rem3, $scope.data.pos3_rem4);                    
                        DataPromise.then(function(result) {
                            if (result['message'] == "success") {                            
                                var tiresToInspection = $localStorage.inspectionTires;
                                for (i = 0; i < tiresToInspection.length; i++) {                                
                                    if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                        $localStorage.inspectionTires.splice(i, 1);
                                    }
                                }
                                $ionicLoading.hide();
                                
                                var aceptar = $translate.instant('MSG_ACEPTAR')
                                var datosPos = $translate.instant('INSPECTION_TIRE_DATA')
                                var charged = $translate.instant('INSPECTION_HAS_BEEN_UPLOADED')
                                $ionicPopup.alert({
                                    template: '<center><p><b>¡ ' + datosPos + ' ' + tire.position + ' ' + charged + '!</b></p></center>',
                                    okText: aceptar,
                                    okType: 'button-positive'
                                });                            
                                $scope.data.inspectionTrucks = $localStorage.inspectionTrucks;
                                $scope.data.inspectionTires = $localStorage.inspectionTires;
                                $scope.data.tireConditions = $localStorage.tireConditions;
                                $scope.data.tireModels = $localStorage.tireModels;
                                $scope.data.tireSizes = $localStorage.tireSizes;
                                $scope.data.tireBrands = $localStorage.tireBrands;
                                $scope.data.historyId = $localStorage.inspectionId;
                                $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;

                                if($scope.data.tiresRegistred == 0){
                                    $localStorage.inspectionTrucks = "";
                                    $scope.data.inspectionMode = $localStorage.inspectionMode;
                                }                          
                                $scope.selection = {
                                    ids: {
                                        "ninguna": false
                                    }
                                };
                                $scope.data.dr = "";
                                $scope.data.psi = "";
                                $scope.data.comments = "";
                                $scope.data.tagDetected = "NO";
                                $scope.data.pos1_rem1 = "";
                                $scope.data.pos1_rem2 = "";
                                $scope.data.pos1_rem3 = "";
                                $scope.data.pos1_rem4 = "";
                                $scope.data.pos2_rem1 = "";
                                $scope.data.pos2_rem2 = "";
                                $scope.data.pos2_rem3 = "";
                                $scope.data.pos2_rem4 = "";
                                $scope.data.pos3_rem1 = "";
                                $scope.data.pos3_rem2 = "";
                                $scope.data.pos3_rem3 = "";
                                $scope.data.pos3_rem4 = "";

                                $ionicScrollDelegate.scrollTop();
                                $scope.data.others = ""
                            } else if (result['message' == "User invalid"]) {
                                $ionicLoading.hide();
                                var error = $translate.instant('MSG_ERROR');
                                var aceptar = $translate.instant('MSG_ACEPTAR');
                                var errorDesc = "User invalid" //$translate.instant('MSG_TRY_AGAIN');
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: error,
                                    template: '<center><p>' + errorDesc + '</p></center>',
                                    okText: aceptar,
                                    okType: 'button-assertive'
                                });
                            } else {
                                $ionicLoading.hide();
                            }
                            $scope.disableArea = true;
                        }, function(reason) {
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
                        //ONLINE END
                    }
                }
                
        }
    };
})