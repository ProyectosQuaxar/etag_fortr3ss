angular.module('config', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])

.controller('ConfigCtrl', function(ionicMaterialInk, $scope, $localStorage, $translate, $timeout) {
      	
    $scope.ChangeLanguage = function(lang) {
        $localStorage.languague = lang;
        $translate.use(lang);
    }
})    
