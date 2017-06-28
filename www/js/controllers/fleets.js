angular.module('fleets', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
.controller('FleetCtrl', function($ionicPlatform, ionicMaterialInk, $scope, $localStorage, $translate, $ionicLoading, $ionicPopup, Data, StorageService, $rootScope, $state, $timeout) {
    $scope.data.truckAfter = true;    
    console.log($scope.data.truckAfter)
    $scope.customers = {};
    $scope.fleets = {};
    $scope.countries = {};
    $scope.states = {};
    $scope.cities = {};
    console.log($localStorage.company)
    
        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);
        
        $scope.init = function(){
            $scope.data.truckAfter = true;                       
            console.log($scope.data.truckAfter)
            $scope.customers = $localStorage.customers;
            console.log($localStorage.customers)
            console.log($scope.customers);
            $scope.countries = $localStorage.countries;            
            $scope.states = $localStorage.states;            
            $scope.cities = $localStorage.cities;
            $scope.usertype = $localStorage.usertype;
            $scope.data.companyNameSelected = $localStorage.companyName;
            $scope.company = $localStorage.company;
            console.log($localStorage.company)
            console.log($localStorage.companyName)
            $scope.getCustomerInfo;
        }

        $scope.selectCustomer = function (id) {
            console.log("Se presiono el boton " + id);
            $scope.company = id;
            console.log("Nuevo ID " + $scope.company)
            angular.forEach($localStorage.customers, function(value, key) {
                        if (id == value.id) {
                            $localStorage.companyName = value.nameCompany;
                            $scope.nameCompany = value.nameCompany;
                            $localStorage.customerEmail = value.email;
                        }
                    });
            $scope.data.companyNameSelected = $scope.nameCompany;
            console.log($scope.nameCompany)
            $localStorage.company = id;
            console.log($localStorage.company);
            $scope.$broadcast('scroll.refreshComplete');
        }

        

         $scope.clearSearch = function() {
            console.log("Se presiono el boton para borrar...");
            $scope.data.companyNameSelected = "";
           
        };

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

        $scope.getCountries = function(){
            var DataPromise = Data.getCountriesAll($rootScope.url)
                DataPromise.then(function(result) {                    
                    if (result['countries']) {
                        $scope.countries = result['countries'];
                        $ionicLoading.hide();
                        $scope.cities = null;
                    } else {
                        $ionicLoading.hide();
                    }

                }, function(reason) {
                    $ionicLoading.hide();
                    var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                    $ionicLoading.hide();
                    $scope.showErrorMessage('<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>');
                })
        }

        $scope.getStates = function(id){        
            var DataPromise = Data.getStatesbyId($rootScope.url, id)
                DataPromise.then(function(result) {                    
                    if (result['states']) {
                        $scope.states = result['states'];
                        $ionicLoading.hide();
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
        }

        $scope.getCities = function(id){         
            var DataPromise = Data.getCitiesbyId($rootScope.url, id)
                DataPromise.then(function(result) {                    
                    if (result['cities']) {
                        $scope.cities = result['cities'];
                        $ionicLoading.hide();
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
        }

        $scope.insertFleet = function(company, fleet, street, suburb, fleetCountry, fleetState, fleetCity, phone, email, password, manager, rol) {
            console.log(company + " " + fleet  + " " +  street  + " " + suburb + " " +  fleetCountry + " " +  fleetState + " " +  fleetCity + " " +  phone + " " +  email + " " +  password + " " +  manager + " " +  rol)
            if ($localStorage.appModeStatus) {
                //si el modo offline está activado
                //comparamos si la compañia seleccionada es la misma que    

                var fleet = {                    
                    adminId: $localStorage.userId,
                    calle: street,
                    ciudad: fleetCity,
                    colonia: suburb,
                    email: email,
                    encargado: manager,
                    estado: fleetState,
                    idCliente: company,
                    nombre: fleet,
                    pais: fleetCountry,
                    password: password,
                    roldeCambio: rol,
                    telefono: phone
                }

                StorageService.addFleet(fleet);

                var info = $translate.instant('MSG_INFORMATION')
                var aceptar = $translate.instant('MSG_ACEPTAR')
                var msgSuccess = $translate.instant('FLEET_SAVED_SUCCESSFULY');
                var msgOk = $translate.instant('TIRES_FLEET') + " " + $translate.instant('MSG_SAVED_SUCCESSFULY');

                $ionicLoading.hide();
                $ionicPopup.alert({
                    template: '<center><p><b>' +  msgOk + '</p></center>',
                    okText: aceptar,
                    okType: 'button-balanced'
                });

                if ($scope.data.truckAfter == true){                             
                    $ionicPopup.alert({
                        title: info,
                        template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                        okText: aceptar,
                        okType: 'button-balanced'
                    });
                                
                    $state.go("app.addTruck", {
                        animation: 'slide-in-down'
                    });
                } else if ($scope.data.truckAfter == false) {
                    $ionicPopup.alert({
                    title: info,
                    template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                    okText: aceptar,
                    okType: 'button-balanced'
                    });
                    
                    $state.go("app.dashboard", {
                        animation: 'slide-in-down'
                    });
                }          
                /*
                $state.go("app.dashboard", {
                    animation: 'slide-in-down'
                }); */


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


                var DataPromise = Data.insertFleet($rootScope.url, $localStorage.languague, company, fleet, street, suburb, fleetCity, fleetState, fleetCountry, phone, email, password, $localStorage.userId, manager, rol)
                console.log(company + " " + fleet  + " " + street  + " " + suburb  + " " + fleetCity  + " " + fleetState  + " " + fleetCountry  + " " + phone  + " " + email  + " " + password  + " " + $localStorage.userId  + " " + manager  + " " + rol);
                DataPromise.then(function(result) {
                        if (result['message'] == 'success') {
                            //DATOS CARGADOS
                            $ionicLoading.hide();


                            var info = $translate.instant('MSG_INFORMATION');
                            var aceptar = $translate.instant('MSG_ACEPTAR');
                            var msgSuccess = $translate.instant('FLEET_SAVED_SUCCESSFULY');
                            var tryAgain = $translate.instant('MSG_TRY_AGAIN');


                            $ionicPopup.alert({
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-balanced'
                            });

                            /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                            if($localStorage.company){
                                $scope.selectCliente($localStorage.company)
                            } else {
                                console.log("POR ALGUNA RAZON COMPANY IS undefined")
                            }
                            
                            if ($scope.data.truckAfter == true){                             
                                $ionicPopup.alert({
                                    title: info,
                                    template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                    okText: aceptar,
                                    okType: 'button-balanced'
                                });
                                
                                 $state.go("app.addTruck", {
                                    animation: 'slide-in-down'
                                });
                            } else if ($scope.data.truckAfter == false) {
                                $ionicPopup.alert({
                                title: info,
                                template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
                                okText: aceptar,
                                okType: 'button-balanced'
                                });
                                $state.go("app.dashboard", {
                                    animation: 'slide-in-down'
                                });
                            }          

                            /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
                            /*$state.go("app.dashboard", {
                                animation: 'slide-in-down'
                            });*/
                           
                        } else if (result['message'] == 'error') {
                            //DATOS CON ERRORES O INCOMPLETOS
                            $ionicLoading.hide();

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
                        console.log($localStorage.fleets);
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
                        /*$state.go('app.dashboard', {
                            animation: 'slide-in-down'
                        });*/

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
    $scope.getCustomerInfo = function(){
        var DataPromise = Data.custInfoData($rootScope.url, $localStorage.userId, $localStorage.company)
                DataPromise.then(function(result) {                    
                    if(result['message'] == "User found") { 
                        $scope.street = result['calle']
                        $scope.email = result['correo']
                        $scope.company = result['idCompany']
                        $scope.fleet = result['nameCompany']
                        $scope.password = result['password']
                        $scope.manager = result['encargado']
                        $scope.phone = result['phone']
                        $ionicLoading.hide();
                    } else if (result['message'] == "User invalid") {
                         alert("USUARIO INVALIDO")
                         // http://www.querisa.co/uploads/2032.jpg 
                         $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                    }

                }, function(reason) {
                    $ionicLoading.hide();
                    $scope.showErrorMessage($translate.instant('MSG_ERROR_CONEXION') + ' ' + $translate.instant('MSG_TRY_AGAIN'));
                })
    }
})
