angular.module('dashboard', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('DashboardCtrl', function($ionicPlatform, ionicMaterialInk, $scope, $localStorage, $ionicModal, $ionicHistory, $window, $translate, $ionicLoading, Data, $ionicPopup, $state, $rootScope, $cordovaBluetoothSerial, $timeout) {              
        $scope.data.username = {};
        $scope.customers = {};
        $scope.changeCompany = false;
        $scope.totalSubmit = 0;
        $scope.inspectionMode = '';
        $scope.dataTrucks = false;
        $scope.dataTires = false;
        $scope.search = "";
        
        $ionicPlatform.offHardwareBackButton(function() {
            console.log("Hola"); 
        });

        $ionicPlatform.registerBackButtonAction(function(event) {
            if (true) { // your check here
              $ionicPopup.confirm({
                template: $translate.instant('DASHBOARD_EXIT')
              }).then(function(res) {
                if (res) {
                  ionic.Platform.exitApp();
                }
              })
            }
        }, 100);

        $scope.clearSearch = function() {
            console.log("Se presiono el boton para borrar...");
            $scope.data.search = "";
        };

        $scope.selectCompany = function(company) {
            console.log("Se presiono un elemento de la lista");
            console.log(company);            
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
  
        $scope.chooseOption = function() {
            var totalToSubmit = 0;


            var countTruckToSubmit = 0;
            if ($localStorage.storageTrucks !== undefined) {
                countTruckToSubmit = $localStorage.storageTrucks;
                var totalTruckToSubmit = Object.keys(countTruckToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckToSubmit;
                $scope.totalTruckToSubmit = totalTruckToSubmit;
            } else {
                $scope.totalTruckToSubmit = 0;
            }

            var countFleetsToSubmit = 0;
            if ($localStorage.storageFleets !== undefined) {
                countFleetsToSubmit = $localStorage.storageFleets;
                var totalFleetsToSubmit = Object.keys(countFleetsToSubmit).length;
                totalToSubmit = totalToSubmit + totalFleetsToSubmit;
                $scope.totalFleetsToSubmit = totalFleetsToSubmit;
            } else {
                $scope.totalFleetsToSubmit = 0;
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

            var countInspectionsToSubmit = 0;
            if ($localStorage.storageSemaphoreInspections !== undefined) {
                countInspectionsToSubmit = $localStorage.storageSemaphoreInspections;
                var totalInspectionsToSubmit = Object.keys(countInspectionsToSubmit).length;
                totalToSubmit = totalToSubmit + totalInspectionsToSubmit;
                $scope.totalInspectionsToSubmit = totalInspectionsToSubmit;
            } else {
                $scope.totalInspectionsToSubmit = 0;
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

            var countCustomersToSubmit = 0;
            if ($localStorage.storageCustomers !== undefined) {
                countCustomersToSubmit = $localStorage.storageCustomers;
                var totalCustomersToSubmit = Object.keys(countCustomersToSubmit).length;
                totalToSubmit = totalToSubmit + totalCustomersToSubmit;
                $scope.totalCustomersToSubmit = totalCustomersToSubmit;
            } else {
                $scope.totalCustomersToSubmit = 0;
            }

            $scope.data.totalSubmit = totalToSubmit;

            var currentPlatform = ionic.Platform.platform();

            if (currentPlatform != "win32") {
                bluetoothSerial.isEnabled(function() {
                    $localStorage.bluetooth = true;
                }, function(reason) {
                    $localStorage.bluetooth = false;
                });
                $scope.data.bluetooth = $localStorage.bluetooth;
            } else {
                $scope.data.bluetooth = 'false'
            }

            $scope.data.inspectionMode = $localStorage.inspectionMode;
            if ($scope.data.inspectionMode === undefined) {
                $scope.data.inspectionMode = "Manual"
            }
            if ($localStorage.languague === undefined) {
                $localStorage.languague = 'es'
            } else {
                $scope.languague = $localStorage.languague;
                $scope.data.languague = $localStorage.languague;
            }

        }

        $scope.toggleCompany = function() {
            $scope.changeCompany = !$scope.changeCompany;
        };

        $scope.toggleCustomer = function() {
            $scope.dataCustomer = !$scope.dataCustomer;
            $scope.dataTrucks = false;
            $scope.dataTires = false;
        }
        $scope.toggleTrucks = function() {
            $scope.dataTrucks = !$scope.dataTrucks;
            $scope.dataCustomer = false;
            $scope.dataTires = false;
            $scope.trucks = $localStorage.trucks;
        }
        $scope.toggleTires = function() {
            $scope.dataTires = !$scope.dataTires;
            $scope.dataCustomer = false;
            $scope.dataTrucks = false;
            $scope.tires = $localStorage.tires;
        }
        $scope.gotoStart = function() {
            $ionicHistory.clearCache().then(function() {
                $state.go('app.dashboard', {
                animation: 'slide-in-down'
                });
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
       
        $scope.init = function() {
            $scope.data.email = $localStorage.username;
            $scope.data.rol = $localStorage.rol;
            $scope.data.appModeStatus = $localStorage.appModeStatus;
            $scope.data.languague = $localStorage.languague;
            $scope.data.companyNameSelected = $localStorage.companyName;
            $scope.data.usertype = $localStorage.usertype;
            $scope.changeCompany = false;
            $scope.dataCustomer = false;
            $localStorage.navBarVisible = 'block'
            $scope.data.display = $localStorage.navBarVisible;
            $scope.customers = {};
            $scope.customers = $localStorage.customers;
            $scope.states = $localStorage.states;
            $scope.countries = $localStorage.countries;
            $scope.cities = $localStorage.cities;
            $scope.companyId = $localStorage.company;
            $scope.nameCompany = $localStorage.companyName;
            $scope.totalTrucks = $localStorage.totalTrucks;
            $scope.totalFleets = $localStorage.totalFleets;
            $scope.totalTires = $localStorage.totalTires;
            $scope.reportLevel = $localStorage.reportLevel;
            $scope.company = $localStorage.company;
            $scope.data.totalSubmit = 0;            
            
            $scope.pressureTypes = $localStorage.pressureTypes;
            $scope.truckTypes = $localStorage.truckTypes;
            $scope.truckModels = $localStorage.truckModels;
            $scope.tireBrands = $localStorage.tireBrands;
            $scope.tireSizes = $localStorage.tireSizes;
            $scope.tireModels = $localStorage.tireModels;
            $scope.totalReceive = 0;

            console.log("cliente? " + $localStorage.companyName)
            if($localStorage.companyName !== undefined){
                $scope.totalReceive += 1;
            }
            if ($scope.totalTrucks !== undefined) {
                $scope.totalReceive += $scope.totalTrucks;
            }
            if ($scope.totalFleets !== undefined) {
                $scope.totalReceive += $scope.totalFleets;
            }
            if ($scope.totalTires !== undefined) {
                $scope.totalReceive += $scope.totalTires;
            }

            console.log("total? " + $scope.totalReceive)

            if (!$scope.company) {
                $scope.company = $localStorage.comp;
                $scope.changeCompany = true;
            } else {
                $scope.changeCompany = false;
            }


            var countTruckBrands
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

            /***********CONTEO DE DATOS ALMACENADOS*******************/
            var totalToSubmit = 0;

            var countTruckToSubmit = 0;
            if ($localStorage.storageTrucks !== undefined) {
                countTruckToSubmit = $localStorage.storageTrucks;
                var totalTruckToSubmit = Object.keys(countTruckToSubmit).length;
                totalToSubmit = totalToSubmit + totalTruckToSubmit;
                $scope.totalTruckToSubmit = totalTruckToSubmit;
            } else {
                $scope.totalTruckToSubmit = 0;
            }

            var countFleetsToSubmit = 0;
            if ($localStorage.storageFleets !== undefined) {
                countFleetsToSubmit = $localStorage.storageFleets;
                var totalFleetsToSubmit = Object.keys(countFleetsToSubmit).length;
                totalToSubmit = totalToSubmit + totalFleetsToSubmit;
                $scope.totalFleetsToSubmit = totalFleetsToSubmit;
            } else {
                $scope.totalFleetsToSubmit = 0;
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

            var countInspectionsToSubmit = 0;
            if ($localStorage.storageSemaphoreInspections !== undefined) {
                countInspectionsToSubmit = $localStorage.storageSemaphoreInspections;
                var totalInspectionsToSubmit = Object.keys(countInspectionsToSubmit).length;
                totalToSubmit = totalToSubmit + totalInspectionsToSubmit;
                $scope.totalInspectionsToSubmit = totalInspectionsToSubmit;
            } else {
                $scope.totalInspectionsToSubmit = 0;
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

            var countCustomersToSubmit = 0;
            if ($localStorage.storageCustomers !== undefined) {
                countCustomersToSubmit = $localStorage.storageCustomers;
                var totalCustomersToSubmit = Object.keys(countCustomersToSubmit).length;
                totalToSubmit = totalToSubmit + totalCustomersToSubmit;
                $scope.totalCustomersToSubmit = totalCustomersToSubmit;
            } else {
                $scope.totalCustomersToSubmit = 0;
            }


            var countTireBrands = 0;
            if ($localStorage.tireBrands !== undefined) {
                countTireBrands = $localStorage.tireBrands;
                var totalTireBrands = Object.keys(countTireBrands).length;
                $scope.totalTireBrands = totalTireBrands;
            } else {
                $scope.totalTireBrands = 0;
            }


            var countTireSizes = 0;
            if ($localStorage.tireSizes !== undefined) {
                countTireSizes = $localStorage.tireSizes;
                var totalTireSizes = Object.keys(countTireSizes).length;
                $scope.totalTireSizes = totalTireSizes;
            } else {
                $scope.totalTireSizes = 0;
            }

            var countTireModels = 0;
            if ($localStorage.tireModels !== undefined) {
                countTireModels = $localStorage.tireModels;
                var totalTireModels = Object.keys(countTireModels).length;
                $scope.totalTireModels = totalTireModels;
            } else {
                $scope.totalTireModels = 0;
            }          

            $scope.data.totalSubmit = totalToSubmit;
            /***********CONTEO DE DATOS ALMACENADOS*******************/

            /***********DATOS ALMACENADOS DEL CLIENTE*******************/
            $scope.customers = $localStorage.customers;
            $scope.flotas = $localStorage.fleets;

            /***********DATOS ALMACENADOS DEL CLIENTE*******************/


            if ($localStorage.classNavBar === undefined) {
                $localStorage.classNavBar = 'bar-assertive';
            }
            $scope.data.classNavBar = $localStorage.classNavBar;
            angular.forEach($localStorage.customers, function(value, key) {
                if ($scope.company == value.id) {
                    $scope.nameCompany = value.nameCompany;
                }
            });

            $scope.data.inspectionMode = $localStorage.inspectionMode;
            if ($scope.data.inspectionMode === undefined) {
                $scope.data.inspectionMode = "Manual"
            }

            /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/
            if($localStorage.company){
                $scope.selectCliente($localStorage.company)
            } else {
                console.log("POR ALGUNA RAZON COMPANY IS undefined")
            }
            /************ ACTUALIZAMOS LOS DATOS DE ESTE CLIENTE **********/

            $ionicHistory.clearCache().then(function() {
                $state.go('app.dashboard', {
                animation: 'slide-in-down'
                });
            });
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.selectOffline = function(val) {
            if (val) {
                $localStorage.classNavBar = 'bar-royal';
                $scope.data.classNavBar = $localStorage.classNavBar;
                $localStorage.appModeStatus = val;
                $scope.data.appModeStatus = val;
            } else {
                $localStorage.classNavBar = 'bar-assertive';
                $scope.data.classNavBar = $localStorage.classNavBar;
                $localStorage.appModeStatus = val;
                $scope.data.appModeStatus = val;
            }
        }

        $scope.selectCliente = function(company) {
            console.log(company)
            if (!$localStorage.appModeStatus) {
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
                    console.log("Comienza el loading...")
                    

                    var DataPromise = Data.allTrucksTiresByFleet($rootScope.url, company)
                    console.log("Entramos al data promise...")
                     $timeout(function() {
                            console.log("pasamos por acá y hacemos tiempo");                                
                              }, 4000);
                    DataPromise.then(function(result) {

                        console.log("Despues del data promise, aquí ya se realizo la petición...")
                        

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
                            
                            if($localStorage.companyName !== undefined){
                                $scope.totalReceive += 1;
                            }

                             $timeout(function() {
                                console.log("hacemos tiempo... por segunda ocasión");
                                $ionicLoading.hide();
                              }, 4000);
                             
                            //$ionicLoading.hide();
                            $scope.data.search = "";
                            $scope.changeCompany = false;
                            $state.go('app.dashboard', {
                                animation: 'slide-in-down'
                            });

                        } else {
                            console.log("Algo fallo al cargar datos...")
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
<<<<<<< HEAD
                         $timeout(function() {
                            console.log("En caso de error")
                                 $ionicLoading.hide();
                              }, 2000);
                        //$ionicLoading.hide();
=======
                        $scope.selectClienteTimeout(company)
                    })
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }
        }

        $scope.selectClienteTimeout = function(company) {
            var DataPromise = Data.allTrucksTiresByFleetTimeout($rootScope.url, company)
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
                            
                            if($localStorage.companyName !== undefined){
                                $scope.totalReceive += 1;
                            }

                            $ionicLoading.hide();
                            $scope.data.search = "";
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
>>>>>>> 98e2e630ab9fbc94755c02b51871403d890cf2a4
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
    })