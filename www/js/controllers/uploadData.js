angular.module('uploadData', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])

.controller('UploadDataCtrl', function($ionicPlatform, $scope, $ionicPopup, $localStorage, Data, Check, $translate, $rootScope, StorageService, $state) {
        $scope.showFlotas = false;
        $scope.showTrucks = false;
        $scope.showTires = false;
        $scope.showCustomers = false;
        $scope.showInspectionTrucks = false;
        $scope.showInspectionRend = false;
        $scope.showTruckBrand = false;
        $scope.showTruckModel = false;
        $scope.showTruckType = false;        
        $scope.showTireBrand = false;
        $scope.showTireSize = false;
        $scope.showTireModel = false;
        $scope.showPressure = false;

        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);

        $scope.init = function(){
            $scope.usertype = $localStorage.usertype;
            var totalToSubmit = 0;

            //FIRST GRID ROW
            var countFleetsToSubmit = 0;
            if ($localStorage.storageFleets !== undefined) {
                countFleetsToSubmit = $localStorage.storageFleets;
                var totalFleetsToSubmit = Object.keys(countFleetsToSubmit).length;
                totalToSubmit = totalToSubmit + totalFleetsToSubmit;
                $scope.totalFleetsToSubmit = totalFleetsToSubmit;
            } else {
                $scope.totalFleetsToSubmit = 0;
            }

            var countTruckToSubmit = 0;
            if ($localStorage.storageTrucks !== undefined) {
                countTruckToSubmit = $localStorage.storageTrucks;
                var totalTruckToSubmit = Object.keys(countTruckToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckToSubmit;
                $scope.totalTruckToSubmit = totalTruckToSubmit;
            } else {
                $scope.totalTruckToSubmit = 0;
            }

            var countTiresToSubmit = 0;
            if ($localStorage.storageTires !== undefined) {
                countTiresToSubmit = $localStorage.storageTires;
                var totalTiresToSubmit = Object.keys(countTiresToSubmit).length;
                totalToSubmit = totalToSubmit + totalTiresToSubmit;
                $scope.totalTiresToSubmit = totalTiresToSubmit;
            } else {
                $scope.totalTiresToSubmit = 0;
            }

            //SECOND GRID ROW
            var countCustomersToSubmit = 0;
            if ($localStorage.storageCustomers !== undefined) {
                countCustomersToSubmit = $localStorage.storageCustomers;
                var totalCustomersToSubmit = Object.keys(countCustomersToSubmit).length;
                totalToSubmit = totalToSubmit + totalCustomersToSubmit;
                $scope.totalCustomersToSubmit = totalCustomersToSubmit;
            } else {
                $scope.totalCustomersToSubmit = 0;
            }

            var countInspectionsToSubmit = 0;
            if ($localStorage.storageSemaphoreInspections !== undefined) {
                countInspectionsToSubmit = $localStorage.storageSemaphoreInspections;
                var totalInspectionsToSubmit = Object.keys(countInspectionsToSubmit).length;
                totalToSubmit = totalToSubmit + totalInspectionsToSubmit;
                $scope.totalInspectionsToSubmit = totalInspectionsToSubmit;
            } else {
                $scope.totalInspectionsToSubmit = 0;
            }

            var countRendsToSubmit = 0;
            if ($localStorage.storageRendInspections !== undefined) {
                countRendsToSubmit = $localStorage.storageRendInspections;
                var totalRendsToSubmit = Object.keys(countRendsToSubmit).length;
                totalToSubmit = totalToSubmit + totalRendsToSubmit;
                $scope.totalRendsToSubmit = totalRendsToSubmit;
            } else {
                $scope.totalCustomersToSubmit = 0;
            }

            var countTireInspectionsToSubmit = 0;
            if ($localStorage.storageTireInspections !== undefined) {
                countTireInspectionsToSubmit = $localStorage.storageTireInspections;
                var totalTireInspectionsToSubmit = Object.keys(countTireInspectionsToSubmit).length;
                totalToSubmit = totalToSubmit + totalTireInspectionsToSubmit;
                $scope.totalTireInspectionsToSubmit = totalTireInspectionsToSubmit;
            } else {
                $scope.totalTireInspectionsToSubmit = 0;
            }

            //THIRD GRID ROW
            var countTruckBrandToSubmit = 0;
            if ($localStorage.storageTruckBrand !== undefined) {
                countTruckBrandToSubmit = $localStorage.storageTruckBrand;
                var totalTruckBrandToSubmit = Object.keys(countTruckBrandToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckBrandToSubmit;
                $scope.totalTruckBrandToSubmit = totalTruckBrandToSubmit;
            } else {
                $scope.totalTruckBrandToSubmit = 0;
            }            

            var countTruckModelToSubmit = 0;
            if ($localStorage.storageTruckModel !== undefined) {
                countTruckModelToSubmit = $localStorage.storageTruckModel;                
                var totalTruckModelToSubmit = Object.keys(countTruckModelToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckModelToSubmit;
                $scope.totalTruckModelToSubmit = totalTruckModelToSubmit;
            } else {
                $scope.totalTruckModelToSubmit = 0;
            }

            var countTruckTypeToSubmit = 0;
            if ($localStorage.storageTruckType !== undefined) {
                countTruckTypeToSubmit = $localStorage.storageTruckType;
                var totalTruckTypeToSubmit = Object.keys(countTruckTypeToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckTypeToSubmit;
                $scope.totalTruckTypeToSubmit = totalTruckTypeToSubmit;
            } else {
                $scope.totalTruckTypeToSubmit = 0;
            }
            
            //FOURTH GRID ROW
            var countTireBrandToSubmit = 0;
            if ($localStorage.storageTireBrand !== undefined) {
                countTireBrandToSubmit = $localStorage.storageTireBrand;
                var totalTireBrandToSubmit = Object.keys(countTireBrandToSubmit).length;
                totalToSubmit = totalToSubmit + totalTireBrandToSubmit;
                $scope.totalTireBrandToSubmit = totalTireBrandToSubmit;
            } else {
                $scope.totalTireBrandToSubmit = 0;
            }

            var countTireModelToSubmit = 0;
            if ($localStorage.storageTireModel !== undefined) {
                countTireModelToSubmit = $localStorage.storageTireModel;                
                var totalTireModelToSubmit = Object.keys(countTireModelToSubmit).length;
                totalToSubmit = totalToSubmit + countTireModelToSubmit;
                $scope.totalTireModelToSubmit = totalTireModelToSubmit;
            } else {
                $scope.totalTireBModelToSubmit = 0;
            }

            var countTireSizeToSubmit = 0;
            if ($localStorage.storageTireSize !== undefined) {
                countTireSizeToSubmit = $localStorage.storageTireSize;                
                var totalTireSizeToSubmit = Object.keys(countTireSizeToSubmit).length;
                totalToSubmit = totalToSubmit + totalTireSizeToSubmit;
                $scope.totalTireSizeToSubmit = totalTireSizeToSubmit;
            } else {
                $scope.totalTireSizeToSubmit = 0;
            }

            var countPressuresToSubmit = 0;
            if ($localStorage.storagePressure !== undefined) {
                countPressuresToSubmit = $localStorage.storagePressure;                
                var totalPressuresToSubmit = Object.keys(countPressuresToSubmit).length;
                totalToSubmit = totalToSubmit + totalPressuresToSubmit;
                $scope.totalPressuresToSubmit = totalPressuresToSubmit;
            } else {
                $scope.totalPressuresToSubmit = 0;
            }
            

            

            


            $scope.cantTires = [];
            angular.forEach($localStorage.storageSemaphoreInspections, function(truckInspection) {  
                var cant = 0;
                angular.forEach($localStorage.storageTireInspections, function(tireInspection) {                      
                    if(truckInspection.idtruck == tireInspection.idtruck) {                        
                        cant++;
                    }
                })
                var cantidad = {
                    idtruck:truckInspection.idtruck,
                    quantity: cant
                }
                $scope.cantTires.push(cantidad)                
            })

            $scope.cantRendTires = [];
            angular.forEach($localStorage.storageRendInspections, function(truckInspection) {  
                var cantRend = 0;
                angular.forEach($localStorage.storageTireRendInspections, function(tireInspection) {                      
                    if(truckInspection.idtruck == tireInspection.idtruck) {                        
                        cantRend++;
                    }
                })
                var cantidad = {
                    idtruck:truckInspection.idtruck,
                    quantity: cantRend
                }
                $scope.cantRendTires.push(cantidad)                
            })


            $scope.storageTireInspections = $localStorage.storageTireInspections;
            $scope.totalToSubmit = totalToSubmit;
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
        $scope.showErrorConnectionMsg = function(){
            var error = $translate.instant('MSG_ERROR');
                var aceptar = $translate.instant('MSG_ACEPTAR');
                var errorConexion = $translate.instant('MSG_DATA_LOADED_DESC');
                var tryAgain = $translate.instant('MSG_TRY_AGAIN');                       
                $ionicPopup.alert({
                    title: error,
                    template: '<center><p>' + errorConexion + '</p></center>',
                    okText: aceptar,
                    okType: 'button-assertive'
                });
        }
        $scope.isValid = function(value) {
            return !value
        }

        $scope.toggleFleets = function(){
            $scope.showFlotas = !$scope.showFlotas;            
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageFleets = $localStorage.storageFleets;            
        }

        $scope.toggleTrucks = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = !$scope.showTrucks;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTrucks = $localStorage.storageTrucks;                        
        }

        $scope.toggleTires = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = !$scope.showTires;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTires = $localStorage.storageTires;            
        }

        $scope.toggleCustomers = function(){            
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = !$scope.showCustomers;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageCustomers = $localStorage.storageCustomers;            
        }

        $scope.toggleInspectionTrucks = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = !$scope.showInspectionTrucks;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageSemaphoreInspections = $localStorage.storageSemaphoreInspections;            
        }

        $scope.toggleInspectionRends = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = !$scope.showInspectionRend;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageRendInspections = $localStorage.storageRendInspections;
        }

        $scope.toggleTruckBrands = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = !$scope.showTruckBrand;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTruckBrand = $localStorage.storageTruckBrand;
        }

        $scope.toggleTruckModels = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = !$scope.showTruckModel;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTruckModel = $localStorage.storageTruckModel;
        }

        $scope.toggleTruckTypes= function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = !$scope.showTruckType;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTruckType = $localStorage.storageTruckType;
        }

        $scope.toggleTireBrands = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = !$scope.showTireBrand;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTireBrand = $localStorage.storageTireBrand;
        }

        $scope.toggleTireSizes = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = !$scope.showTireSize;
            $scope.showTireModel = false;
            $scope.showPressure = false;

            $scope.storageTireSize = $localStorage.storageTireSize;
        }

        $scope.toggleTireModels = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = !$scope.showTireModel;
            $scope.showPressure = false;
        }

        $scope.togglePressures = function(){
            $scope.showFlotas = false;
            $scope.showTrucks = false;
            $scope.showTires = false;
            $scope.showCustomers = false;
            $scope.showInspectionTrucks = false;
            $scope.showInspectionRend = false;
            $scope.showTruckBrand = false;
            $scope.showTruckModel = false;
            $scope.showTruckType = false;        
            $scope.showTireBrand = false;
            $scope.showTireSize = false;
            $scope.showTireModel = false;
            $scope.showPressure = !$scope.showPressure;

            $scope.storagePressure = $localStorage.storagePressure;
        }

        $scope.uploadTires = function(){
            var tires = $localStorage.storageTires;
        if ($localStorage.appModeStatus){                
                $scope.showErrorConnectionMsg();
                console.log("En OFFLINE no podemos hacer nada");
            } else {
                console.log("Estamos en modo ONLINE")
                angular.forEach(tires, function(value, key) {   

                // falta inspTruckId    

                var DataPromise = Data.insertTire($rootScope.url, $localStorage.languague, value.customerId, value.flotaId, value.camionId, value.tireBrand, value.tireType, value.tireSize, value.tireModel, value.price, value.year, value.tagId, value.position, value.semaforo, value.desgaste, value.kilometraje, value.pr, value.tagInstalado, value.condFounds)
                DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            var info = $translate.instant('MSG_INFORMATION');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgSuccess = $translate.instant('MSG_DATA_SUCCESS');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                            StorageService.removeTire(value.tagId);
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicPopup.alert({
                                title: info,
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS

                            var errors = ""
                            angular.forEach(result['errors'], function(value, key) {
                                errors = errors + (key + 1) + ".- " + value + "<br>"
                            });

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            $ionicPopup.alert({
                                title: error,
                                template: '<center>' + errors + '</center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }

                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })
            });   
            }

        }

        $scope.uploadTrucks = function (){            
            var trucks = $localStorage.storageTrucks;
            if ($localStorage.appModeStatus){                
                $scope.showErrorConnectionMsg();
            } else {

                angular.forEach(trucks, function(value, key) {   
                var DataPromise = Data.insertTruck($rootScope.url, $localStorage.languague, value.idFlota, value.idModelo, value.placas, value.tag, value.unidad, value.pressureType, value.tagInstalado, value.nombreOperador, value.tipo)
                DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            var info = $translate.instant('MSG_INFORMATION');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgSuccess = $translate.instant('MSG_DATA_SUCCESS');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                            StorageService.removeTruck(value.tag);
                            $scope.$broadcast('scroll.refreshComplete');
                            $ionicPopup.alert({
                                title: info,
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS

                            var errors = ""
                            angular.forEach(result['errors'], function(value, key) {
                                errors = errors + (key + 1) + ".- " + value + "<br>"
                            });

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            $ionicPopup.alert({
                                title: error,
                                template: '<center>' + errors + '</center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }

                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })
            });

            }            
        }   
        $scope.uploadCustomers = function (){            
                    
            var customers = $localStorage.storageCustomers;
            $scope.customerCompany = []; 
            $scope.customerEmail = []; 
            $scope.customerPassword = [];

            if ($localStorage.appModeStatus) {
                    //si el modo offline está activado                                        
                    $scope.showErrorConnectionMsg();
                    
            } else {
                angular.forEach(customers, function(value, key) {
                   
                    var DataPromise = Data.insertCustomer($rootScope.url, $localStorage.languague, value.company, value.email, value.password, value.address, value.phone, value.contact, value.job, value.status, value.type, value.customerNumber)
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            var info = $translate.instant('MSG_INFORMATION');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgSuccess = $translate.instant('MSG_DATA_SUCCESS');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');                            
                            StorageService.removeCustomer(value.email);
                            $scope.init();
                            $ionicPopup.alert({
                                title: info,
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS
                            var errors = ""
                            angular.forEach(result['errors'], function(value, key) {
                                errors = errors + (key + 1) + ".- " + value + "<br>"
                            });

                            $ionicPopup.alert({
                                title: error,
                                template: '<center>' + errors + '</center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }
                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })

                });
            }            
        }   
        $scope.uploadFleets = function (){            
            var fleets = $localStorage.storageFleets;
            if ($localStorage.appModeStatus) {                    
                    $scope.showErrorConnectionMsg();
                    //si el modo offline está activado
            } else {
                    angular.forEach(fleets, function(value, key) { 
                         var DataPromise = Data.insertFleet($rootScope.url, $localStorage.languague, value.adminId, value.nombre, value.calle, value.colonia, value.ciudad, value.estado, value.pais, value.telefono, value.email, value.password, value.idCliente, value.encargado, value.roldeCambio)
                         DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            var info = $translate.instant('MSG_INFORMATION');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgSuccess = $translate.instant('TIRES_FLEET') + " " + $translate.instant('MSG_SAVED_SUCCESSFULY');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                            StorageService.removeFleet(value.nombre);
                            $scope.init();
                            $ionicPopup.alert({
                                title: info,
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS

                            var errors = ""
                            angular.forEach(result['errors'], function(value, key) {
                                errors = errors + (key + 1) + ".- " + value + "<br>"
                            });

                            var error = $translate.instant('MSG_ERROR');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            $ionicPopup.alert({
                                title: error,
                                template: '<center>' + errors + '</center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });

                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }

                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })
                });
            }
        }
        $scope.uploadSemaphoreInspection = function (){
            var cantSem = Object.keys($localStorage.storageSemaphoreInspections).length;
            
            if (cantSem > 0) {                
                for (var i = $localStorage.storageSemaphoreInspections.length - 1; i >= 0; i--) {
                    var sem = $localStorage.storageSemaphoreInspections[i];                    
                    var idSem = 0;

                    //---------------------AGREGAMOS EL SEMAFORO-----------------------
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, sem.userId, sem.tag, sem.marca, sem.modelo, sem.unidad, sem.kilometros, sem.placas, sem.tagInstalado, sem.kmZero, sem.tipoInspeccion)                    
                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            idSem = result['historyId'];
                            console.log("fuera del promise el valor es: " + idSem)

                            //---------------------SI SE AGREGO SEMAFORO----------------------                    
                            //---------------------BUSCAMOS SUS LLANTAS Y LAS INSERTAMOS----------------------
                            for (var s = $localStorage.storageTireInspections.length - 1; s >= 0; s--) {
                                var tire = $localStorage.storageTireInspections[s];  
                                console.log("fuera del promise el valor es: " + idSem)
                                console.log("antes de insertar el id es: " + tire.tireType)
                                var DataPromise = Data.insertTireHistorial($rootScope.url, tire.userId, tire.tagId, idSem, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, tire.kilometraje, tire.truckTag, tire.dr, tire.psi, tire.comments, tire.condFounds, tire.tagDetected, tire.tireType);                    
                                
                                DataPromise.then(function(result) {
                                    if (result['message'] == 'success') {
                                        //DATOS CARGADOS             
                                        console.log("se insertó la llanta " +  tire.tagId)
                                        StorageService.removeTireInspection(tire.tagId)
                                    } else if (result['message'] == 'error') {
                                        //DATOS CON ERRORES O INCOMPLETOS
                                        console.log("ERROR al insertar la llanta " +  tire.tagId)
                                        var errors = ""
                                        angular.forEach(result['errors'], function(value, key) {
                                            errors = errors + (key + 1) + ".- " + value + "<br>"
                                        });                                
                                    } else {
                                        //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                        console.log("SE RECIBIÓ UNA RESPUESTA INESPERADA into")
                                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                                    }

                                }, function(reason) {
                                    //ERROR DE CONEXIÓN
                                    console.log("ERROR CONEXION")
                                    $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                                })
                            } //----------END FOR storageTireInspection                    
                            StorageService.removeSemaphoreInspection(sem.tag);console.log("el id return es: " + idSem)
                            //DATOS CARGADOS                            
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS
                            var errors = ""
                            angular.forEach(result['errors'], function(sem, key) {
                                errors = errors + (key + 1) + ".- " + sem + "<br>"
                            });                            
                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }

                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })

            var countInspectionsToSubmit = 0;
            if ($localStorage.storageSemaphoreInspections !== undefined) {
                countInspectionsToSubmit = $localStorage.storageSemaphoreInspections;
                var totalInspectionsToSubmit = Object.keys(countInspectionsToSubmit).length;
                $scope.totalInspectionsToSubmit = totalInspectionsToSubmit;
            } else {
                $scope.totalInspectionsToSubmit = 0;
            }


                }//------ END FOR storageSemaphoreInspections                                                        
            } //------------if (cantSem > 0) 

            $scope.showSuccessMessage($translate.instant('UPLOAD_DONE'));  
        }
        $scope.uploadRendInspection = function (){
            var cantSem = Object.keys($localStorage.storageRendInspections).length;
            
            if (cantSem > 0) {                
                for (var i = $localStorage.storageRendInspections.length - 1; i >= 0; i--) {
                    var sem = $localStorage.storageRendInspections[i];
                    
                    var idSem = 0;

                    //---------------------AGREGAMOS EL SEMAFORO-----------------------
                    var DataPromise = Data.insertTruckHistorial($rootScope.url, sem.userId, sem.tag, sem.marca, sem.modelo, sem.unidad, sem.kilometros, sem.placas, sem.tagInstalado, sem.kmZero, sem.tipoInspeccion)                    

                    DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            idSem = result['historyId'];
                            //DATOS CARGADOS                            
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS
                            var errors = ""
                            angular.forEach(result['errors'], function(sem, key) {
                                errors = errors + (key + 1) + ".- " + sem + "<br>"
                            });                            
                        } else {
                            //SE RECIBIÓ UNA RESPUESTA INESPERADA
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        }

                    }, function(reason) {
                        //ERROR DE CONEXIÓN
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                    })

                    //---------------------SI SE AGREGO SEMAFORO----------------------                    
                    //---------------------BUSCAMOS SUS LLANTAS Y LAS INSERTAMOS----------------------
                    for (var s = $localStorage.storageTireRendInspections.length - 1; s >= 0; s--) {
                        var tire = $localStorage.storageTireRendInspections[s];  
                        var DataPromise = Data.insertTireHistorialRend($rootScope.url, $localStorage.userId, tire.tagId, tire.historyId, tire.tireBrand, tire.tireSize, tire.tireModel, tire.position, tire.tagInstalado, tire.kilometraje, tire.truckTag, tire.psi, tire.comments, tire.condFounds, tire.tagDetected, tire.pos1_rem1, tire.pos1_rem2, tire.pos1_rem3, tire.pos1_rem4, tire.pos2_rem1, tire.pos2_rem2, tire.pos2_rem3, tire.pos2_rem4, tire.pos3_rem1, tire.pos3_rem2, tire.pos3_rem3, tire.pos3_rem4, tire.tireType);                                                                        
                        
                        DataPromise.then(function(result) {
                            if (result['message'] == 'success') {
                                //DATOS CARGADOS                                
                                StorageService.removeRendInspection(tire.tagId)
                            } else if (result['message'] == 'error') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                var errors = ""
                                angular.forEach(result['errors'], function(value, key) {
                                    errors = errors + (key + 1) + ".- " + value + "<br>"
                                });                                
                            } else {
                                //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                            }

                        }, function(reason) {
                            //ERROR DE CONEXIÓN
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_OCURRED') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                        })
                    } //----------END FOR storageTireInspection
                    
                    StorageService.removeRendInspection(sem.tag);

            var countRendsToSubmit = 0;
            if ($localStorage.storageRendInspections !== undefined) {
                countInspectionsToSubmit = $localStorage.storageRendInspections;
                var totalInspectionsToSubmit = Object.keys(countInspectionsToSubmit).length;
                $scope.totalRendsToSubmit = totalInspectionsToSubmit;
            } else {
                $scope.totalRendsToSubmit = 0;
            }


                }//------ END FOR storageRendInspections                                                        
            } //------------if (cantSem > 0) 

            $scope.showSuccessMessage($translate.instant('UPLOAD_DONE'));  
        }


        $scope.deleteCustomer = function(email){
            StorageService.removeCustomer(email);
            $scope.init();            
        }
        $scope.deleteTruck = function(tag) {
            StorageService.removeTruck(tag);
            $scope.init();
        }

         $scope.deleteTire = function(tag){
            console.log("Borraremos " + tag)
            StorageService.removeTire(tag);
            $scope.init();            
        }

        $scope.deleteFleet = function(nombre) {            
            StorageService.removeFleet(nombre);
            $scope.init();
        }
        $scope.deleteSemaphoreInspection = function(tag, idtruck){ 
            var result = StorageService.removeAllTireInspection(idtruck)   
            if(result){
                StorageService.removeSemaphoreInspection(tag);                
            }
            $scope.init();
        }
        $scope.deleteRendInspection = function(tag, idtruck){ 
            var result = StorageService.removeAllTireRendInspection(idtruck)   
            if(result){
                StorageService.removeRendInspection(tag);
            }
            $scope.init();
        }
    })