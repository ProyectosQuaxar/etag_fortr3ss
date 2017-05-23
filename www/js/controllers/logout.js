
angular.module('logout', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('logoutCtrl', function($ionicPlatform, $scope, Data, $rootScope, $localStorage, $route, $state, $ionicSideMenuDelegate, $ionicHistory, $timeout) {

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
        $scope.init = function() {
            localStorage.removeItem('ngStorage-cliente');
            $localStorage.rol = ''
            $localStorage.userId = ''
            $localStorage.customers = ''
            $localStorage.navBarVisible = 'none'
            $localStorage.allFleets = ''
            $localStorage.truckBrands = ''
            $localStorage.truckModels = ''
            $localStorage.truckTypes = ''
            $localStorage.trucks = ''
            $localStorage.fleets = ''
            $localStorage.pressureTypes = ''
            $localStorage.tires = ''
            $localStorage.totalTrucks = ''
            $localStorage.totalTruckTypes = ''
            $localStorage.totalTruckBrands = ''
            $localStorage.totalTires = ''
            $localStorage.totalPressureTypes = ''
            $localStorage.totalModels = ''
            $localStorage.cities = ''
            $localStorage.company = ''
            $localStorage.companyName = ''
            $localStorage.reportLevel = ''
            $localStorage.states = ''
            $localStorage.tireBrands = ''
            $localStorage.tireModels = ''
            $localStorage.tireSizes = ''
            $localStorage.totalFleets = ''
            $localStorage.username = ''
            $localStorage.countries = ''
            $localStorage.tireConditions = ''
            $localStorage.customerEmail = ''
            $localStorage.fechas = ''
            $localStorage.idFlota = ''
            $localStorage.idSemaforos = ''
            $localStorage.idsSemaforosBlanco = ''
            $localStorage.idsSemaforosVerde = ''
            $localStorage.idsSemaforosAmarillo = ''
            $localStorage.idsSemaforosRojo = ''
            $localStorage.storageSemaphoreInspections = []
            $localStorage.storageTireInspections = []
            $localStorage.storageTires = []
            $localStorage.inspectionTrucks = []
            $localStorage.storageTrucks = []
            $localStorage.appModeStatus = false;
            $scope.data.display = $localStorage.navBarVisible;

            $ionicHistory.clearCache().then(function() {
                $state.go('app.login', {
                    animation: 'slide-in-down'
                });
            });
        }
    })