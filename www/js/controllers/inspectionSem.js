angular.module('inspections', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
.controller('InspectionCtrl', function(/*nfcService,*/ $ionicPlatform, ionicMaterialInk, ionicMaterialMotion, $timeout, $stateParams, $scope, $localStorage, $translate, $ionicLoading, Data, Check, $ionicPopup, $rootScope, $ionicModal, $ionicHistory, $state, StorageService, $ionicScrollDelegate) {

        $scope.camionExiste = false;
        $scope.camionEncontrado = true;
        $scope.data.tagId = ''; // Al parecer nunca lo ocupamos... 
        $scope.activatedNFC = false;
        $scope.data.images = {}
        $scope.devices = {}
        $scope.data.showDevs = '';
        $scope.data.deviceConected = ''; 
        $scope.data.deviceName = '';
        $scope.disableArea = true;          
        $scope.data.imgCamion = ''
        $scope.showButtons = false;
        $scope.data.tireModels = $localStorage.tireModels;
        $scope.data.tireSizes = $localStorage.tireSizes;
        $scope.data.tireBrands = $localStorage.tireBrands;
        $scope.tagId = ''; // No se ocupa nunca !!!
        $scope.data.truckTag = ''; // Se agrega para buscar el TAG con que localizaremos la inspección realizada
        console.log($scope.data.tireBrands);

        /*$scope.tag = nfcService.tag;*/
        
        $scope.data.dr = bluetooth.milimetraje_;
        $scope.data.psi = bluetooth.pressure_;
        
        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);
        
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
        /*
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
        */
        $scope.showBluetoothOptions = function(){
            $scope.oModal1.show();
            $scope.showButtons = false;
        }

        $ionicModal.fromTemplateUrl('templates/bluetoothModal.html', {
            id: '1', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal1 = modal;
        });

        $scope.openModal = function(index, tagId) {
            console.log(tagId)            
            if (index == 1) $scope.oModal1.show();
        };

        $scope.closeModal = function(index) {
            if (index == 1) $scope.oModal1.hide();
        };

        /* Listen for broadcasted messages */

        $scope.$on('modal.shown', function(event, modal) {
            //console.log('Modal ' + modal.id + ' is shown!');
        });

        $scope.$on('modal.hidden', function(event, modal) {
            //console.log('Modal ' + modal.id + ' is hidden!');
        });


        $scope.recallToInspection = function() {
            if ($localStorage.appModeStatus) {
                var messageInspection = $scope.data.messageInspection;
                console.log($scope.data.truckTag);

                if($localStorage.inspectionMode == 'Manual'){
                    $state.go('app.inspSemManual', {
                        animation: 'slide-in-down'
                    });
                }
                if($localStorage.inspectionMode == 'NFC'){
                    $state.go('app.inspSemNFC', {
                        animation: 'slide-in-down'
                    });
                }
                if($localStorage.inspectionMode == 'Translogik'){
                    $state.go('app.inspSemTranslogik', {
                        animation: 'slide-in-down'
                    });
                }   
            } else {
                console.log("el scope es..." + $scope.data.messageInspection)           
                    // Si contamos con red
                    var errorConexion = $translate.instant('INSPECTION_MESSAGE_ERROR');           

                    if($scope.data.messageInspection){
                        console.log("entró a insertar mensaje en id: " + $localStorage.inspectionId);
                        var DataPromise = Data.messageToInspection($rootScope.url, $localStorage.languague, $localStorage.inspectionId, $scope.data.messageInspection)
                        DataPromise.then(function(result) {
                            console.log(result);
                            if (result['result'] == "OK") {                                            
                                if($localStorage.inspectionMode == 'Manual'){
                                    $state.go('app.inspSemManual', {
                                        animation: 'slide-in-down'
                                    });
                                }
                                if($localStorage.inspectionMode == 'NFC'){
                                    $state.go('app.inspSemNFC', {
                                        animation: 'slide-in-down'
                                    });
                                }
                                if($localStorage.inspectionMode == 'Translogik'){
                                    $state.go('app.inspSemTranslogik', {
                                        animation: 'slide-in-down'
                                    });
                                }
                            } else {
                                $state.go('app.dashboard', {
                                    animation: 'slide-in-down'
                                });
                                $scope.showErrorMessage(errorConexion);
                            }

                        }, function(reason) {
                            $state.go('app.dashboard', {
                                animation: 'slide-in-down'
                            });                    
                            $scope.showErrorMessage(errorConexion);
                        })
                    } else {
                        if($localStorage.inspectionMode == 'Manual'){
                            $state.go('app.inspSemManual', {
                                animation: 'slide-in-down'
                            });
                        }
                        if($localStorage.inspectionMode == 'NFC'){
                            $state.go('app.inspSemNFC', {
                                animation: 'slide-in-down'
                            });
                        }
                        if($localStorage.inspectionMode == 'Translogik'){
                            $state.go('app.inspSemTranslogik', {
                                animation: 'slide-in-down'
                            });
                        }
                    }      
            }
                           
        }    
        $scope.init = function() {
            $scope.data.tireModels = $localStorage.tireModels;
            $scope.data.tireSizes = $localStorage.tireSizes;
            $scope.data.tireBrands = $localStorage.tireBrands;
            console.log($scope.data.tireBrands);
            $scope.inspectionMode = $localStorage.inspectionMode;
            $scope.trucks = $localStorage.trucks;
            $scope.data.kilometraje = 0;

            if ($scope.inspectionMode === undefined) {
                $localStorage.inspectionMode = 'Manual';
            }

            if ($scope.inspectionMode == 'Manual') {

            }

            if ($scope.inspectionMode == 'NFC') {
                $scope.data.activatedNFC = $localStorage.activatedNFC;
            }

            if ($scope.inspectionMode == 'Translogik') {

            }

            if ($scope.inspectionMode == 'Gun') {

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

        $scope.openModal = function() {        
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.openModal = function(index, tagId) {            
            if (index == 1) {
                $scope.data.myTagId = tagId;
                console.log("ID: " + tagId)
                console.log("Entramos al modal!" + index)
                angular.forEach($localStorage.tires, function(value, key) {
                    if(value.tagId == tagId){
                        console.log("entonces la llanta es: " + value)
                        console.log(value);
                        $scope.tireToEdit = value;                    
                    }
                });
                $scope.oModal1.show();
            }            
        };

        $scope.closeModal = function(index) {
            if (index == 1) $scope.oModal1.hide();           
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
        });

        $ionicModal.fromTemplateUrl('templates/editTire.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal1 = modal;
        });

        $scope.findTruck = function(tagCamion) {
            $scope.tagCamion = tagCamion;
            console.log($scope.tagCamion)
            if ($scope.tagCamion !== undefined) {
                if ($localStorage.appModeStatus) {
                    //si el modo offline está activado
                    var trucks = $localStorage.trucks;
                    var truckExist = false;
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tagCamion){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                            truckExist = true;
                        }
                    });
                    console.log("camion existe? " + truckExist)

                    if (truckExist) {
                        //BUSCAMOS EN LOCALSTORAGE y enviamos los valores recibidos
                        $scope.camionExiste = true;
                        $scope.trucks = $localStorage.trucks;
                        $scope.tires = $localStorage.tires;
                        $scope.truckTypes = $localStorage.truckTypes;
                        $scope.pressureTypes = $localStorage.pressureTypes;
                        var tireNumber = 0;

                        angular.forEach($localStorage.tires, function(value, key) {                                                     
                            if(value.camionId == idtruck){
                                console.log(value)
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
                                console.log();
                                $scope.tires = result['tires'];
                                $scope.historialInspections = result['historialInspections'];
                                $localStorage.inspectionTrucks = result['truck'];
                                $localStorage.inspectionTires = result['tires'];
                                console.log($localStorage.inspectionTires);
                                $scope.truckTypes = $localStorage.truckTypes;
                                $scope.pressureTypes = $localStorage.pressureTypes;
                                $scope.tagCamion = tagCamion;
                                console.log($scope.tagCamion);
                                $scope.userId = $localStorage.userId;
                                $scope.showHistorialInspecciones = false;

                                var countTiresRegistred = 0;
                                if ($localStorage.inspectionTires !== undefined) {

                                    countTiresRegistred = $localStorage.inspectionTires;

                                    var tiresRegistred = Object.keys(countTiresRegistred).length;

                                    $scope.data.tiresRegistred = tiresRegistred;
                                } else {
                                    $scope.data.tiresRegistred = 0;
                                }

                            } else if (result['message'] == 'not found') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();

                                $scope.showErrorMessage($translate.instant('DASHBOARD_CAMION') + " <strong>" + tagCamion + "</strong> " + $translate.instant('MSG_NOT_FOUND'));

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

        $scope.findTruck2 = function(){            
            $scope.tagCamion = angular.element(document.querySelector('#tagTruck'))[0].value;            

            if ($scope.tagCamion !== undefined) {
                if ($localStorage.appModeStatus) {
                    //si el modo offline está activado
                    var trucks = $localStorage.trucks;
                    var truckExist = false;
                    angular.forEach(trucks, function(value, key) {
                        if ($scope.tagCamion == value.tag) {
                            truckExist = true;
                        }
                    });

                    if (truckExist) {
                        //BUSCAMOS EN LOCALSTORAGE y enviamos los valores recibidos
                        $scope.camionExiste = true;
                        $scope.trucks = $localStorage.trucks;
                        $scope.tires = $localStorage.tires;
                        $scope.truckTypes = $localStorage.truckTypes;
                        $scope.pressureTypes = $localStorage.pressureTypes;

                    } else {
                        var msgError = $translate.instant('DASHBOARD_CAMION') + ': <strong>' + $scope.tagCamion + '</strong> ' + $translate.instant('MSG_NOTAVAILABLE') + ' ' + $translate.instant('MSG_INTHIS') + ' ' + $translate.instant('DASHBOARD_CLIENTE_LABEL')
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

                    var DataPromise = Data.getTruckData($rootScope.url, $scope.tagCamion)
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
                                $scope.userId = $localStorage.userId;
                                $scope.showHistorialInspecciones = false;

                                var countTiresRegistred = 0;
                                if ($localStorage.inspectionTires !== undefined) {

                                    countTiresRegistred = $localStorage.inspectionTires;

                                    var tiresRegistred = Object.keys(countTiresRegistred).length;

                                    $scope.data.tiresRegistred = tiresRegistred;
                                } else {
                                    $scope.data.tiresRegistred = 0;
                                }

                            } else if (result['message'] == 'not found') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();

                                var error = $translate.instant('MSG_ERROR');
                                var aceptar = $translate.instant('MSG_ACEPTAR');
                                var notFound = $translate.instant('DASHBOARD_CAMION') + " <strong>" + $scope.tagCamion + "</strong> " + $translate.instant('MSG_NOT_FOUND')
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
        $scope.clearTruck = function() {            
            $scope.camionExiste = false;
            $scope.trucks = $localStorage.trucks;
            $scope.data.tagCamion = undefined;
            $scope.showButtons = false;
        }

        $scope.bluetooth = function(){

        }
        var setTagTruck = function($event) {
            console.log($event.target.value);
        };
        
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

        $scope.getMilims = function(){
            console.log("Milimetraje almacenado del equipo")
            $scope.data.dr = bluetooth.milimetraje_;

            console.log("delay 500 milisegundos")
            $timeout(function() {                
                if($scope.data.dr == 0){                        
                    console.log("si el milimetraje es igual a cero entonces vovler a llamar función")
                    $scope.getMilims();                                        
                } else if($localStorage.milim == $scope.data.dr) {
                    console.log("si el milimetraje almacenado... es igual al milimetraje ")
                    $scope.getMilims();
                } else {
                    console.log("el milimetraje es diferente y se guardó")
                    $localStorage.milim = bluetooth.milimetraje_;                
                }
            }, 1000);                    
        }
        $scope.getPressure = function(){
            
            console.log("Presión almacenado del equipo")
            $scope.data.psi = bluetooth.pressure_;

            console.log("delay 500 milisegundos")
            $timeout(function() {                
                if($scope.data.psi == 0){                        
                    console.log("si la Presión es igual a cero entonces vovler a llamar función")
                    $scope.getPressure();                                        
                } else if($localStorage.psi == $scope.data.psi) {
                    console.log("si la Presión almacenado... es igual a la Presión ")
                    $scope.getPressure();
                } else {
                    console.log("la Presión es diferente y se guardó")
                    $localStorage.psi = bluetooth.pressure_;                
                }
            }, 1000); 
        }

        $scope.getTAGS = function(intentos){
              $scope.data.lecturas = 0;
            $scope.data.lecturasRem = [];                    

            $timeout(function() {
                if(intentos < 50)
                {
                    bluetoothSerial.read(function (data) {
                        $scope.data.infoReceived = data;
                    },
                        console.log("Error recibiendo datos:")
                    )
                }
            }, 500); 
        }        
       
        $scope.startInspection = function(userId, tag, marca, modelo, unidad, placas, tagInstalado, tipoInspeccion) {
            $scope.disableArea = true;
            $scope.data.tagId = tag;
            var _userId = userId;
            if(_userId === undefined || _userId == ""){
                _userId = $localStorage.userId;
            }            
            
            if ($scope.data.kilometraje === undefined) {
                console.log("el km IS undefined")

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
            } else if($scope.data.kilometraje <= 0){
                console.log("el km es CERO")

                if($scope.data.kmZero === undefined){
                        console.log("NO seleccionó opción")
                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_REASON_KM_ZERO_NULL') + ": " + $translate.instant('INSPECTION_KILOMETRAJE_CEROS');
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
                        console.log("SI seleccionó opción");
                        /********************************/


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

                            $scope.data.truckTag = tag; 

                            var storageSemaphoreInspection = {
                                idtruck: idtruck,
                                userId: _userId, 
                                tag:tag,
                                marca:marca, 
                                modelo:modelo, 
                                unidad:unidad, 
                                placas:placas, 
                                tagInstalado:tagInstalado, 
                                kmZero:$scope.data.kmZero, 
                                tipoInspeccion:tipoInspeccion
                            }

                            StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                        year:value.year,
                                        tireType:value.tireType
                                    }
                                    $localStorage.inspectionTires.push(tire)
                                }
                            }); 

                            $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                            
                            console.log($localStorage.inspectionTires)
                            console.log("total de llantas" + $scope.data.tiresRegistred)
                            if($scope.data.tiresRegistred != 0){
                                $state.go('app.iManual', {
                                    animation: 'slide-in-down'
                                });    
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
                            tipoInspeccion = Check.isNull(tipoInspeccion)
                            //INICIA INSPECCION ONLINE
                            var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)                            
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS
                                    $ionicLoading.hide();
                                    $ionicHistory.clearCache().then(function() {
                                        
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
                                        console.log()
                                        if(result['kilometraje'] != ''){
                                            $scope.data.kilometraje = parseInt(result['kilometraje']);
                                        }

                                        angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                            if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                                $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                            }
                                        });
                                        console.log("entonces la imagen es: " + $scope.data.truckImg)
                                        $state.go('app.iManual', {
                                            animation: 'slide-in-down'
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

                                    $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_UPDATE_INFORMATION'));

                                } else if (result['message'] == "Truck tag not exists") {
                                    //DATOS CON ERRORES O INCOMPLETOS
                                    $ionicLoading.hide();

                                    $scope.showErrorMessage($translate.instant('INSPECTION_TRUCK_TAG_NOT_EXIST'));

                                } else {
                                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                    $ionicLoading.hide();
                                    $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                                }

                            }, function(reason) {
                                //ERROR DE CONEXIÓN                                
                                $ionicLoading.hide();
                                $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                            })
                            //FINALIZA INSPECCIÓN ONLINE
                        }                          
                        /********************************/                        
                    }                                               
            } else {
                console.log("el km es: " + $scope.data.kilometraje);
                /********************************/
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
                    console.log("entró a modo offline")
                    //si el modo offline está activado
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tag){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                        }
                    });

                    var storageSemaphoreInspection = {
                        idtruck: idtruck,
                        userId: _userId, 
                        tag:tag,
                        marca:marca, 
                        modelo:modelo, 
                        unidad:unidad, 
                        placas:placas, 
                        tagInstalado:tagInstalado, 
                        kmZero:$scope.data.kmZero, 
                        tipoInspeccion:tipoInspeccion
                    }

                    StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                year:value.year,
                                tireType:value.tireType                                                                                                
                            }
                            $localStorage.inspectionTires.push(tire)
                        }
                    });            

                    $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                    
                    console.log($localStorage.inspectionTires)
                    console.log("total de llantas" + $scope.data.tiresRegistred)
                    if($scope.data.tiresRegistred != 0){
                        $state.go('app.iManual', {
                            animation: 'slide-in-down'
                        });        
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
                    console.log("entró a modo online")
                    //INICIA INSPECCION ONLINE
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();
                            $ionicHistory.clearCache().then(function() {
                                
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
                                console.log("llantas a registrar? " + $scope.data.tiresRegistred)
                                if(result['kilometraje'] != ''){
                                    $scope.data.kilometraje = parseInt(result['kilometraje']);
                                }

                                angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                    if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                        $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                    }
                                });
                                console.log("entonces la imagen es: " + $scope.data.truckImg)
                                
                                $state.go('app.iManual', {
                                    animation: 'slide-in-down'
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
                /********************************/                
            }
        }                   
        $scope.startInspectionNFC = function(userId, tag, marca, modelo, unidad, placas, tagInstalado, tipoInspeccion) {
            $scope.disableArea = true;
            var _userId = userId;
            if(_userId === undefined || _userId == ""){
                _userId = $localStorage.userId;
            }            
            
            if ($scope.data.kilometraje === undefined) {
                console.log("el km IS undefined")

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
            } else if($scope.data.kilometraje <= 0){
                console.log("el km es CERO")

                if($scope.data.kmZero === undefined){
                        console.log("NO seleccionó opción")
                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_REASON_KM_ZERO_NULL') + ": " + $translate.instant('INSPECTION_KILOMETRAJE_CEROS');
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
                        console.log("SI seleccionó opción");
                        /********************************/


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
                            var idtruck = ""
                            angular.forEach($localStorage.trucks, function(value, key) {                            
                                if(value.tag == tag){
                                    $scope.data.idtruck = value.id;
                                    idtruck = value.id;
                                }
                            });
                                
                            var storageSemaphoreInspection = {
                                idtruck: idtruck,
                                userId: _userId, 
                                tag:tag,
                                marca:marca, 
                                modelo:modelo, 
                                unidad:unidad, 
                                placas:placas, 
                                tagInstalado:tagInstalado, 
                                kmZero:$scope.data.kmZero, 
                                tipoInspeccion:tipoInspeccion
                            }

                            StorageService.addSemaphoreInspection(storageSemaphoreInspection);

                            console.log("el id del camión es: " + idtruck)


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
                                        year:value.year,
                                        tireType:value.tireType                                                                                             
                                    }
                                    $localStorage.inspectionTires.push(tire)
                                }
                            });         

                            $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                            
                            console.log($localStorage.inspectionTires)
                            console.log("total de llantas" + $scope.data.tiresRegistred)
                            if($scope.data.tiresRegistred != 0){
                                $state.go('app.iNFC', {
                                    animation: 'slide-in-down'
                                });
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
                            var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS
                                    $ionicLoading.hide();
                                    $ionicHistory.clearCache().then(function() {
                                        
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
                                        if(result['kilometraje'] != ''){
                                            $scope.data.kilometraje = parseInt(result['kilometraje']);
                                        }

                                        angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                            if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                                $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                            }
                                        });
                                        console.log("entonces la imagen es: " + $scope.data.truckImg)
                                        $state.go('app.iNFC', {
                                            animation: 'slide-in-down'
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
                        /********************************/                        
                    }                                               
            } else {
                console.log("el km es: " + $scope.data.kilometraje);
                /********************************/
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
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tag){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                        }
                    });

                    var storageSemaphoreInspection = {
                        idtruck: idtruck,
                        userId: _userId, 
                        tag:tag,
                        marca:marca, 
                        modelo:modelo, 
                        unidad:unidad, 
                        placas:placas, 
                        tagInstalado:tagInstalado, 
                        kmZero:$scope.data.kmZero, 
                        tipoInspeccion:tipoInspeccion
                    }

                    StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                year:value.year,
                                tireType:value.tireType                                                                                            
                            }
                            $localStorage.inspectionTires.push(tire)
                        }
                    });                        

                    $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                    
                    console.log($localStorage.inspectionTires)
                    console.log("total de llantas" + $scope.data.tiresRegistred)
                    if($scope.data.tiresRegistred != 0){
                        $state.go('app.iNFC', {
                            animation: 'slide-in-down'
                        });
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
                    console.log("entró a modo online")
                    //INICIA INSPECCION ONLINE
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();
                            $ionicHistory.clearCache().then(function() {
                                
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
                                if(result['kilometraje'] != ''){
                                    $scope.data.kilometraje = parseInt(result['kilometraje']);
                                }

                                angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                    if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                        $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                    }
                                });
                                console.log("entonces la imagen es: " + $scope.data.truckImg)
                                console.log("el total de llantas a inspeccionar es: " + $scope.data.tiresRegistred)
                                $state.go('app.iNFC', {
                                    animation: 'slide-in-down'
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
                /********************************/                
            }
        }   
        $scope.startInspectionTranslogik = function(userId, tag, marca, modelo, unidad, placas, tagInstalado, tipoInspeccion) {
            $scope.disableArea = true;
            var _userId = userId;
            if(_userId === undefined || _userId == ""){
                _userId = $localStorage.userId;
            }            
            
            if ($scope.data.kilometraje === undefined) {
                console.log("el km IS undefined")

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
            } else if($scope.data.kilometraje <= 0){
                console.log("el km es CERO")

                if($scope.data.kmZero === undefined){
                        console.log("NO seleccionó opción")
                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_REASON_KM_ZERO_NULL') + ": " + $translate.instant('INSPECTION_KILOMETRAJE_CEROS');
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
                        console.log("SI seleccionó opción");
                        /********************************/


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

                            var storageSemaphoreInspection = {
                                idtruck: idtruck,
                                userId: _userId, 
                                tag:tag,
                                marca:marca, 
                                modelo:modelo, 
                                unidad:unidad, 
                                placas:placas, 
                                tagInstalado:tagInstalado, 
                                kmZero:$scope.data.kmZero, 
                                tipoInspeccion:tipoInspeccion
                            }

                            StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                        year:value.year,
                                        tireType:value.tireType                                                                                                
                                    }
                                    $localStorage.inspectionTires.push(tire)
                                }
                            });         

                            $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                            
                            console.log($localStorage.inspectionTires)
                            console.log("total de llantas" + $scope.data.tiresRegistred)
                            if($scope.data.tiresRegistred != 0){
                                $state.go('app.iTranslogik', {
                                    animation: 'slide-in-down'
                                });
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
                            var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS
                                    $ionicLoading.hide();
                                    $ionicHistory.clearCache().then(function() {
                                        
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
                                        if(result['kilometraje'] != ''){
                                            $scope.data.kilometraje = parseInt(result['kilometraje']);
                                        }

                                        angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                            if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                                $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                            }
                                        });
                                        console.log("entonces la imagen es: " + $scope.data.truckImg)

                                        $state.go('app.iTranslogik', {
                                            animation: 'slide-in-down'
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
                        /********************************/                        
                    }                                               
            } else {
                console.log("el km es: " + $scope.data.kilometraje);
                /********************************/
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
                    console.log("entró a modo offline")
                    //si el modo offline está activado
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tag){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                        }
                    });

                    var storageSemaphoreInspection = {
                        idtruck: idtruck,
                        userId: _userId, 
                        tag:tag,
                        marca:marca, 
                        modelo:modelo, 
                        unidad:unidad, 
                        placas:placas, 
                        tagInstalado:tagInstalado, 
                        kmZero:$scope.data.kmZero, 
                        tipoInspeccion:tipoInspeccion
                    }

                    StorageService.addSemaphoreInspection(storageSemaphoreInspection);                

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
                                year:value.year,
                                tireType:value.tireType                                                                                                
                            }
                            $localStorage.inspectionTires.push(tire)
                        }
                    });                        

                    $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                    
                    console.log($localStorage.inspectionTires)
                    console.log("total de llantas" + $scope.data.tiresRegistred)
                    if($scope.data.tiresRegistred != 0){
                        $state.go('app.iTranslogik', {
                            animation: 'slide-in-down'
                        });
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
                    console.log("entró a modo online")
                    //INICIA INSPECCION ONLINE
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();
                            $ionicHistory.clearCache().then(function() {
                                
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
                                if(result['kilometraje'] != ''){
                                    $scope.data.kilometraje = parseInt(result['kilometraje']);
                                }

                                angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                    if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                        $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                    }
                                });
                                console.log("entonces la imagen es: " + $scope.data.truckImg)

                                $state.go('app.iTranslogik', {
                                    animation: 'slide-in-down'
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
                /********************************/                
            }
        }   
        $scope.startInspectionGun = function(userId, tag, marca, modelo, unidad, placas, tagInstalado, tipoInspeccion) {
            $scope.disableArea = true;
            var _userId = userId;
            if(_userId === undefined || _userId == ""){
                _userId = $localStorage.userId;
            }            
            
            if ($scope.data.kilometraje === undefined) {
                console.log("el km IS undefined")

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
            } else if($scope.data.kilometraje <= 0){
                console.log("el km es CERO")

                if($scope.data.kmZero === undefined){
                        console.log("NO seleccionó opción")
                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_REASON_KM_ZERO_NULL') + ": " + $translate.instant('INSPECTION_KILOMETRAJE_CEROS');
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
                        console.log("SI seleccionó opción");
                        /********************************/


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

                            var storageSemaphoreInspection = {
                                idtruck: idtruck,
                                userId: _userId, 
                                tag:tag,
                                marca:marca, 
                                modelo:modelo, 
                                unidad:unidad, 
                                placas:placas, 
                                tagInstalado:tagInstalado, 
                                kmZero:$scope.data.kmZero, 
                                tipoInspeccion:tipoInspeccion
                            }

                            StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                        year:value.year,
                                        tireType:value.tireType                                                                                               
                                    }
                                    $localStorage.inspectionTires.push(tire)
                                }
                            });   

                            $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                            
                            console.log($localStorage.inspectionTires)
                            console.log("total de llantas" + $scope.data.tiresRegistred)
                            if($scope.data.tiresRegistred != 0){
                                $state.go('app.iGun', {
                                    animation: 'slide-in-down'
                                });
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
                            var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                            DataPromise.then(function(result) {
                                if (result['message'] == 'success') {
                                    //DATOS CARGADOS
                                    $ionicLoading.hide();
                                    $ionicHistory.clearCache().then(function() {
                                        
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
                                        if(result['kilometraje'] != ''){
                                            $scope.data.kilometraje = parseInt(result['kilometraje']);
                                        }

                                       angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                            if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                                $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                            }
                                        });
                                        console.log("entonces la imagen es: " + $scope.data.truckImg)

                                        $state.go('app.iGun', {
                                            animation: 'slide-in-down'
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
                        /********************************/                        
                    }                                               
            } else {
                console.log("el km es: " + $scope.data.kilometraje);
                /********************************/
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
                    console.log("entró a modo offline")
                    //si el modo offline está activado
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tag){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                        }
                    });

                    var storageSemaphoreInspection = {
                        idtruck: idtruck,
                        userId: _userId, 
                        tag:tag,
                        marca:marca, 
                        modelo:modelo, 
                        unidad:unidad, 
                        placas:placas, 
                        tagInstalado:tagInstalado, 
                        kmZero:$scope.data.kmZero, 
                        tipoInspeccion:tipoInspeccion
                    }

                    StorageService.addSemaphoreInspection(storageSemaphoreInspection);

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
                                year:value.year,
                                tireType:value.tireType                                                                                               
                            }
                            $localStorage.inspectionTires.push(tire)
                        }
                    });                        

                    $scope.data.tiresRegistred = Object.keys($localStorage.inspectionTires).length;        
                    
                    console.log($localStorage.inspectionTires)
                    console.log("total de llantas" + $scope.data.tiresRegistred)
                        if($scope.data.tiresRegistred != 0){
                        $state.go('app.iGun', {
                            animation: 'slide-in-down'
                        });
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
                    console.log("entró a modo online")
                    //INICIA INSPECCION ONLINE
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, _userId, tag, marca, modelo, unidad, $scope.data.kilometraje, placas, tagInstalado, $scope.data.kmZero, tipoInspeccion)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();
                            $ionicHistory.clearCache().then(function() {
                                
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
                                if(result['kilometraje'] != ''){
                                    $scope.data.kilometraje = parseInt(result['kilometraje']);
                                }

                                angular.forEach($localStorage.truckTypes, function(value, key) {                            
                                    if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                        $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                    }
                                });
                                console.log("entonces la imagen es: " + $scope.data.truckImg)

                                $state.go('app.iGun', {
                                    animation: 'slide-in-down'
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
                /********************************/                
            }
        }   
        $scope.addTireInspection = function(tire) {
            console.log(tire)
            console.log($scope.data.tireType);
            console.log($scope.data.truckTag);
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
                    if(condFounds != ""){
                        condFounds = condFounds.substring(0, condFounds.length - 1);
                    }
                    condFounds = condFounds + "," + $scope.data.others;
                    console.log("las condiciones encontradas son: "+condFounds)                    
                    if($scope.data.tagDetected === undefined) {
                        $scope.data.tagDetected = 'NO'
                    }
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

                    if ($scope.data.dr === undefined) {
                        $ionicLoading.hide();

                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_WRITE_REMAINING')                
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
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
                                    dr              : $scope.data.dr, 
                                    psi             : $scope.data.psi, 
                                    comments        : ' ', 
                                    condFounds      : condFounds,
                                    tagDetected     : $scope.data.tagDetected,
                                    tireType        : $scope.data.tireType
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
                                    dr              : $scope.data.dr, 
                                    psi             : $scope.data.psi, 
                                    comments        : $scope.data.comments, 
                                    condFounds      : condFounds,
                                    tagDetected     : $scope.data.tagDetected,
                                    tireType        : $scope.data.tireType
                                    }
                               
                                }

                                console.log("OFFLINE llanta a insertar: ")
                                console.log(tireInspection)

                                StorageService.addTireToInspection(tireInspection);

                                $ionicLoading.hide();
                                $scope.showSuccessMessage($translate.instant('INSPECTION_TIRE_SAVED_SUCCESSFULLY'))

                                var tiresToInspection = $localStorage.inspectionTires;
                                console.log($localStorage.inspectionTires)
                                for (i = 0; i < tiresToInspection.length; i++) {                                
                                    if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                        $localStorage.inspectionTires.splice(i, 1);
                                    }
                                }               

                                $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;         

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
                            } else {

                                console.log("ONLINE: "+$scope.data.dr)
                                //ONLINE START
                                console.log($scope.data.tireType + " TireType ");
                                var DataPromise = Data.insertTireHistorial($rootScope.url, $scope.userId, tire.tagId, $scope.data.historyId, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, $scope.data.kilometraje, $scope.data.truckTag, $scope.data.dr, $scope.data.psi, $scope.data.comments, condFounds, $scope.data.tagDetected, $scope.data.tireType);                    
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
                                        $scope.data.dr = '';
                                        console.log($scope.data.dr);
                                        $scope.data.psi = '';
                                        console.log($scope.data.psi);
                                        $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;
                                        console.log("el numero de llantas faltantes: " + $scope.data.tiresRegistred)
                                        if($scope.data.tiresRegistred == 0){
                                            $localStorage.inspectionTrucks = "";
                                            $scope.data.inspectionMode = $localStorage.inspectionMode;
                                        }                          
                                        $scope.selection = {
                                            ids: {
                                                "ninguna": false
                                            }
                                        };
                                        $scope.data.dr = '';
                                        $scope.data.psi = '';
                                        $scope.data.comments = "";
                                        $scope.data.tagDetected = "NO";
                                        $ionicScrollDelegate.scrollTop();
                                        $scope.data.others = ""
                                        $scope.disableArea = true;
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
                } 
            } else {
                console.log("CONDICIONES NORMALES")
                                    if(condFounds != ""){
                        condFounds = condFounds.substring(0, condFounds.length - 1);
                    }
                    condFounds = condFounds + "," + $scope.data.others;
                    console.log("las condiciones encontradas son: "+condFounds)                    
                    if($scope.data.tagDetected === undefined) {
                        $scope.data.tagDetected = 'NO'
                    }
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

                    if ($scope.data.dr === undefined) {
                        $ionicLoading.hide();

                        var popTitle = $translate.instant('MSG_ERROR')
                        var aceptar = $translate.instant('MSG_ACEPTAR')
                        var msgError = $translate.instant('INSPECTION_WRITE_REMAINING')                
                        $ionicPopup.alert({
                            title: popTitle,
                            template: '<center><p><b>' + msgError + '</b></p></center>',
                            okText: aceptar,
                            okType: 'button-assertive'
                        });
                    } else {
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
                                    dr              : $scope.data.dr, 
                                    psi             : $scope.data.psi, 
                                    comments        : ' ', 
                                    condFounds      : condFounds,
                                    tagDetected     : $scope.data.tagDetected,
                                    tireType        : $scope.data.tireType
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
                                    dr              : $scope.data.dr, 
                                    psi             : $scope.data.psi, 
                                    comments        : $scope.data.comments, 
                                    condFounds      : condFounds,
                                    tagDetected     : $scope.data.tagDetected,
                                    tireType        : $scope.data.tireType                                
                                    }
                               
                                }

                                console.log("OFFLINE llanta a insertar: ")
                                console.log("tipo de llantas es? " + $scope.data.tireType)
                                console.log(tireInspection)

                                StorageService.addTireToInspection(tireInspection);

                                $ionicLoading.hide();
                                $scope.showSuccessMessage($translate.instant('INSPECTION_TIRE_SAVED_SUCCESSFULLY'))

                                var tiresToInspection = $localStorage.inspectionTires;
                                for (i = 0; i < tiresToInspection.length; i++) {                                
                                    if (tiresToInspection[i].tagId == tire.tagId) {                                    
                                        $localStorage.inspectionTires.splice(i, 1);
                                    }
                                }               

                                $scope.data.tiresRegistred = Object.keys($scope.data.inspectionTires).length;         

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
                            } else {
                                //ONLINE START
                                var DataPromise = Data.insertTireHistorial($rootScope.url, $scope.userId, tire.tagId, $scope.data.historyId, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, $scope.data.kilometraje, $scope.data.truckTag, $scope.data.dr, $scope.data.psi, $scope.data.comments, condFounds, $scope.data.tagDetected);                    
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
                                        console.log("el numero de llantas faltantes: " + $scope.data.tiresRegistred)
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
            }
        };
        $scope.selection = {
            ids: {
                "ninguna": false
            }
        };
                
    $scope.quickSearch = function (tagCamion) {
        console.log("Entramos a busqueda rapida con TAG: " + tagCamion)
        $state.go('app.iQuickSearch', {
            animation: 'slide-in-down'
        });
         $scope.tagCamion = tagCamion;
            console.log($scope.tagCamion)
            if ($scope.tagCamion !== undefined) {
                if ($localStorage.appModeStatus) {
                    //si el modo offline está activado
                    var trucks = $localStorage.trucks;
                    var truckExist = false;
                    var idtruck = ""
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tagCamion){
                            $scope.data.idtruck = value.id;
                            idtruck = value.id;
                            truckExist = true;
                        }
                    });
                    console.log("camion existe? " + truckExist)

                    if (truckExist) {
                        //BUSCAMOS EN LOCALSTORAGE y enviamos los valores recibidos
                        $scope.camionExiste = true;
                        $scope.trucks = $localStorage.trucks;
                        console.log($scope.trucks);
                        $scope.tires = $localStorage.tires;
                        $scope.truckTypes = $localStorage.truckTypes;
                        $scope.pressureTypes = $localStorage.pressureTypes;
                        var tireNumber = 0;

                        angular.forEach($scope.truckTypes, function(value, key) {                            
                            if(value.id == $scope.data.inspectionTrucks[0].tipo){                                                
                                $scope.data.truckImg = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                            }
                        });
                        console.log("entonces la imagen es: " + $scope.data.truckImg)
                        angular.forEach($localStorage.tires, function(value, key) {                                                     
                            if(value.camionId == idtruck){
                                console.log(value)
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
                                console.log($scope.trucks);
                                $scope.data.flashTires = result['tires'];     
                                console.log($scope.tires);                          
                                $scope.truckTypes = $localStorage.truckTypes;
                                $scope.pressureTypes = $localStorage.pressureTypes;
                                $scope.tagCamion = tagCamion;
                                $scope.userId = $localStorage.userId;
                                $scope.showHistorialInspecciones = false;

                                console.log("Procedemos a insertar el insertHistorialFastCamion");
                                var DataPromise = Data.insertHistorialFastCamion($rootScope.url, $localStorage.languague, tagCamion, $scope.userId, "appMobile")
                                DataPromise.then(function(result) {
                                    if (result['result'] == 'OK') {
                                        console.log(result['data']) 
                                        $localStorage.fastIdHistory = result['data'];
                                        console.log($localStorage.fastIdHistory);
                                    }                                    
                                });

                                var countTiresRegistred = 0;
                                if ($scope.tires !== undefined) {
                                    countTiresRegistred = $scope.tires;
                                    var tiresRegistred = Object.keys(countTiresRegistred).length;
                                    $scope.data.tiresRegistred = tiresRegistred;
                                } else {
                                    $scope.data.tiresRegistred = 0;
                                }

                            } else if (result['message'] == 'not found') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();

                                $scope.showErrorMessage($translate.instant('DASHBOARD_CAMION') + " <strong>" + tagCamion + "</strong> " + $translate.instant('MSG_NOT_FOUND'));

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
        console.log("Solicitamos los datos del camión");   
    }

    $scope.sendQuickReport = function () {
        console.log("Adivinen que? Voy a mandar la información de la inspección rapida" + $scope.data.messageInspection)
        var loading = $translate.instant('MSG_LOADING');
            $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
            content: loading,
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var DataPromise = Data.insertFastCamionMessage($rootScope.url, $localStorage.languague, $localStorage.fastIdHistory, $scope.data.messageInspection)
        DataPromise.then(function(result) {
            console.log(result)
            $ionicLoading.hide();
            $state.go('app.dashboard', {
                animation: 'slide-in-down'
            });
        });
     }


    })