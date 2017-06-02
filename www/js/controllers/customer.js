angular.module('customer', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('CustomerCtrl', function($ionicPlatform, $scope, $ionicLoading, $ionicPopup, $localStorage, Data, Check, $translate, $rootScope, StorageService, $state, $timeout) {
  	    $scope.data.fleetBefore = true;
  	    

  	    $ionicPlatform.offHardwareBackButton(function() {
          console.log("Hola"); 
        });
        $ionicPlatform.registerBackButtonAction(function(event) {
        }, 100);

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
          	
		$scope.getCustomerNumber = function(id){
			var idFound = false; var nameComp = ""

			if($localStorage.inspectionMode){				
				angular.forEach($localStorage.customers, function(value, key) {					
                    if(value.idAccount == id){                    	
                    	idFound = true;
            			nameComp = value.nameCompany; 
                    }
                });
                angular.forEach($localStorage.storageCustomers, function(value, key) {					
                    if(value.customerNumber == id){                    	
                    	idFound = true;
            			nameComp = value.company; 
                    }
                });
                $scope.companyAssigned = idFound;
            	$scope.data.companyName = nameComp; 
            	

			} else {
				var DataPromise = Data.getCustomerNumber($rootScope.url, $scope.data.customerNumber)
            	DataPromise.then(function(result) {
                    if (result['company'] != '') {
                    	console.log(result['company']);
                        //SI LA COMPAÑÍA EXISTE
                        $scope.companyAssigned = true;
                        $scope.data.companyName = result['company'];

                    }else{
                        $scope.companyAssigned = false;
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
			}
            
        }

        $scope.insertCustomer = function(company, email, password, address, phone, contact, job, status, type, companyAssigned) {
			var aceptar = $translate.instant('MSG_ACEPTAR')
			var error = $translate.instant('MSG_ERROR');

			var customerNumber = $scope.data.customerNumber;

        	company = Check.isNull(company)
        	email = Check.isNull(email)
        	password = Check.isNull(password)
        	address = Check.isNull(address)
        	phone = Check.isNull(phone)
        	contact = Check.isNull(contact)
        	job = Check.isNull(job)
        	status = Check.isNull(status)
        	type = Check.isNull(type)
        	customerNumber = Check.isNull(customerNumber)

        	if(company == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_COMPANY');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            });        		
        	} else if(email == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_EMAIL');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(password == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_PASSWORD_LABEL');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(address == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_ADDRESS');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(phone == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_PHONE');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(contact == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_NAME_CONTACT');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(job == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_JOB');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(status == ""){
        		var details = $translate.instant('MSG_CHOOSE')  + " " + $translate.instant('CUSTOMER_STATUS');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            }); 
        	} else if(type == ""){
        		var details = $translate.instant('MSG_CHOOSE')  + " " + $translate.instant('CUSTOMER_USERT_TYPE');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            });
        	} else if(customerNumber == ""){
        		var details = $translate.instant('MSG_WRITE')  + " " + $translate.instant('CUSTOMER_NUMBER_CUSTOMER_ASSIGNED');
				$ionicPopup.alert({
	                title: error,
	                template: '<center>' + details + '</center>',
	                okText: aceptar,
	                okType: 'button-assertive'
	            });
        	} else {
				if ($localStorage.appModeStatus) {
	                //si el modo offline está activado
	                //comparamos si la compañia seleccionada es la misma que    

	                var customer = {
	                    company: company,
	                    email: email,
	                    password: password,
	                    address: address,
	                    phone: phone,
	                    contact: contact,
	                    job: job,
	                    status: status,
	                    type: type,
	                    customerNumber: customerNumber
	                }
	                console.log(customer)
	                StorageService.addCustomer(customer);

					
	                var msgOk = $translate.instant('CUSTOMER_SAVED_SUCCESSFULY')
	                $ionicLoading.hide();
	                $ionicPopup.alert({
	                    template: '<center><p><b>' +  msgOk + '</p></center>',
	                    okText: aceptar,
	                    okType: 'button-balanced'
	                });
	                $state.go("app.dashboard", {
	                    animation: 'slide-in-down'
	                });
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

	                var DataPromise = Data.insertCustomer($rootScope.url, $localStorage.languague, company, email, password, address, phone, contact, job, status, type, companyAssigned)                  
	                DataPromise.then(function(result) {
	                    if (result['message'] == 'success') {
	                        //DATOS CARGADOS
	                        $ionicLoading.hide();
	                        $scope.$broadcast('scroll.refreshComplete');
		                    var info = $translate.instant('MSG_INFORMATION');
		                    var aceptar = $translate.instant('MSG_ACEPTAR');
		                    var msgSuccess = $translate.instant('MSG_DATA_SUCCESS');		                    
		                    var tryAgain = $translate.instant('MSG_TRY_AGAIN');
		                    console.log("contenido de result ID: " + result['id']);
		                    $localStorage.company = result['id'];
		                    console.log("Este es el ID: " + result['id']);
		                    console.log("Contenido de $localStorage.company ");
		                    console.log($localStorage.company);

		                    var DataPromise = Data.getAllCustomers($rootScope.url)
			            	DataPromise.then(function(result) {
			                    if (result['data'] != '') {
			                    	console.log("Este es el contenido de DATA")
			                    	console.log(result['data']);
			                    	console.log("Lo pasamos a localStorage")
			                        $localStorage.customers = result['data'];
			                        console.log("Y lo pasamos a customers...")
			                        $scope.customers = result['data'];
			                        console.log(result['data'])
			                        $

			                    }else{
			                       console.log("no hacemos nada...");
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

		                    console.log($localStorage.company);
		                    //$scope.getCustomerNumber(customerNumber);
		                    $localStorage.companyName = company;
		                    console.log($localStorage.companyName)
		                   

	                        if ($scope.data.fleetBefore == true){		                       
		                        $ionicPopup.alert({
		                            title: info,
		                            template: '<center><p><strong>' + msgSuccess + '</strong></p></center>',
		                            okText: aceptar,
		                            okType: 'button-balanced'
	                       		});
		                         console.log("Contenido de $localStorage.company...");
		                    	console.log($localStorage.company);
	                       		 $state.go("app.addFleet", {
				                    animation: 'slide-in-down'
				                });
		                    } else if ($scope.data.fleetBefore == false) {
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

	                    } else if (result['message'] == 'error') {
	                        //DATOS CON ERRORES O INCOMPLETOS
	                        $ionicLoading.hide();

	                        var errors = ""
	                        angular.forEach(result['errors'], function(value, key) {
	                            errors = errors + (key + 1) + ".- " + value + "<br>"
	                        });

	                        
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
        }

        $scope.refreshCustomers = function() {

        }    	
    })