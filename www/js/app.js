// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['starter.controllers','starter.services','ionic', 'ionic-toast',
  'config',
  'customer',
  'dashboard',
  'fleets',
  'inspectionMode',
  'inspectionRend',
  'inspections',
  'login',
  'logout',
  'NFC',
  'reports',
  'scheduler',
  'slider',
  'tires',
  'trucks',
  'uploadData',  
  'translate',
  'bluetooth'])

.run(function($ionicPlatform, $localStorage, ionicToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }   
  });

  window.bluetooth = {
    callBack: null,
    callBackOnTreadDepth: null,
    callBackOnrfidNoTagFoundResponse: null,
    milimetraje_:0,
    pressure_:0,


    connect: function(device, success, failure) {
        bluetoothSerial.connect(device, success, failure);
    },
    disconnect: function(success, failure) {
        bluetoothSerial.disconnect(success, failure);
    },
    sendCommand: function(command) {
        console.log('Enviando Comando: ' + command);
        bluetoothSerial.write(command + "\r", bluetooth.onSuccess, bluetooth.onCommandError);
    },
    onReceiveData: function(data) {
        //console.log("Mess: " + data[0]);
        command.execute(data);
    },
    onError: function() {
        console.log("ERROR");
    },
    onSuccess: function(data) {
        console.log('command send ' + data);
    },
    onCommandError: function(data) {
        console.log('Comando no enviado !!! ' + data);
    },
    callBackOnTreadDepth: function(tread) { 
        var milimetraje = parseFloat(tread.substring(0, tread.length - 1)); 
        bluetooth.milimetraje_ = milimetraje;       
        return milimetraje  
    },
    callBackOnPressure: function(tread) { 
        var pressure = parseFloat(tread.substring(0, tread.length - 1)); 
        bluetooth.pressure_ = pressure;       
        return pressure  
    },

    ///////////////Bluetooth Functions ////////////////
    getDeviceList: function(success, failure) {
        bluetoothSerial.list(success, failure);
        bluetoothSerial.subscribe("\n", bluetooth.onReceiveData, bluetooth.onError);
    },
    getBatteryStatus: function(callback) {
        bluetooth.sendCommand('B');
        bluetooth.callBack = callback;
    },
    shutDown: function() {
        bluetooth.sendCommand('Ws');        
    },
    getTreadDepth: function(){
        bluetooth.sendCommand('T');
    },
    readRFID: function(callback) {
        bluetooth.sendCommand('GR');
        bluetooth.callBack = callback;
    },
    readRFIDContinuous: function(callback) {
        bluetooth.sendCommand('GC');
        bluetooth.callBack = callback;
    },
    rfidOff: function(callback){
        bluetooth.sendCommand('GO');
        bluetooth.callBack = callback;
    },
    writeRFID: function(data, callback){
        bluetooth.sendCommand('GW1002'+data);
        bluetooth.callBack = callback;
    },
            
    writeRFIDMatricule: function(data, callback){
        bluetooth.sendCommand('GW3002'+data);
        bluetooth.callBack = callback;
    }
  };

  window.command = {
    execute: function(data) {
        console.log('DATA:' + data);
        switch (data[0]) {
            case 'B':
                command.batteryStatus(data);
                break;
            case 'G':
                command.rfidResponse(data);
                break;
            case 'T':
                command.treadDepthResponse(data);                
                break;
            case 'P':
                command.pressureResponse(data);
                break;           
            default:
                command.commandNotFound(data);
                break;
        }    
    },
    batteryStatus: function(data) {
        var voltageNumber = Number(data.substr(1, data.length));
        var voltage = ((7.4 / 1024) * voltageNumber).toFixed(2);
        bluetooth.callBack(voltage);
        console.log("Battery V: "+voltage);
    },
    treadDepthResponse: function(data) {
        var responseData = data.substr(1, data.length);
        console.log(bluetooth.callBackOnTreadDepth(responseData));
        console.log(bluetooth.milimetraje_)
    },
    pressureResponse: function(data) {
        var responseData = data.substr(1, data.length);
        console.log("la presión es: " + responseData)
        bluetooth.callBackOnPressure(responseData);
    },
    rfidResponse: function(data) {
        switch (data[1]) {
            case 'R':
                command.rfidReadResponse(data);
                break;
            case 'W':
                command.rfidWriteResponse(data);
                break;
            case 'C':
                command.rfidContinuousReadResponse(data);
                break;
            case 'O':
                command.rfidCanselResponse();
                break;
            case 'B':
                command.rfidBuzzerResponse(data);
                break;
            case 'Z':
                command.rfidVibratorResponse(data);
                break;
            case 'S':
                if (data[2] == 'T')
                    command.rfidNoTagFoundResponse();
                break;
            default:
                command.commandNotFound(data);
                break;
        }
    },
     rfidReadResponse: function(data) {
        var responseData;
        var respondeDataObject = {};
        switch (data.length) {
            case 27:
                responseData = data.substr(2, 24);
                respondeDataObject = decodeDataRFID(responseData); // return {EPCheader,filter,partition,companyPrefix,cai,sn,encodedData,michelin}
                break;
            case 23:
                responseData = data.substr(2, 20);
                respondeDataObject = decodeRFIDDataFromUserArea(responseData); // return matricule
                break;
        }
        bluetooth.callBack(respondeDataObject);
        //console.log('Read RIF tag data: ' + responseData);
    },
    rfidWriteResponse: function(data) {
        var responseData = data.substr(2, data.length);
        console.log('Write RIF tag data: ' + responseData);
        bluetooth.callBack(responseData);
    },
    rfidContinuousReadResponse: function(data) {
        //command.status = 'continuous_read';
        var responseData = data.substr(2, 24);
        var respondeDataObject = decodeDataRFID(responseData);
        bluetooth.callBack(respondeDataObject);

    },
    rfidCanselResponse: function() {
        console.log('Cancel continuous reading from RFID tag');
        bluetooth.callBack();
    },
    rfidBuzzerResponse: function(data) {
        var responseData = Number(data.substr(2, data.length));
        bluetooth.callBack(responseData);
        console.log('Buzzer status: ' + responseData);
    },
    rfidVibratorResponse: function(data) {
        var responseData = Number(data.substr(2, data.length));
        bluetooth.callBack(responseData);
        console.log('Vibrator status: ' + responseData);
    },
    rfidNoTagFoundResponse: function() {
        console.log('No tag found');
        bluetooth.callBackOnrfidNoTagFoundResponse();
    }
  };

  //-------------------------ENCODER FUNCTIONS-----------------------------------
  decodeDataRFID = function(string) {
    //data ='   3005FB63AC1F3681EC880468';
    var binNumber = hex2bin(string);
    var companyNumberLength = 0;
    var caiLength = 0;
    var EPCheader = parseInt(binNumber.substr(0, 8), 2);
    var filter = parseInt(binNumber.substr(8, 3), 2);
    var partition = parseInt(binNumber.substr(11, 3), 2);
    var encodedData = string;
    var michelin = null;

    if ((string.substr(0, 9) === '301854AAC' || string.substr(0, 9) === '307854AAC')) {
        michelin = true;
    }
    else
        michelin = false;

    var distrib = getPartitionDistribution(partition);
    companyNumberLength = distrib.companyNumberLength;
    caiLength = distrib.caiLength;

    var companyPrefix = parseInt(binNumber.substr(14, companyNumberLength), 2);
    var cai = parseInt(binNumber.substr(14 + companyNumberLength, caiLength), 2);
    var sn = parseInt(binNumber.substr(14 + companyNumberLength + caiLength, binNumber.length - 1), 2);

    return {EPCheader: EPCheader, filter: filter, partition: partition, companyPrefix: companyPrefix, cai: cai, sn: sn, encodedData: encodedData, michelin: michelin};
}

encodeDataRFID = function(EPCheader, filter, partition, companyPrefix, cai, sn) {
    /*
     * 
     * EPCheader    48
     * cai  90
     * companyPrefix    68100645113
     * encodedData  "3005FB63AC1F3681EC880468"
     * filter 0
     * michelin false
     * partition  1
     * sn 8263304296
     * GR3005FB63AC1F3681EC880468
     * GR000000000000000000000000
     * GW30020000000000000000000000000000
     * GW30023005FB63AC1F3681EC8804680000
     */
    var binNumber = '';
    var encodedEPCheader = zeroToStart(Number(EPCheader).toString(2), 8); //parseInt(binNumber.substr(0, 8), 2);
    binNumber += encodedEPCheader;
    var encodedFilter = zeroToStart(Number(filter).toString(2), 3); //parseInt(binNumber.substr(8, 3), 2);
    binNumber += encodedFilter;
    var encodedPartition = zeroToStart(Number(partition).toString(2), 3); // parseInt(binNumber.substr(11, 3), 2);
    binNumber += encodedPartition;

    var distrib = getPartitionDistribution(Number(partition));

    var encodedCompanyPrefix = zeroToStart(Number(companyPrefix).toString(2), distrib.companyNumberLength);
    binNumber += encodedCompanyPrefix;
    var encodedCai = zeroToStart(Number(cai).toString(2), distrib.caiLength);
    binNumber += encodedCai;
    var encodedSn = zeroToStart(Number(sn).toString(2), 38);
    binNumber += encodedSn;
    return zeroToEnd(bin2hex(binNumber), 28);
}
/**
 * 
 * @param {hexa code} data
 * @returns {String} matricule 
 * example data: 65 92 B1 C3 9E 38 20 0000000000
 *               0D4F0C071051B9DB3CB52E000000
 * GR            1051B9DB3CB52E00000000000000
 * example return: "YYJ10988H"
 */
decodeRFIDDataFromUserArea = function(data) {
    var hexa_data = data.substr(0, 14)
    var bin_data = hex2bin(hexa_data);
    //0110 0101 1001 0010 1011 0001 1100 0011 1001 1110 0011 1000 0010 00
    //0110 0101 1001 0010 1011 0001 1100 0011 1001 1110 0011 1000 0010 0000
    console.log(bin_data);
    var decodedData = '';
    var decodedPart = 1;
    for (var i = 0; i < bin_data.length; i += 6) {
        if (decodedPart < 4 || decodedPart > 8)
            decodedData += decode6BitToChar(bin_data.substr(i, 6), 'ch');
        else
            decodedData += decode6BitToChar(bin_data.substr(i, 6), 'n');
        decodedPart++;
    }
    return decodedData;

}

encodeRFIDDataForUserArea = function(data) {
    var matricule_bin = '';
    if (data.length >= 9) {
        var matricule = data.substr(0, 9);
        for (var i = 0; i < matricule.length; i++)
            matricule_bin += encodeCharTo6Bit(matricule[i]);

        // add 00 to end -> matricule_bin length set to 56
        matricule_bin += "00";
    }
    else
        matricule_bin = zeroToStart('',56);


    return zeroToEnd(bin2hex(matricule_bin), 28);
}

getPartitionDistribution = function(partition) {
    var companyNumberLength = 0;
    var caiLength = 0;

    switch (partition) {
        case 0:
            companyNumberLength = 40;
            caiLength = 4;
            break;
        case 1:
            companyNumberLength = 37;
            caiLength = 7;
            break;
        case 2:
            companyNumberLength = 34;
            caiLength = 10;
            break;
        case 3:
            companyNumberLength = 30;
            caiLength = 14;
            break;
        case 4:
            companyNumberLength = 27;
            caiLength = 17;
            break;
        case 5:
            companyNumberLength = 24;
            caiLength = 20;
            break;
        case 6:
            companyNumberLength = 20;
            caiLength = 24;
            break;
    }
    return {companyNumberLength: companyNumberLength, caiLength: caiLength};
}
hex2bin = function(hex) {
    var bin;
    var hex_part1 = hex.substr(0, 12);
    var hex_part2 = hex.substr(12, hex.length - 12);
    var hex_part1_length = hex_part1.length;
    var hex_part2_length = hex_part2.length;

    var bin_part1 = parseInt(hex_part1, 16).toString(2);
    var bin_part2 = parseInt(hex_part2, 16).toString(2);

    bin = zeroToStart(bin_part1, hex_part1_length * 4) + zeroToStart(bin_part2, hex_part2_length * 4);
    return bin;
}
bin2hex = function(bin) {

    var hex = '';
    var partitionArray = bin.match(/.{1,24}/g);
    for (var i = 0; i < partitionArray.length; i++) {
        hex += zeroToStart(parseInt(partitionArray[i], 2).toString(16), partitionArray[i].length / 4);
    }

    /*var bin_part1 = bin.substr(0, 24);
     var bin_part2 = bin.substr(24, bin.length - 24);
     var bin_part1_length = bin_part1.length;
     var bin_part2_length = bin_part2.length;
     
     var hex_part1 = parseInt(bin_part1, 2).toString(16);
     var hex_part2 = parseInt(bin_part2, 2).toString(16);
     
     hex = zeroToStart(hex_part1, bin_part1_length / 4) + zeroToStart(hex_part2, bin_part2_length / 4);
     */
    //hex = parseInt(bin,2).toString(16);
    return hex;
}

zeroToStart = function(_string, _length) {
    var string = _string;
    var length = _length;

    for (var i = string.length; i < length; i++)
        string = "0" + string;

    return string;
}
zeroToEnd = function(_string, _length) {
    var string = _string;
    var length = _length;

    for (var i = string.length; i < length; i++)
        string = string + "0";

    return string;
}

//-------------------------ENCODER FUNCTIONS-----------------------------------
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    cache:false,
    controller: 'LoginCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app.dashboard', {
    url: '/dashboard',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    },
    cache:false
  })
  .state('app.iManual', {
    url: '/iManual',
    views: {
      'menuContent': {
        templateUrl: 'templates/iManual.html',
        controller: 'InspectionCtrl',
        cache:false
      }
    }
  })
  .state('app.iGun', {
    url: '/iGun',
    views: {
      'menuContent': {
        templateUrl: 'templates/iGun.html',
        controller: 'InspectionCtrl',
        cache:false
      }
    }
  })
  .state('app.iNFC', {
    url: '/iNFC',
    views: {
      'menuContent': {
        templateUrl: 'templates/iNFC.html',
        controller: 'InspectionCtrl'
      }
    }
  })
  .state('app.iTranslogik', {
    url: '/iTranslogik',
    views: {
      'menuContent': {
        templateUrl: 'templates/iTranslogik.html',
        controller: 'InspectionCtrl'
      }
    }
  })
  .state('app.inspSemManual', {
    url: '/inspSemManual',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspSemManual.html',
        controller: 'InspectionCtrl'
      }
    },
    cache:false
  })
  .state('app.inspSemTranslogik', {
    url: '/inspSemTranslogik',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspSemTranslogik.html',
        controller: 'InspectionCtrl'
      }
    },
    cache:false
  })
  .state('app.inspSemGun', {
    url: '/inspSemGun',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspSemGun.html',
        controller: 'InspectionCtrl'
      }
    },
    cache:false
  })
  .state('app.inspSemNFC', {
    url: '/inspSemNFC',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspSemNFC.html',
        controller: 'InspectionCtrl'
      }
    },
    cache:false
  })
  .state('app.inspectionRend', {
    url: '/inspectionRend',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspectionRend.html',
        controller: 'InspectionRendCtrl'
      }
    },
    cache:false
  })
  .state('app.inspectionMode', {
    url: '/inspectionMode',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspectionMode.html',
        controller: 'InspectionModeCtrl'
      }
    }
  })
  .state('app.writeTAGS', {
    url: '/writeTAGS',
    views: {
      'menuContent': {
        templateUrl: 'templates/writeTAGS.html',
        controller: 'NFCCtrl'
      }
    }
  })
  .state('app.slider', {
    url: '/slider',
    views: {
      'menuContent': {
        templateUrl: 'templates/slider.html',
        controller: 'SliderCtrl',
        cache:false
      }
    }
  })
  .state('app.addTruck', {
    url: '/addTruck',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addTruck.html',
        controller: 'TruckCtrl'
      }
    }
  })
  .state('app.addCustomer', {
    url: '/addCustomer',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addCustomer.html',
        controller: 'CustomerCtrl'
      }
    }
  })
  .state('app.addFleet', {
    url: '/addFleet',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addFleet.html',
        controller: 'FleetCtrl'
      }
    }
  })
  .state('app.addTires', {
    url: '/addTires',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addTires.html',
        controller: 'TiresCtrl'
      }
    }
  })
  .state('app.addMultiTires', {
    url: '/addMultiTires',
      views: {
        'menuContent': {
          templateUrl: 'templates/addMultiTires.html',
          controller: 'TiresCtrl'
        }
      }
    })  
  .state('app.uploadData', {
    url: '/uploadData',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/uploadData.html',
        controller: 'UploadDataCtrl'
      }
    }
  })
.state('app.scheduler', {
    url: '/scheduler',
    views: {
      'menuContent': {
        templateUrl: 'templates/scheduler.html',
        controller: 'SchedulerCtrl'
      }
    }
  })
.state('app.logout', {
url: '/logout',
views: {
  'menuContent': {
    templateUrl: 'templates/login.html',
    controller:'logoutCtrl',
    cache:false
  }
}
})
.state('app.reports', {
  url: '/reports',
  views: {
    'menuContent': {
      templateUrl: 'templates/reports.html',
      controller: 'ReportsCtrl'
    }
  }
})
.state('app.otherReports', {
  url: '/otherReports',
  views: {
    'menuContent': {
      templateUrl: 'templates/otherReports.html',
      controller: 'ReportsCtrl'
    }
  }
})
  .state('app.detallesCamion', {
    url: '/detallesCamion',
    views: {
      'menuContent': {
        templateUrl: 'templates/detallesCamion.html'
      }
    }
  })
.state('app.rManual', {
  url: '/rManual',
  views: {
    'menuContent': {
      templateUrl: 'templates/rManual.html',
      controller: 'InspectionRendCtrl',
      cache:false
    }
  }
})
.state('app.rTranslogik', {
  url: '/rTranslogik',
  views: {
    'menuContent': {
      templateUrl: 'templates/rTranslogik.html',
      controller: 'InspectionRendCtrl'
    }
  }
})
.state('app.bluetooth', {
  url: '/bluetooth',
  cache:false,
  views: {
    'menuContent': {
      templateUrl: 'templates/bluetooth.html',
      controller: 'bluetoothCtrl'
    }
  }
})


  $urlRouterProvider.otherwise('/app/login');
});
