angular.module('trucks', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])

.controller('TruckCtrl', function($ionicPlatform, ionicMaterialInk, $scope, $localStorage, $translate, $ionicLoading, $ionicPopup, Data, StorageService, $rootScope, $state, $timeout, Check, $ionicModal) {
    
    $scope.customers = {};
    $scope.fleets = {};
    $scope.localTruckBrand = "";
    $scope.truckModel = {};
    $scope.truckModels = {};
    $scope.truckTypes = {};
    $scope.data.truckInspectionated = "";

    $ionicPlatform.offHardwareBackButton(function() {
      console.log("Hola"); 
    });
    $ionicPlatform.registerBackButtonAction(function(event) {
    }, 100);

    $scope.init = function() {
        //$scope.company = $localStorage.company;
        $scope.customers = $localStorage.customers;
        $scope.fleets = $localStorage.fleets;
        console.log("Local: " + $localStorage.fleets);
        console.log("Scope: " + $scope.fleets);
        $scope.fleetSelId = $localStorage.fleetSelId;
        $scope.fleetSelName = $localStorage.fleetSelName;
        $scope.truckBrands = $localStorage.truckBrands;
        $scope.truckModels = $localStorage.truckModels;
        $scope.truckTypes = $localStorage.truckTypes;
        $scope.data.tiresBefore = true;
        $scope.tag = $localStorage.companyIdAccount;
        $localStorage.submitDataTruck = {};

        //console.log($scope.truckBrands.length)
        //$scope.myTruckBrandPos = $scope.truckBrands.length;
        //console.log($scope.truckBrands[1].id)
        $scope.truckBrandTag = $scope.truckBrands[1].brand;
        //console.log($scope.truckBrands[$scope.myTruckBrandPos].brand);
        //$scope.truckBrandTag =         
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
    $scope.showSuccessMessage = function(success){
      var aceptar = $translate.instant('MSG_ACEPTAR')                
      $ionicPopup.alert({
          template: '<center><p><b>' + success + '</b></p></center>',
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
    $scope.setTAGTruck = function(unidad){
        $scope.tag = $localStorage.companyIdAccount + unidad
    }
    $scope.getFlotas = function(company) {
        console.log("Entramos a cambiar cliente...");
        if ($localStorage.appModeStatus) {
            //si el modo offline está activado
            //comparamos si la compañia seleccionada es la misma que             
            if (company == $localStorage.company) {
                //seleccionar las flotas almacenadas en Storage
                $scope.fleet = $localStorage.fleet;
                $scope.fleets = $localStorage.fleets;
                console.log("Scope" + $scope.fleets);
                console.log("Local" + $localStorage.fleets);
                $scope.idFlota = $localStorage.idFlota;
            } else {
                //informamos que 
                var msgError = $translate.instant('MSG_USEMODE_OFFLINE_DESC')
                $scope.showErrorMessage(msgError + ':<br>' + $localStorage.companyName);                    
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

            var DataPromise = Data.getFlotasbyCliente($rootScope.url, company)
            DataPromise.then(function(result) {
                if (result['fleets']) {
                    $scope.fleets = result['fleets'];
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                }

            }, function(reason) {
                $ionicLoading.hide();
                $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + $translate.instant('MSG_TRY_AGAIN'));
            })
        }
    }

    $scope.getTruckModelsbyMarca = function(id) {
        if ($localStorage.appModeStatus) {
            console.log("Entró en Offline")
            //si el modo offline está activado
            //comparamos si la compañia seleccionada es la misma que             
            if ($localStorage.truckModels !== undefined) {
                //seleccionar las flotas almacenadas en Storage
                //$scope.truckModels = $localStorage.truckModels;
            } else {
                //informamos que 
                var modCam = $translate.instant('DASHBOARD_DOWNLOAD_MODELOCAMIONES_LABEL')
                var modCamEmpty = $translate.instant('MSG_ERROR_DATA_EMPTY');
                var dashb = $translate.instant('MENU_DASHBOARD_LABEL')
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + modCam + '</b> ' + modCamEmpty + ' ' + dashb + '</p></center>',
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

            var DataPromise = Data.getTruckModelsbyMarca($rootScope.url, id)
            DataPromise.then(function(result) {
                    if (result['fleets']) {
                        $scope.fleets = result['fleets'];
                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                    }

                }, function(reason) {
                    $ionicLoading.hide();
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + $translate.instant('MSG_TRY_AGAIN'));
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });

        }
    }
    $scope.getPressureTypeByTruckType = function(id) {
        if ($localStorage.appModeStatus) {
            //si el modo offline está activado
            //comparamos si la compañia seleccionada es la misma que             
            if ($localStorage.pressureTypes !== undefined) {
                //seleccionar las flotas almacenadas en Storage
                if(Check.isNumber(id)){
                    console.log("so.. el id es: " +  id)
                    $scope.pressureTypes = $localStorage.pressureTypes;
                }                
            } else {
                //informamos que 
                var modCam = $translate.instant('DASHBOARD_DOWNLOAD_PRESSURETYPES_LABEL')
                var modCamEmpty = $translate.instant('MSG_ERROR_DATA_EMPTY');
                var dashb = $translate.instant('MENU_DASHBOARD_LABEL')
                var popTitle = $translate.instant('MSG_ERROR')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: popTitle,
                    template: '<center><p><b>' + modCam + '</b> ' + modCamEmpty + ' ' + dashb + '</p></center>',
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

            var DataPromise = Data.getPressureTypeByTruckType($rootScope.url, id)
            DataPromise.then(function(result) {
                    if (result['pressureTypes']) {
                        $scope.pressureTypes = result['pressureTypes'];
                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                    }

                }, function(reason) {
                    $ionicLoading.hide();
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + $translate.instant('MSG_TRY_AGAIN'));
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });

        }
    }
    $scope.insertTruck = function(company, idFlota, idModelo, placas, anio, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo, tiresBefore, truckBrandTag, truckKms) {                
        console.log("insertar llantas? " + tiresBefore)
        console.log("Compañia: " + company + "Flota: " + idFlota + " Modelo: " + idModelo + "Placas: " + placas + "Año: " + anio + "Tag: " + tag + "Unidad: " + unidad + "Presión: " + pressureType + "E. Tag: " + tagInstalado + "Operador: " + nombreOperador + "Tipo: " + tipo + "Llantas despues: " + tiresBefore + "Marca: " + truckBrandTag + "Kms: " + truckKms);
        if(tiresBefore){
            //SI AGREGAREMOS LLANTAS DESPUES
            console.log($scope.data.kms);
            if ($scope.data.kms === undefined || $scope.data.kms == '') {
                $scope.showErrorMessage($translate.instant('TIRES_KM_DIFERENT_ZERO'))
            } else {                
                if($scope.data.kms <= 0){
                    $scope.showErrorMessage($translate.instant('TIRES_KM_DIFERENT_ZERO'))
                } else {
                    //////////////INSERT TRUCK CODE
                    if (tagInstalado === undefined) {
                        tagInstalado = 'NO'
                    } else {
                        tagInstalado = 'SI'
                    }
                    placas = Check.isNull(placas)
                    nombreOperador = Check.isNull(nombreOperador)
                    tag = Check.isNull(tag)
                    pressureType = Check.isNull(pressureType)
                            
                    if (angular.isObject(idModelo)) {
                        idModelo = ''
                    }

                    if ($localStorage.appModeStatus) {
                        //si el modo offline está activado
                        //comparamos si la compañia seleccionada es la misma que    
                        console.log("Como estamos en modo offline mandaremos estos datos")
                        console.log(idFlota + " " + idModelo + " " + placas + " " + anio + " " + tag + " " + unidad + " " + pressureType + " " + tagInstalado + " " + nombreOperador + " " + tipo + " " + $scope.data.kms);
                        var truck = {
                            idFlota: idFlota,
                            idModelo: idModelo,
                            placas: placas,
                            anio: anio,
                            tag: tag,
                            unidad: unidad,
                            pressureType: pressureType,
                            tagInstalado: tagInstalado,
                            nombreOperador: nombreOperador,
                            tipo: tipo
                        }

                        StorageService.addTruck(truck);   
                        $localStorage.trucks.push({id: tag, idFlota: idFlota, idModelo: idModelo, nombreOperador: nombreOperador, 
                            placas: placas, pressureType: pressureType, tag: tag, tagInstalado: tagInstalado, tipo: tipo, unidad: unidad, year: anio, kilometraje: $scope.data.kms});          
                        console.log("entró e imprimió el siguiente mensaje:")
                        console.log($translate.instant('TRUCK_SAVED_SUCCESSFULY'))
                        $scope.showSuccessMessage($translate.instant('TRUCK_SAVED_SUCCESSFULY'));
                        /** El desmadre comienza desde aquí **/

                        angular.forEach($localStorage.truckTypes, function(value, key) {                    
                            if(tipo == value.id){
                                $scope.data.imgTruck = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                $scope.data.numLlantas = value.numLlantas;
                                $scope.data.truckTypeName = value.nombre
                            }
                        });

                        console.log("el numero de llantas a registrar es: " + $scope.data.numLlantas)
                        //$scope.data.truckInspectionated = truckData;
                        console.log("entonces el camión es? ")
                        console.log($scope.data.truckInspectionated)
                        
                        //Insertamos llanta a llanta
                        $localStorage.addTire = [];           
                        $scope.data.tireConditions = $localStorage.tireConditions;
                        for (var i=1; i<$scope.data.numLlantas+1; i++) {
                            $localStorage.addTire.push(
                                {posicion: i, tag: tag+(i < 10 ? '0' : '') + i}
                            );                
                        }

                        angular.forEach($localStorage.truckTypes, function(value, key) {                    
                            if(tipo == value.id){
                                $scope.data.imgTruck = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                $scope.data.numLlantas = value.numLlantas;
                                $scope.data.truckTypeName = value.nombre
                            }
                        });
                        $scope.data.addTire = $localStorage.addTire;
                        $scope.truckTypes = $localStorage.truckTypes;

                        /** En este punto tenemos que considerar que sera la primera inspección por tanto guardaremos el primer semaforo **/

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

                        /** Y aqui despues del desmadre pasamos a insertar las llantas**/
                        $state.go("app.addMultiTires", {
                                animation: 'slide-in-down'
                            });
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
                        console.log("Mandaremos estos datos...")
                        console.log(idFlota + " " + idModelo + " " + placas + " " + anio + " " + tag + " " + unidad + " " + pressureType + " " + tagInstalado + " " + nombreOperador + " " + tipo);

                        var DataPromise = Data.insertTruck($rootScope.url, $localStorage.languague, idFlota, idModelo, placas, anio, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo)
                        DataPromise.then(function(result) {
                            if (result['message'] == 'success') {
                                var truckId = result['truckId'];
                                //DATOS CARGADOS
                                $ionicLoading.hide();
                                /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                                if($localStorage.company){
                                    $scope.selectCliente($localStorage.company)
                                } else {
                                    console.log("POR ALGUNA RAZON COMPANY IS undefined")
                                }
                                /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                                $scope.showSuccessMessage($translate.instant('MSG_DATA_SUCCESS'));

                                if ($localStorage.appModeStatus) { 
                                console.log("Estamos en offline y guardaremos la inspección...")                       
                                    var storageSemaphoreInspection = {
                                            userId: $localStorage.userId, 
                                            tag:tag,
                                            marca:truckBrandTag, 
                                            modelo:idModelo, 
                                            unidad:unidad,
                                            kilometros:$scope.data.kms, 
                                            placas:placas, 
                                            tagInstalado:tagInstalado, 
                                            kmZero:"", 
                                            tipoInspeccion:"Manual"
                                        }
                                        StorageService.addSemaphoreInspection(storageSemaphoreInspection);
                                    //Si está en modo offline y se insertó entonces                                    
                                } else {
                                    //INICIA INSPECCION ONLINE
                                    var DataPromise = Data.insertTruckHistorial($rootScope.url, $localStorage.userId, tag, "", "",  unidad, $scope.data.kms, placas, tagInstalado, "", "Manual")
                                    DataPromise.then(function(result) {
                                        if (result['message'] == 'success') {
                                            //DATOS CARGADOS                                                                                                
                                            $localStorage.inspectionId = result['historyId'];
                                            console.log("[company]: " + company)
                                            console.log("[fleet]: " + idFlota)
                                            console.log("[truckId]: " + truckId)
                                            console.log("[kms] : " + $scope.data.kms)
                                            $localStorage.submitDataTruck = {"company":company,"fleet":idFlota,"truckId":truckId,"kms":$scope.data.kms};                                            
                                            //Buscamos el tamaño de llantas
                                            $scope.data.numLlantas = ""
                                            angular.forEach($localStorage.truckTypes, function(value, key){
                                                if(tipo == value.id){                        
                                                    $scope.data.numLlantas = value.numLlantas;
                                                }
                                            })

                                            var truckData = {
                                                id:truckId,
                                                idFlota:idFlota,
                                                idModelo:idModelo,
                                                nombreOperador:nombreOperador,
                                                placas:placas,
                                                pressureType:pressureType,
                                                tag:tag,
                                                tagInstalado:tagInstalado,
                                                tipo:tipo,
                                                unidad: unidad,
                                                cantLlantas: $scope.data.numLlantas
                                            }
                                            
                                            angular.forEach($localStorage.truckTypes, function(value, key) {                    
                                                if(tipo == value.id){
                                                    $scope.data.imgTruck = $rootScope.baseurl + "static/images/trucktypes/" + value.img;
                                                    $scope.data.numLlantas = value.numLlantas;
                                                    $scope.data.truckTypeName = value.nombre
                                                }
                                            });

                                            console.log("el numero de llantas a registrar es: " + $scope.data.numLlantas)
                                            $scope.data.truckInspectionated = truckData;
                                            console.log("entonces el camión es? ")
                                            console.log($scope.data.truckInspectionated)
                                            //Insertamos llanta a llanta
                                            $localStorage.addTire = [];           
                                            $scope.data.tireConditions = $localStorage.tireConditions;
                                            for (var i=1; i<$scope.data.numLlantas+1; i++) {
                                                $localStorage.addTire.push(
                                                    {posicion: i, tag: tag+(i < 10 ? '0' : '') + i}
                                                );                
                                            }

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
                                        } else if (result['message'] == "Can't insert truck history") {
                                            $scope.showErrorMessage($translate.instant('TRUCK_TRUCKS_SUCESSFULLY_BUT_NOT_TIRES'));
                                        } else if (result['message'] == "Can't update truck information") {
                                            $scope.showErrorMessage($translate.instant('TRUCK_TRUCKS_SUCESSFULLY_BUT_NOT_TIRES'));
                                        } else if (result['message'] == "Truck tag not exists") {
                                            $scope.showErrorMessage($translate.instant('TRUCK_TRUCKS_SUCESSFULLY_BUT_NOT_TIRES'));
                                        } else {
                                            $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                                        }
                                    }, function(reason) {
                                        //ERROR DE CONEXIÓN                                            
                                        $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                                    })                        
                                }
                            } else if (result['message'] == 'error') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();

                                var errors = ""
                                angular.forEach(result['errors'], function(value, key) {
                                    errors = errors + (key + 1) + ".- " + value + "<br>"
                                });

                                $scope.showErrorMessage('<center>' + errors + '</center>')

                            } else {
                                //SE RECIBIÓ UNA RESPUESTA INESPERADA
                                $ionicLoading.hide();
                                $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                            }

                        }, function(reason) {
                            //ERROR DE CONEXIÓN
                            $ionicLoading.hide();
                            $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                        })
                        .finally(function() {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }                    
                    //////////////INSERT TRUCK CODE
                }
            }
        } else {
            //NO AGREGAREMOS LLANTAS DESPUES
            //////////////INSERT TRUCK CODE
            if (tagInstalado === undefined) {
                tagInstalado = 'NO'
            } else {
                tagInstalado = 'SI'
            }
            placas = Check.isNull(placas)
            nombreOperador = Check.isNull(nombreOperador)
            tag = Check.isNull(tag)
            pressureType = Check.isNull(pressureType)
                    
            if (angular.isObject(idModelo)) {
                idModelo = ''
            }

            if ($localStorage.appModeStatus) {
                //si el modo offline está activado
                //comparamos si la compañia seleccionada es la misma que    

                var truck = {
                    idFlota: idFlota,
                    idModelo: idModelo,
                    placas: placas,
                    tag: tag,
                    unidad: unidad,
                    pressureType: pressureType,
                    tagInstalado: tagInstalado,
                    nombreOperador: nombreOperador,
                    tipo: tipo
                }

                StorageService.addTruck(truck);
                 $localStorage.trucks.push({id: tag, idFlota: idFlota, idModelo: idModelo, nombreOperador: nombreOperador, 
                            placas: placas, pressureType: pressureType, tag: tag, tagInstalado: tagInstalado, tipo: tipo, unidad: unidad, year: anio});          
                        console.log("Guarde en localStorage")
                $scope.showSuccessMessage($translate.instant('TRUCK_SAVED_SUCCESSFULY'))                
                $state.go("app.dashboard", {
                        animation: 'slide-in-down'
                    });
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


                var DataPromise = Data.insertTruck($rootScope.url, $localStorage.languague, idFlota, idModelo, placas, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo)
                DataPromise.then(function(result) {
                    if (result['message'] == 'success') {
                        //DATOS CARGADOS
                        $ionicLoading.hide();
                        var info = $translate.instant('MSG_INFORMATION');
                        var aceptar = $translate.instant('MSG_ACEPTAR');
                        var msgSuccess = $translate.instant('MSG_DATA_SUCCESS');
                        var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                        /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                        if($localStorage.company){
                            $scope.selectCliente($localStorage.company)
                        } else {
                            console.log("POR ALGUNA RAZON COMPANY IS undefined")
                        }
                        /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                        $scope.showSuccessMessage('<center><p><strong>' + msgSuccess + '</strong></p></center>')
                        console.log("pasó directo al dashboard")
                            $state.go("app.dashboard", {
                                animation: 'slide-in-down'
                            });                                                        
                    } else if (result['message'] == 'error') {
                        //DATOS CON ERRORES O INCOMPLETOS
                        $ionicLoading.hide();

                        var errors = ""
                        angular.forEach(result['errors'], function(value, key) {
                            errors = errors + (key + 1) + ".- " + value + "<br>"
                        });
                        $scope.showErrorMessage(errors);

                    } else {
                        //SE RECIBIÓ UNA RESPUESTA INESPERADA
                        $ionicLoading.hide();
                        $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                    }

                }, function(reason) {
                    //ERROR DE CONEXIÓN
                    $ionicLoading.hide();
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + '<br/>' + translate.instant('MSG_TRY_AGAIN'));
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }                    
            //////////////INSERT TRUCK CODE                
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
                    $localStorage.companyIdAccount = result['companyIdAccount'];
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

                } else {
                    $ionicLoading.hide();
                    $scope.showErrorMessage($translate.instant('DASHBOARD_ERROR_DOWNLOADING_DATA'));
                }

            }, function(reason) {
                $ionicLoading.hide();
                $scope.showErrorMessage('<center><p>' + $translate.instant('MSG_ERROR_CONEXION') + '<br/><b>' + $translate.instant('MSG_TRY_AGAIN') + '</b></p></center>');
            })
            $scope.$broadcast('scroll.refreshComplete');
        }
    }

    
    $scope.openModal = function() {        
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
    // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
    // Execute action
    });


     $scope.openModal = function(index) {
        console.log("Entramos al modal!" + index)
        if (index == 1) $scope.oModal1.show();
        if (index == 2) {
            $scope.oModal2.show();
            $scope.truckBrands = $localStorage.truckBrands;
            $scope.truckBrand = $scope.truckBrandTag;            
        }
        if (index == 3) {
            $scope.idAccount = $localStorage.companyIdAccount;
            $scope.oModal3.show();
        }
        if (index == 4) $scope.oModal4.show();
        if (index == 5) {            
            $scope.oModal5.show();                    
            $scope.data.truckTypeMod = $scope.data.truckType;
        }
    };

    $scope.closeModal = function(index) {
        if (index == 1) $scope.oModal1.hide();
        if (index == 2) $scope.oModal2.hide(); 
        if (index == 3) $scope.oModal3.hide(); 
        if (index == 4) $scope.oModal4.hide(); 
        if (index == 5) $scope.oModal5.hide(); 
    };

    $ionicModal.fromTemplateUrl('templates/addTruckBrand.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/addTruckModel.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal2 = modal;
    });

    // Modal 3
    $ionicModal.fromTemplateUrl('templates/detallesTagTruck.html', {
        id: '3', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal3 = modal;
    });

     // Modal 4
    $ionicModal.fromTemplateUrl('templates/addTruckType.html', {
        id: '4', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal4 = modal;
    });

     // Modal 5
    $ionicModal.fromTemplateUrl('templates/addPressure.html', {
        id: '5', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal5 = modal;
    });



    $scope.addTruckBrand = function(truckBrand){    
    if ($localStorage.appModeStatus) {
        var truckBrandArray = {                            
            id: truckBrand,
            brand: truckBrand,
        }
        StorageService.addTruckBrand(truckBrandArray);
        $scope.truckBrands = $localStorage.truckBrands;
        $scope.truckBrandTag = truckBrand;
        $scope.closeModal(1);                                       
    } else {
        console.log("modo online activado")
         //ONLINE
            var DataPromise = Data.addTruckBrand($rootScope.url, $localStorage.languague, truckBrand)
            DataPromise.then(function(result) {
                if (result['message'] == 'success') {
                    //DATOS CARGADOS                                                                                                
                    console.log("Datos cargados con exito")
                    if(result['result']){
                        console.log("entró a actualizar la lista de truck Brand");
                        $localStorage.truckBrands = result['result'];
                        $scope.truckBrands = $localStorage.truckBrands;
                        console.log($scope.truckBrands)
                        $scope.data.truckBrand = result['id'];
                        //$scope.truckBrand = $scope.data.truckBrand;
                        console.log($scope.data.truckBrand);
                        $scope.truckBrandTag = $scope.truckBrands[result['id']];                                                
                    }
                    $scope.closeModal(1);
                    //Si está en modo online y se insertó entonces                                                              
                } else if (result['message'] == 'error') {
                    //DATOS CON ERRORES O INCOMPLETOS
                    $ionicLoading.hide();

                    var errors = ""
                    angular.forEach(result['errors'], function(value, key) {
                        errors = errors + (key + 1) + ".- " + value + "<br>"
                    });

                    $scope.showErrorMessage(errors);

                } else {
                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + ' ' + $translate.instant('MSG_TRY_AGAIN'))                            
                }
            }, function(reason) {
                //ERROR DE CONEXIÓN
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + ' ' + $translate.instant('MSG_TRY_AGAIN')); 
            }) 
        }
    }

    $scope.addTruckModel = function(brandId, model){
        
         if ($localStorage.appModeStatus) {
            console.log("modo Offline activado")
             var truckModel = {
                id: model,                
                truckBrand: brandId,                            
                model: model
            }
            StorageService.addTruckModel(truckModel);  
            $scope.truckModels = $localStorage.truckModels;
            $scope.closeModal(2);            
        } else {
            console.log("modo online activado")
            //ONLINE
            var DataPromise = Data.addTruckModel($rootScope.url, $localStorage.languague, brandId, model)
            DataPromise.then(function(result) {
                if (result['message'] == 'success') {
                    //DATOS CARGADOS                                                                                                
                    console.log("Datos cargados con exito")
                    if(result['result']){
                        console.log("entró a actualizar la lista de truck Models");
                        $localStorage.truckModels = result['result'];
                        $scope.truckModels = $localStorage.truckModels;
                        //$scope.data.truckModel = result['id'];
                    }

                    $scope.closeModal(2);
                    //Si está en modo online y se insertó entonces                                
                } else if (result['message'] == 'error') {
                    //DATOS CON ERRORES O INCOMPLETOS
                    $ionicLoading.hide();

                    var errors = ""
                    angular.forEach(result['errors'], function(value, key) {
                        errors = errors + (key + 1) + ".- " + value + "<br>"
                    });

                    $scope.showErrorMessage(errors);

                } else if (result['message'] == 'truck model already exist') {
                    //DATOS CON ERRORES O INCOMPLETOS
                    $ionicLoading.hide();

                    $scope.showErrorMessage($translate.instant('TRUCK_MODEL_ALREADY_EXIST'));

                } else {
                    //SE RECIBIÓ UNA RESPUESTA INESPERADA
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                }

            }, function(reason) {
                //ERROR DE CONEXIÓN
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
            }) 
        }

    }

    $scope.detPressures = function(tirePSI){
        $scope.tireMaxPSI = parseInt(tirePSI) + 10;
        $scope.tireMinPSI = parseInt(tirePSI) - 10;
    }


    $scope.addTruckType = function(truckType, numLlantas){        
         if ($localStorage.appModeStatus) {
            console.log("modo Offline activado")
             var truckType = {
                id:truckType,
                descripcion: truckType,                            
                nombre: truckType,
                img: "img.jpg",
                numLlantas:numLlantas
            }
            StorageService.addTruckType(truckType);  
            $scope.truckTypes = $localStorage.truckTypes;
            $scope.closeModal(4);       
        } else {            
            console.log("modo online activado")
             //ONLINE
                        var DataPromise = Data.addTruckType($rootScope.url, $localStorage.languague, truckType, numLlantas)
                        DataPromise.then(function(result) {
                            if (result['message'] == 'success') {
                                //DATOS CARGADOS                                                                                                
                                console.log("Datos cargados con exito")
                                if(result['result']){
                                    console.log("entró a actualizar la lista de truck Models");
                                    $localStorage.truckTypes = result['result'];
                                    $scope.truckTypes = $localStorage.truckTypes;
                                    $scope.data.truckModel = result['id'];
                                }
                                $scope.closeModal(4);
                                //Si está en modo online y se insertó entonces                                
                            } else if (result['message'] == "error") {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $scope.showErrorMessage($translate.instant('INSPECTION_CANNOT_INSERT_THISTORY'))                            
                            } else if (result['message'] == 'truck type already exist') {
                                //DATOS CON ERRORES O INCOMPLETOS
                                $ionicLoading.hide();
                                $scope.showErrorMessage($translate.instant('TRUCK_TRUCK_TYPE_ALREADY_EXIST'));
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
    $scope.addPressure = function(idTruckType, tireSize, layers, psi, maxPsi, minPsi, weight){     
    if(Check.isNull(idTruckType)){
        console.log("es null")
    }
         if ($localStorage.appModeStatus) {
            console.log("modo Offline activado")            
            var pressure = {                
                idTruckType: idTruckType,                           
                layers: layers,
                maxPsi: maxPsi,
                minPsi: minPsi,
                psi: psi,  
                tireSize: tireSize,                          
                weight: weight
            }
            StorageService.addPressure(pressure); 
            $scope.pressureTypes = $localStorage.pressureTypes;
            $scope.closeModal(5);            
        } else {            
            
            console.log("modo online activado")
             //ONLINE
                        var DataPromise = Data.addPressure($rootScope.url, $localStorage.languague, idTruckType, tireSize, layers, psi, maxPsi, minPsi, weight)
                        DataPromise.then(function(result) {
                            if (result['message'] == 'success') {
                                //DATOS CARGADOS                                                                                                
                                console.log("Datos cargados con exito")
                                if(result['result']){
                                    console.log("entró a actualizar la lista de truck Models");
                                    $localStorage.pressureTypes = result['result'];
                                    $scope.pressureTypes = $localStorage.pressureTypes;
                                    $scope.pressureType = result['id'];
                                }
                                $scope.closeModal(5);
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
})