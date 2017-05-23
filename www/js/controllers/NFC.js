angular.module('NFC', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
.controller('NFCCtrl', ['$scope', '$window', '$timeout','$localStorage','$ionicLoading','$ionicPopup','$translate', function ($scope, $window, $timeout, $localStorage, $ionicLoading, $ionicPopup, $translate) {
    
                $scope.write, $scope.erase;

                function reset() {
                    $timeout(function () {
                        $scope.write = false;
                        $scope.erase = false;
                    });
                }

                if ($window.cordova) {
                    ionic.Platform.ready(function () {
                        // tag discovered listener
                        nfc.addTagDiscoveredListener(function () {
                            console.log('Discovered', arguments);
                        }, function () {
                            console.log('#ADDED: TagDiscoveredListener');
                        }, function () {
                            console.log('!#NOTADDED: TagDiscoveredListener');
                        });

                        // ndef is read
                        nfc.addNdefListener(function (evt) {
                            console.log('Read Ndef', evt);
                            $timeout(function () {
                                $scope.nfc = evt;
                            });
                            if ($scope.write) {
                                nfc.write([ndef.textRecord($scope.data.tagValue)], function () {
                                    var msg = $translate.instant('NFC_WRITE_TAG_SUCCESSFULY')
                                    var aceptar = $translate.instant('MSG_ACEPTAR')
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        template: '<center><p><b>' + msg + '</p></center>',
                                        okText: aceptar,
                                        okType: 'button-balanced'
                                    });                                     
                                    reset();
                                }, function () {
                                    var msg = $translate.instant('NFC_WRITE_TAG_ERROR')
                                    var aceptar = $translate.instant('MSG_ACEPTAR')
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        template: '<center><p><b>' + msg + '</p></center>',
                                        okText: aceptar,
                                        okType: 'button-assertive'
                                    });
                                    reset();
                                });
                            } else if ($scope.erase) {
                                nfc.erase(function () {
                                    var msg = $translate.instant('NFC_ERASE_TAG_SUCCESSFULY')
                                    var aceptar = $translate.instant('MSG_ACEPTAR')
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        template: '<center><p><b>' + msg + '</p></center>',
                                        okText: aceptar,
                                        okType: 'button-balanced'
                                    });
                                    reset();
                                }, function () {
                                    var msg = $translate.instant('NFC_ERASE_TAG_ERROR')
                                    var aceptar = $translate.instant('MSG_ACEPTAR')
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        template: '<center><p><b>' + msg + '</p></center>',
                                        okText: aceptar,
                                        okType: 'button-assertive'
                                    });
                                    reset();
                                });
                            }
                        }, function () {
                            console.log('#ADDED: addNdefListener');
                        }, function () {
                            console.log('!#NOTADDED: addNdefListener');
                        });
                    });

                    $scope.writer = function () {
                    	console.log("entro a writer")
                        $scope.write = true;
                    };

                    $scope.clearer = function () {
                    	console.log("entro a clear")
                        $scope.erase = true;
                    };

                    $scope.canceler = function () {
                    	console.log("entro a canceler")
                        reset();
                    };

                }

                $scope.manualWrite = function(){
                    $scope.data.tagCamion = $scope.data.tagValue;
                }

                $scope.init = function(){
                	$scope.trucks = $localStorage.trucks;
                    $scope.data.pos = 1;
                }

                $scope.getTag = function(tagValue){
                	$scope.data.tagValue = tagValue;
                }

                $scope.getNumberTag = function(tagValue){
                    var numberTag = tagValue
                    numberTag = numberTag.replace(/[^0-9]/gi, '');
                    $scope.data.tagValue = numberTag;
                    $scope.data.tagCamion = numberTag;
                }

                $scope.inc = function(){
                    var position = parseInt($scope.data.pos);
                    $scope.data.pos = position + 1;
                    if($scope.data.tagCamion === undefined){
                        if($scope.data.tagValue !== undefined){
                            $scope.data.tagCamion = $scope.data.tagValue;
                        } else {
                            var msgError = $translate.instant('NFC_WRITE_TAG')
                            var popTitle = $translate.instant('MSG_ERROR')
                            var aceptar = $translate.instant('MSG_ACEPTAR')
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: popTitle,
                                template: '<center><p><b>' + msgError + '</p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });                            
                        }
                    } else {
                        $scope.data.tagValue = $scope.data.tagCamion + (position < 10 ? '0' : '') + position;
                    }
                }

                $scope.dec = function(){
                    var position = parseInt($scope.data.pos);
                    if(position > 1){
                        $scope.data.pos = position - 1;
                    }
                    if($scope.data.tagCamion === undefined){
                        if($scope.data.tagValue !== undefined){
                            $scope.data.tagCamion = $scope.data.tagValue;
                        } else {
                            var msgError = $translate.instant('NFC_WRITE_TAG')                            
                            var popTitle = $translate.instant('MSG_ERROR')
                            var aceptar = $translate.instant('MSG_ACEPTAR')
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: popTitle,
                                template: '<center><p><b>' + msgError + '</p></center>',
                                okText: aceptar,
                                okType: 'button-assertive'
                            });                            
                        }
                    } else {
                        $scope.data.tagValue = $scope.data.tagCamion + (position < 10 ? '0' : '') + position;
                    }
                    
                }
}]);