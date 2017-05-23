angular.module('inspectionMode', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('InspectionModeCtrl', function($ionicPlatform, $scope, $localStorage, $timeout) {
        
        $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);

        $scope.init = function() {
            if ($localStorage.inspectionMode === undefined) {
                $localStorage.inspectionMode = 'Manual';
                $scope.data.modeDevice = 'Manual'
            } else {
                modeDevice = $localStorage.inspectionMode
            }
        }

        $scope.modeDeviceSelected = function(modeDevice) {

            $localStorage.inspectionMode = modeDevice;
        }
    })