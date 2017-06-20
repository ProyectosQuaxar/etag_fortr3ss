angular.module('starter.controllers', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])

.run(function($localStorage, $window, $translate, $ionicPlatform, $rootScope, $cordovaBluetoothSerial) {
    //$rootScope.baseurl = 'http://10.6.159.7:8090/millantarfid/';
    //$rootScope.url = 'http://10.6.159.7:8090/millantarfid/mobileApp/';
    //$rootScope.urlCustomer = 'http://10.6.159.7:8090/millantarfid/mobileUserApp/';

    //$rootScope.baseurl = 'http://10.6.159.7:8090/millantarfid/';
    //$rootScope.url = 'http://10.6.159.7:8090/millantarfid/mobileApp/';
    //$rootScope.urlCustomer = 'http://10.6.159.7:8090/millantarfid/mobileUserApp/';
    
    $rootScope.baseurl = 'http://millantacamion.com/millantarfid/';
    $rootScope.url = 'http://millantacamion.com/millantarfid/mobileApp/';
    $rootScope.urlCustomer = 'http://millantacamion.com/millantarfid/mobileUserApp/';

    if ($localStorage.storageTrucks == '' || $localStorage.storageTrucks === undefined)
        $localStorage = $localStorage.$default({storageTrucks: []});

    if ($localStorage.storageTires == '' || $localStorage.storageTires === undefined)
        $localStorage = $localStorage.$default({storageTires: []});

    if ($localStorage.storageFleets == '' || $localStorage.storageFleets === undefined)
        $localStorage = $localStorage.$default({storageFleets: []});
    
    if ($localStorage.storageCustomers == '' || $localStorage.storageCustomers === undefined)
        $localStorage = $localStorage.$default({storageCustomers: []});

    if ($localStorage.storageSemaphoreInspections == '' || $localStorage.storageSemaphoreInspections === undefined)
        $localStorage = $localStorage.$default({storageSemaphoreInspections: []});

    if ($localStorage.storageTireInspections == '' || $localStorage.storageTireInspections === undefined)
        $localStorage = $localStorage.$default({storageTireInspections: []});

    if ($localStorage.lecturasRem == '' || $localStorage.lecturasRem === undefined)
        $localStorage = $localStorage.$default({lecturasRem: []});  

    if ($localStorage.storageRendInspections == '' || $localStorage.storageRendInspections === undefined)
        $localStorage = $localStorage.$default({storageRendInspections: []});

    if ($localStorage.storageTireRendInspections == '' || $localStorage.storageTireRendInspections === undefined)
        $localStorage = $localStorage.$default({storageTireRendInspections: []});

     if ($localStorage.storageTireModel == '' || $localStorage.storageTireModel === undefined)
        $localStorage = $localStorage.$default({storageTireModel: []});

     if ($localStorage.storageTireSize == '' || $localStorage.storageTireSize === undefined)
        $localStorage = $localStorage.$default({storageTireSize: []});

     if ($localStorage.storageTireBrand == '' || $localStorage.storageTireBrand === undefined)
        $localStorage = $localStorage.$default({storageTireBrand: []});

    if ($localStorage.storagePressure == '' || $localStorage.storagePressure === undefined)
        $localStorage = $localStorage.$default({storagePressure: []});

    if ($localStorage.tables == '' || $localStorage.tables === undefined)
        $localStorage = $localStorage.$default({tables: []});

    if ($localStorage.list == '' || $localStorage.list === undefined)
        $localStorage = $localStorage.$default({list: []});              

    if ($localStorage.storageTruckType == '' || $localStorage.storageTruckType === undefined)
        $localStorage = $localStorage.$default({storageTruckType: []});

    if ($localStorage.storageTruckBrand == '' || $localStorage.storageTruckBrand === undefined)
        $localStorage = $localStorage.$default({storageTruckBrand: []});
    
    if ($localStorage.storageTruckModel == '' || $localStorage.storageTruckModel === undefined)
        $localStorage = $localStorage.$default({storageTruckModel: []});

    if ($localStorage.languague == '') {
        $localStorage.languague = 'es';
        $translate.use('es');
    } else {
        $translate.use($localStorage.languague);
    }
    

    if ($localStorage.inspectionMode === undefined) {
        $localStorage.inspectionMode = 'Manual'
    }        
    /*
    $ionicPlatform.ready(function() {
        ionic.Platform.fullScreen();
        if(window.StatusBar){
          window.StatusBar.hide();
        }

        
        bluetoothSerial.isEnabled(function () {
            alert("Bluetooth is Enabled.");
          }, function (reason) {
            alert("Bluetooth is *not* Enabled.");
          }
        );
                
    });*/ 
})

.factory('nfcService', function($rootScope, $ionicPlatform, $localStorage) {

    var tag = {};

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function(nfcEvent) {
            $rootScope.$apply(function() {
                angular.copy(nfcEvent.tag, tag);
                // if necessary $state.go('some-route')
                console.log("entra aquí")
            });
        }, function() {              
            $localStorage.activatedNFC = 'true';                
        }, function(reason) {                
            $localStorage.activatedNFC = 'false';                
        });
    });

    return {
        tag: tag
    };
})
.factory('StorageService', function($localStorage) {

    //REPORTS
    $localStorage = $localStorage.$default({
        tables: []
    });    
    var _getAll = function () {
        return $localStorage.tables;
    };

    var _getAllList = function () {
        return $localStorage.list;
    };

    var _add = function (meses, alta, media, baja) {    
    //creating final structure
    var data =
    {
        meses,
        alta,
        media,
        baja
    }

    //pushing to local storage
    $localStorage.tables.push(data);            
    }

    var _addList = function (estado, modelo, descripcion) {    
        //creating final structure
        var data =
        {
            estado,
            modelo,
            descripcion
        }

        //pushing to local storage
        $localStorage.list.push(data);            
    }

    var _delList = function () {
        $localStorage.list = [];
    }


    //TRUCKS
    var _getAllTrucks = function() {
        return $localStorage.storageTrucks;
    };

    var _addTruck = function(truck) {
        $localStorage.storageTrucks.push(truck);
    }

    var _removeTruck = function(tag) {
        var trucks = $localStorage.storageTrucks;
        for (i = 0; i < trucks.length; i++) {
            if (trucks[i].tag == tag) {
                $localStorage.storageTrucks.splice(i, 1);
            }
        }
    }
    //TIRES
    var _addTire = function(tires) {
        $localStorage.storageTires.push(tires);
    }

    var _removeTire = function(tag) {
        var tires = $localStorage.storageTires;
        for (i = 0; i < tires.length; i++) {
            if (tires[i].tag == tag) {
                $localStorage.storageTires.splice(i, 1);
            }
        }
    } 
    //FLEETS
    var _addFleet = function(fleet) {
        $localStorage.storageFleets.push(fleet);
    }

    var _removeFleet = function(nombre) {
        var fleets = $localStorage.storageFleets;
        for (i = 0; i < fleets.length; i++) {
            if (fleets[i].nombre == nombre) {
                $localStorage.storageFleets.splice(i, 1);
            }
        }
    }    
    //CUSTOMER
    var _addCustomer = function(customer) {
        $localStorage.storageCustomers.push(customer);
    }

    var _removeCustomer = function(email) {
        var customers = $localStorage.storageCustomers;
        for (i = 0; i < customers.length; i++) {
            if (customers[i].email == email) {
                $localStorage.storageCustomers.splice(i, 1);
            }
        }
    }
    // SEMAPHORE INSPECTION
    var _addSemaphoreInspection = function(semaphoreInspection){
        $localStorage.storageSemaphoreInspections.push(semaphoreInspection);
    }

    var _removeSemaphoreInspection = function(tag) {
        var semaphoreInspections = $localStorage.storageSemaphoreInspections;
        for (i = 0; i < semaphoreInspections.length; i++) {
            if (semaphoreInspections[i].tag == tag) {
                $localStorage.storageSemaphoreInspections.splice(i, 1);
            }
        }
    }
    // TIRES INSPECTION
    var _addTireToInspection = function(tireInspection){
        $localStorage.storageTireInspections.push(tireInspection);
    }

    var _removeTireInspection = function(truckTag) {
        var tireInspections = $localStorage.storageTireInspections;
        for (i = 0; i < tireInspections.length; i++) {
            if (tireInspections[i].truckTag == truckTag) {
                $localStorage.storageTireInspections.splice(i, 1);
            }
        }
    }


    // REND INSPECTION
    var _addRendInspection = function(rendInspection){
        $localStorage.storageRendInspections.push(rendInspection);
    }

    var _removeRendInspection = function(tagId) {
        var rendInspections = $localStorage.storageRendInspections;
        for (i = 0; i < rendInspections.length; i++) {    
            if (rendInspections[i].tag == tagId) {                
                $localStorage.storageRendInspections.splice(i, 1);
            }
        }
    }

    // TIRES REND INSPECTION
    var _addTireRendToInspection = function(tireRendInspection){
        $localStorage.storageTireRendInspections.push(tireRendInspection);
    }

    var _removeTireRendInspection = function(tagId) {
        var tireRendInspections = $localStorage.storageTireRendInspections;
        for (i = 0; i < tireRendInspections.length; i++) {
            if (tireRendInspections[i].tagId == tagId) {
                $localStorage.storageTireRendInspections.splice(i, 1);
            }
        }
    }   

    var _removeAllTireInspection = function(idtruck) {
        var numTires = Object.keys($localStorage.storageTireInspections).length;
        if(numTires > 0){
            for (var i = $localStorage.storageTireInspections.length - 1; i >= 0; i--) {
                if($localStorage.storageTireInspections[i].idtruck == idtruck){
                    $localStorage.storageTireInspections.splice(i, 1);
                }
            }

            return true                        
        } else {
            return true
        }                
    }

    var _removeAllTireRendInspection = function(idtruck) {
        var numTires = Object.keys($localStorage.storageTireRendInspections).length;
        if(numTires > 0){
            console.log("hay llantas a eliminar")
            console.log("la cantidad de llantas a remover es? " + numTires)
            var tireInspections = $localStorage.storageTireRendInspections;
            console.log("llantas a eliminar serán");
            console.log(tireInspections)

            for (var i = $localStorage.storageTireRendInspections.length - 1; i >= 0; i--) {
                if($localStorage.storageTireRendInspections[i].idtruck == idtruck){
                    $localStorage.storageTireRendInspections.splice(i, 1);
                }
            }
            return true                        
        } else {
            return true
        }                
    } 

    //---------------------------------------------
    var _addTruckBrand = function(truckBrand) {
        $localStorage.truckBrands.push(truckBrand);
        $localStorage.storageTruckBrand.push(truckBrand);
    }

    var _removeTruckBrand = function(brand) {
        var truckBrand = $localStorage.storageTruckBrand;
        for (i = 0; i < truckBrand.length; i++) {
            if (truckBrand[i].brand == truckBrand) {                
                $localStorage.storageTruckBrand.splice(i, 1);
            }
        }
    }

    var _addTruckModel = function(truckModel) {
        $localStorage.truckModels.push(truckModel);
        $localStorage.storageTruckModel.push(truckModel);
    }

     var _removeTruckModel = function(model) {
        var truckModel = $localStorage.storageTruckModel;
        for (i = 0; i < truckModel.length; i++) {
            if (truckModel[i].model == model) {                
                $localStorage.storageTruckModel.splice(i, 1);
            }
        }
    }

    var _addTruckType = function(truckType) {
        $localStorage.truckTypes.push(truckType);
        $localStorage.storageTruckType.push(truckType);
    }

    var _removeTruckType = function(model) {
        var truckType = $localStorage.storageTruckType;
        for (i = 0; i < truckType.length; i++) {
            if (truckType[i].model == model) {                
                $localStorage.storageTruckType.splice(i, 1);
            }
        }
    }


    var _addPressure = function(pressure) {
        $localStorage.storagePressure.push(pressure);
        $localStorage.pressureTypes.push(pressure);
    }

    var _removePressure = function(psi) {
        var pressure = $localStorage.storagePressure;
        for (i = 0; i < pressure.length; i++) {
            if (pressure[i].psi == psi) {
                $localStorage.storagePressure.splice(i, 1);
            }
        }
    }
    var _addTireBrand = function(tireBrand){
        $localStorage.storageTireBrand.push(tireBrand);
    }

    var _removeTireBrand = function(nombre) {
        var tires = $localStorage.storageTireBrand;
        for (i = 0; i < tires.length; i++) {
            if (tires[i].nombre == nombre) {
                $localStorage.storageTireBrand.splice(i, 1);
            }
        }
    } 

    var _addTireSize = function(tireSize){
        $localStorage.storageTireSize.push(tireSize);
    }

    var _removeTireSize = function(medida) {
        var tires = $localStorage.storageTireSize;
        for (i = 0; i < tires.length; i++) {
            if (tires[i].medida == medida) {
                $localStorage.storageTireSize.splice(i, 1);
            }
        }
    } 

    var _addTireModel = function(tireModel){
        $localStorage.storageTireModel.push(tireModel);
    }
    
    var _removeTireModel = function(nombre) {
        var tires = $localStorage.storageTireModel;
        for (i = 0; i < tires.length; i++) {
            if (tires[i].nombre == nombre) {
                $localStorage.storageTireModel.splice(i, 1);
            }
        }
    }




    return {
        getAllTrucks: _getAllTrucks,
        addTruck: _addTruck,
        removeTruck: _removeTruck,
        addTire: _addTire,
        removeTire:_removeTire,
        addFleet:_addFleet,
        removeFleet:_removeFleet,
        addCustomer: _addCustomer,
        removeCustomer: _removeCustomer,
        addSemaphoreInspection:_addSemaphoreInspection,            
        removeSemaphoreInspection:_removeSemaphoreInspection,
        addTireToInspection:_addTireToInspection,
        removeTireInspection:_removeTireInspection,
        addRendInspection:_addRendInspection,
        removeRendInspection:_removeRendInspection,
        addTireRendToInspection:_addTireRendToInspection,
        removeTireInspection:_removeTireInspection,
        removeAllTireInspection:_removeAllTireInspection,
        removeAllTireRendInspection: _removeAllTireRendInspection,
        addTruckBrand: _addTruckBrand,
        removeTruckBrand: _removeTruckBrand,
        addTruckModel: _addTruckModel,
        removeTruckModel: _removeTruckModel,
        addPressure: _addPressure,
        removePressure: _removePressure,
        addTireBrand: _addTireBrand,
        removeTireBrad: _removeTireBrand,
        addTireSize: _addTireSize,
        removeTireSize: _removeTireSize,
        addTireModel: _addTireModel,
        removeTireModel: _removeTireModel,
        addTruckType: _addTruckType,
        removeTruckType: _removeTruckType, 
        getAll: _getAll,
        add: _add,
        getList: _getAllList,
        addList: _addList,
        delList: _delList       
    };
})

.factory('Check', function(){
    var _isNull = function(value) {
        if(value === undefined){            
            return ""
        } else {
            if(value == "")
            {                
                return ""
            } else {                
                return value
            }
        }
    }
    var _isNumber = function(s){
        var x = +s; // made cast obvious for demonstration
        return x.toString() === s;
    }

    return {
        isNull: _isNull,
        isNumber: _isNumber
    }
})