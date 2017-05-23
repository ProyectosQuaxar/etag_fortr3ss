angular.module('login', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])  
	    .controller('LoginCtrl', function($ionicPlatform, $scope, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $localStorage, $translate, $ionicLoading, Data, $ionicPopup, $ionicHistory, $state, $rootScope, $timeout, Check) {        
        $scope.data = {};
        $scope.username = {};

        $scope.$on('$ionicView.enter', function() {
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function() {
            $ionicSideMenuDelegate.canDragContent(true);
        });
        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);

        $scope.ChangeLanguage = function(lang) {
            $localStorage.languague = lang;
            $translate.use(lang);
            $scope.data.languague = $localStorage.languague;
        }

        $scope.isValid = function(value) {
            return !value
        }        

        $scope.init = function() {
            $scope.data.languague = $localStorage.languague;
            if (angular.isNumber($localStorage.userId)) {
                $ionicHistory.clearCache().then(function() {
                    $state.go('app.dashboard', {
                        animation: 'slide-in-down'
                    });
                });
            }
            $localStorage.navBarVisible = "none;"
            $scope.data.display = $localStorage.navBarVisible;
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

        $scope.login = function() {
            var error = $translate.instant('MSG_ERROR');
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

            $localStorage.usertype = $scope.data.usertype;

            var DataPromise = Data.login($rootScope.url, $scope.data.username, $scope.data.password)

            DataPromise.then(function(result) {
                var json_data = result;
                if (json_data['exists'].toString() == '1') {                	
                    $localStorage.rol = json_data['role']
                    $localStorage.userId = json_data['userId']
                    $localStorage.company = json_data['company']
                    $localStorage.usertype = json_data['usertype']
                    $localStorage.reportLevel = json_data['reportLevel']

                    $localStorage.customers = json_data['customers']
                    $localStorage.truckBrands = json_data['truckBrands']
                    $localStorage.truckModels = json_data['truckModels']
                    $localStorage.truckTypes = json_data['truckTypes']
                    $localStorage.allFleets = json_data['allFleets']
                    $localStorage.pressureTypes = json_data['pressureTypes']
                    $localStorage.states = json_data['states']
                    $localStorage.countries = json_data['countries']
                    $localStorage.cities = json_data['cities']
                    $localStorage.tireBrands = json_data['tireBrands']
                    $localStorage.tireSizes = json_data['tireSizes']
                    $localStorage.tireModels = json_data['tireModels']
                    $localStorage.tireConditions = json_data['tireConditions']

                    $scope.rol = $localStorage.rol;
                    $localStorage.username = $scope.data.username
                    $scope.username = $localStorage.username;
                    $scope.company = $localStorage.company;
                    $scope.customers = $localStorage.customers;

                    $ionicLoading.hide();
                    $ionicHistory.clearCache().then(function() {
                        $state.go('app.dashboard', {
                            animation: 'slide-in-down'
                        });
                    });
                } else if (json_data['exists'].toString() == '0') {                 	
                	if(json_data['status'].toString() == 'TRIAL continue'){
                		$ionicLoading.hide();
                		console.log("PRUEBA CONTINÚA")
                	} else if(json_data['status'].toString() == 'TRIAL is finished'){
						$ionicLoading.hide();
                		$scope.showErrorMessage($translate.instant("LOGIN_TRIAL_HAS_FINISHED"));
                	} else if(json_data['status'].toString() == 'unknown user'){
						$ionicLoading.hide();
                		$scope.showErrorMessage($translate.instant("LOGIN_USER_NOT_REGISTRED") + "<br>" + $translate.instant("MSG_ERROR_PASSWORD"));
                	} 


                } else {
                    $scope.showErrorMessage($translate.instant("LOGIN_USER_NOT_REGISTRED") + "<br>" + $translate.instant("MSG_ERROR_PASSWORD"));
                }
            }, function(reason) {
                var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: error,
                    template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                    okText: aceptar,
                    okType: 'button-assertive'
                });
            });
        }

        $scope.refreshCatalogs = function() {
            var error = $translate.instant('MSG_ERROR');
            var aceptar = $translate.instant('MSG_ACEPTAR');
            var title = $translate.instant('MSG_INFORMATION');

            var loading = $translate.instant('MSG_LOADING');
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                content: loading,
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var DataPromise = Data.refreshCatalogs($rootScope.url)

            DataPromise.then(function(result) {
                var json_data = result;
                if (json_data['exists'].toString() == '1') {0
                    $localStorage.rol = json_data['role']
                    $localStorage.userId = json_data['userId']
                    $localStorage.company = json_data['company']
                    $localStorage.reportLevel = json_data['reportLevel']

                    $localStorage.customers = json_data['customers']
                    $localStorage.truckBrands = json_data['truckBrands']
                    $localStorage.truckModels = json_data['truckModels']
                    $localStorage.truckTypes = json_data['truckTypes']
                    $localStorage.allFleets = json_data['allFleets']
                    $localStorage.pressureTypes = json_data['pressureTypes']
                    $localStorage.states = json_data['states']
                    $localStorage.countries = json_data['countries']
                    $localStorage.cities = json_data['cities']
                    $localStorage.tireBrands = json_data['tireBrands']
                    $localStorage.tireSizes = json_data['tireSizes']
                    $localStorage.tireModels = json_data['tireModels']
                    $localStorage.tireConditions = json_data['tireConditions']

                    $scope.rol = $localStorage.rol;
                    $localStorage.username = $scope.data.username
                    $scope.username = $localStorage.username;
                    $scope.company = $localStorage.company;
                    $scope.customers = $localStorage.customers;


                    var countTruckBrands
                    if ($localStorage.truckBrands !== undefined) {
                        countTruckBrands = $localStorage.truckBrands;
                        var totalTruckBrands = Object.keys(countTruckBrands).length;
                        $localStorage.totalTruckBrands = totalTruckBrands;
                        $scope.totalTruckBrands = totalTruckBrands;
                    }

                    var countTruckTypes
                    if ($localStorage.truckTypes !== undefined) {
                        countTruckTypes = $localStorage.truckTypes;
                        var totalTruckTypes = Object.keys(countTruckTypes).length;
                        $localStorage.totalTruckTypes = totalTruckTypes;
                        $scope.totalTruckTypes = totalTruckTypes;
                    }

                    var countTruckModels
                    if ($localStorage.truckModels !== undefined) {
                        countTruckModels = $localStorage.truckModels;
                        var totalTruckModels = Object.keys(countTruckModels).length;
                        $localStorage.totalModels = totalTruckModels;
                        $scope.totalTruckModels = totalTruckModels;
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

                    var countTireBrands = 0;
                    if ($localStorage.tireBrands !== undefined) {
                        countTireBrands = $localStorage.tireBrands;
                        var totalTireBrands = Object.keys(countTireBrands).length;                        
                        $scope.totalTireBrands = totalTireBrands;
                    } else {
                        $scope.totalTireBrands = 0;
                    }

                    var countFleetsToSubmit = 0;
                    if ($localStorage.storageFleets !== undefined) {
                        countFleetsToSubmit = $localStorage.storageFleets;
                        var totalFleetsToSubmit = Object.keys(countFleetsToSubmit).length;                        
                        $scope.totalFleetsToSubmit = totalFleetsToSubmit;
                    } else {
                        $scope.totalFleetsToSubmit = 0;
                    }          

                    var countPressureTypes
                    if ($localStorage.pressureTypes !== undefined) {
                        countPressureTypes = $localStorage.pressureTypes;
                        var totalPressureTypes = Object.keys(countPressureTypes).length;
                        $localStorage.totalPressureTypes = totalPressureTypes;
                        $scope.totalPressureTypes = totalPressureTypes;
                    }


                    $ionicLoading.hide();
                    
                    var msg = $translate.instant("DASHBOARD_CATALOGS_UPDATES_SUCCESFULLY");
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: title,
                        template: '<center><p><b>' + msg + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-positive'
                    });
                } else {
                    var msgError = $translate.instant('MSG_ERROR_PASSWORD');
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: error,
                        template: '<center><p><b>' + msgError + '</b></p></center>',
                        okText: aceptar,
                        okType: 'button-assertive'
                    });
                }
            }, function(reason) {
                var errorConexion = $translate.instant('MSG_ERROR_CONEXION');
                var tryAgain = $translate.instant('MSG_TRY_AGAIN');
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: error,
                    template: '<center><p>' + errorConexion + '<br/><b>' + tryAgain + '</b></p></center>',
                    okText: aceptar,
                    okType: 'button-assertive'
                });
            });
        }
    })