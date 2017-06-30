angular.module('NFC', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
.controller('NFCCtrl', ['$scope', '$window', '$timeout','$localStorage','$ionicLoading','$ionicPopup','$translate', function ($scope, $window, $timeout, $localStorage, $ionicLoading, $ionicPopup, $translate) {
    
                $scope.write, $scope.erase;
                $scope.truckTiresNumber = "";
                $scope.truckType = "";
                $scope.data.pos = 1;
                $scope.tagLlanta = "";
                $scope.showButtons = false;
                

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

                


                $scope.init = function(){
                    console.log("Entramos a init")
                	$scope.trucks = $localStorage.trucks;
                    console.log($scope.trucks)
                    $scope.data.pos = 1;
                    $scope.$broadcast('scroll.refreshComplete');   
                }

                $scope.getTag = function(tagValue){
                	$scope.data.tagValue = tagValue;
                    console.log("A buscar..." + tagValue)
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tagValue){
                           console.log(value.tipo);
                           $scope.truckType = value.tipo;                            
                        }
                    }); 

                    angular.forEach($localStorage.truckTypes, function(value, key) {                            
                        if(value.id == $scope.truckType){
                           console.log(value.id);
                           $scope.truckTiresNumber = value.numLlantas;                            
                           console.log("Se detecta el número de llantas: " + $scope.truckTiresNumber);
                        }
                    }); 
                    

                }

                $scope.getNumberTag = function(tagValue){
                    var numberTag = tagValue
                    console.log(numberTag);
                    numberTag = numberTag.replace(/[^0-9]/gi, '');
                    $scope.data.tagValue = numberTag;
                    $scope.data.tagCamion = numberTag;
                    $scope.data.pos = 1;

                    console.log("A buscar..." + tagValue)
                    angular.forEach($localStorage.trucks, function(value, key) {                            
                        if(value.tag == tagValue){
                           console.log(value.tipo);
                           $scope.truckType = value.tipo;                            
                        }
                    }); 

                    angular.forEach($localStorage.truckTypes, function(value, key) {                            
                        if(value.id == $scope.truckType){
                           console.log(value.id);
                           $scope.truckTiresNumber = value.numLlantas;                            
                           console.log("Se detecta el número de llantas: " + $scope.truckTiresNumber);
                        }
                    }); 
                }

                $scope.inc = function(){
                    var position = parseInt($scope.data.pos);  
                    console.log(position)
                    console.log("Posición: " + $scope.data.pos)
                    console.log("Número de llantas: " + $scope.truckTiresNumber);
                    if ($scope.data.pos <= $scope.truckTiresNumber ){
                        console.log("Posicion actual ->" + $scope.data.pos)

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
                        $scope.data.pos = position + 1;
                        console.log("Nueva posicion ->" + $scope.data.pos)
                    }   if ($scope.data.pos > $scope.truckTiresNumber ) {
                        $scope.data.pos = $scope.data.pos - 1;
                        console.log("No se puede incrementar mas..." + $scope.data.pos);
                    }
                }

                $scope.dec = function(){
                    console.log(position)
                    console.log("Posición: " + $scope.data.pos)
                    console.log("Número de llantas: " + $scope.truckTiresNumber);
                    
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

                $scope.getDataTruck = function(){

                }


}]);