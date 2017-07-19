angular.module('starter.services', [])

.factory('Data', function($http){
    function login(url, nm, pw){        
        return $http({method:"GET", url:url + 'loginAdmin?email=' + nm + '&password='+pw}).then(function(result){
            return result.data;
        });
    }
    function refreshCatalogs(url){        
        return $http({method:"GET", url:url+ 'refreshCatalogs'}).then(function(result){
            return result.data;
        });
    }
    function allTrucksTiresByFleet(url,id){
        return $http({timeout:5000, method:"GET", url:url+ 'allTrucksTiresByFleet/'+id}).then(function(result){
            return result.data;
        });
    }
    function allTrucksTiresByFleetTimeout(url,id){
        return $http({timeout:11000, method:"GET", url:url+ 'allTrucksTiresByFleet/'+id}).then(function(result){
            return result.data;
        });
    }
    function getFlotasbyCliente(url, id){
        return $http({method:"GET", url:url+ 'getFlotasbyCliente/' + id }).then(function(result){
            return result.data;
        });
    }
    function getTrucksByFlota(url, id){
        return $http({method:"GET", url:url+ 'getTrucksByFlota/' + id }).then(function(result){
            return result.data;
        });
    }
    function getTruckModelsbyMarca(url, id){
        return $http({method:"GET", url:url+ 'getTruckModelsbyMarca/' + id }).then(function(result){
            return result.data;
        });
    }
    function getPressureTypeByTruckType(url, id){
        return $http({method:"GET", url:url+ 'getPressureTypeByTruckType/' + id }).then(function(result){
            return result.data;
        });
    }
    function insertTruck(url, lang, idFlota, idModelo, placas, anio, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo){
        return $http({method:"GET", url:url+ 'insertTruck?lang=' + lang + '&idFlota=' + idFlota + '&idModelo=' + idModelo + '&placas=' + placas + '&anio=' + anio + '&tag=' + tag + '&unidad=' + unidad + '&pressureType=' + pressureType + '&tagInstalado=' + tagInstalado + '&nombreOperador=' + nombreOperador+ '&tipo=' + tipo }).then(function(result){
            return result.data;
        });
    }
    function insertCustomer(url, lang, company, email, password, address, phone, contact, job, status, type, companyAssigned, customerAccount){
        return $http({method:"GET", url:url+ 'insertCustomer?lang=' + lang + '&company=' + company + '&email=' + email + '&password=' + password + '&address=' + address + '&phone=' + phone + '&contact=' + contact + '&job=' + job + '&status=' + status+ '&type=' + type + '&companyAssigned=' + companyAssigned + '&customerAccount=' + customerAccount}).then(function(result){
            return result.data;
        });
    }
    function getTruckData(url, tag){
        return $http({method:"GET", url:url+ 'getTruckData?tag=' + tag}).then(function(result){
            return result.data;
        });
    }
    function insertTruckHistorial(url, userId, tag, marca, modelo, unidad, kilometros, placas, tagInstalado, kmZero, tipoInspeccion){        
        return $http({method:"GET", url:url+ 'updateTruckInfo?userId=' + userId + '&tag=' + tag + '&marca=' + marca + '&modelo=' + modelo + '&unidad=' + unidad + '&kilometros=' + kilometros + '&placas=' + placas + '&tagInstalado=' + tagInstalado + '&kmZero=' + kmZero + '&tipoInspeccion=' + tipoInspeccion}).then(function(result){
            return result.data;
        });
    }

    function insertTireHistorial(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, remanente, psi, comments, condiciones, tagDetectado, tireType){        
        return $http({method:"GET", url:url+ 'submitTireInspection?userId=' + userId + '&tagId=' + tagId + '&historyId=' + historyId + '&brand=' + brand + '&tireSize=' + tireSize + '&model=' + model + '&position=' + position + '&tagInstalado=' + tagInstalado + '&kilometraje=' + kilometraje + '&truckTag=' + truckTag + '&remanente=' + remanente + '&psi=' + psi + '&comments=' + comments + '&condiciones=' + condiciones + '&tagDetectado=' + tagDetectado + '&tireType=' + tireType}).then(function(result){
            return result.data;
        });
    }
    function insertTireHistorialRend(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, psi, comments, condiciones, tagDetectado, pos1_rem1, pos1_rem2, pos1_rem3, pos1_rem4, pos2_rem1, pos2_rem2, pos2_rem3, pos2_rem4, pos3_rem1, pos3_rem2, pos3_rem3, pos3_rem4){        
        return $http({method:"GET", url:url+ 'submitTireInspectionRend?userId=' + userId + '&tagId=' + tagId + '&historyId=' + historyId + '&brand=' + brand + '&tireSize=' + tireSize + '&model=' + model + '&position=' + position + '&tagInstalado=' + tagInstalado + '&kilometraje=' + kilometraje + '&truckTag=' + truckTag + '&psi=' + psi + '&comments=' + comments + '&condiciones=' + condiciones + '&tagDetectado=' + tagDetectado + '&pos1_rem1=' + pos1_rem1 + '&pos1_rem2=' + pos1_rem2 + '&pos1_rem3=' + pos1_rem3 + '&pos1_rem4=' + pos1_rem4 + '&pos2_rem1=' + pos2_rem1 + '&pos2_rem2=' + pos2_rem2 + '&pos2_rem3=' + pos2_rem3 + '&pos2_rem4=' + pos2_rem4 + '&pos3_rem1=' + pos3_rem1 + '&pos3_rem2=' + pos3_rem2 + '&pos3_rem3=' + pos3_rem3 + '&pos3_rem4=' + pos3_rem4}).then(function(result){
            return result.data;
        });
    }
    function getCustomerNumber(url, id){
        return $http({method:"GET", url:url+ 'getCustomerNumber?id=' + id }).then(function(result){
            return result.data;
        });
    }
    function reporteMensual(url, e){
        return $http({method:"GET", url:url+ 'reporteMensual?userRol=Owner&email='+e}).then(function(result){
            return result.data;
        });
    } 
    function loadUnidadesStatus(url,i,y,m,s){
        return $http({method:"GET", url:url+ 'reportUnidadesStatus?idFlota='+i+ '&year='+y+ '&month='+m+ '&idsSemaforos='+s}).then(function(result){
            return result.data;
        });
    } 
    function reporteMensualFechas(url,e,y,m){
        return $http({method:"GET", url:url+ 'reporteMensual?userRol=Owner&email='+e+ '&year='+y+ '&month='+m}).then(function(result){
            return result.data;
        });
    }  
    function truckDetailsInspection(url,id){
        return $http({method:"GET", url:url+ 'truckDetailsInspection/'+id}).then(function(result){
            return result.data;
        });
    } 
    function graphPresiones(url,lang,initDate,endDate,flotas){
        return $http({method:"GET", url:url+ 'graphPresiones?lang=' + lang + '&initDate='+initDate+ '&endDate='+endDate+ '&flotas='+flotas}).then(function(result){
            return result.data;
        });
    }
    function graphDineroPr(url,lang,initDate,endDate,mesesDiv,flotas,price){
        return $http({method:"GET", url:url+ 'graphDineroPr?lang=' + lang + '&initDate='+initDate+ '&endDate='+endDate+ '&mesesDiv='+mesesDiv+ '&flotas='+flotas+ '&price='+price}).then(function(result){
            return result.data;
        });
    }  
    function loadCondiciones(url,idsSemaforos){
        return $http({timeout:3000, method:"GET", url:url+ 'reportCondEncontradas?idsSemaforos='+idsSemaforos}).then(function(result){
            return result.data;
        });
    }   
    function loadSemaforos(url,idsSemaforos){
        return $http({timeout:3000, method:"GET", url:url+ 'reportSemaforos?idsSemaforos='+idsSemaforos}).then(function(result){
            return result.data;
        });
    }   
    function trucksDetailsSem(url,ids,color){
        return $http({method:"GET", url:url+ 'trucksDetailsSem?idsSemaforos='+ids+ '&color='+color}).then(function(result){
            return result.data;
        });
    } 
    function trucksDetailsCond(url,ids,cond){
        return $http({method:"GET", url:url+ 'trucksDetailsCond?idsSemaforos='+ids+ '&cond='+cond}).then(function(result){
            return result.data;
        });
    }  
    function getCountriesbyId(url, id){
        return $http({method:"GET", url:url+ 'getCountries?id='+ id }).then(function(result){
            return result.data;
        });
    }
    function getStatesbyId(url, id){
        return $http({method:"GET", url:url+ 'getStates?id='+ id }).then(function(result){
            return result.data;
        });
    } 
    function getCitiesbyId(url, id){
        return $http({method:"GET", url:url+ 'getCities?id='+ id }).then(function(result){
            return result.data;
        });
    }        
    function getCountriesAll(url){
        return $http({method:"GET", url:url+ 'getCountries'}).then(function(result){
            return result.data;
        });
    }  
    function insertFleet(url, lang, idCliente, nombre, calle, colonia, ciudad, estado, pais, telefono, email, password, adminId, encargado, roldeCambio){
        console.log(url+ 'insertFleet?lang=' + lang + '&idCliente=' + idCliente + '&nombre=' + nombre + '&calle=' + calle + '&colonia=' + colonia + '&ciudad=' + ciudad + '&estado=' + estado + '&pais=' + pais + '&telefono=' + telefono + '&email=' + email + '&password=' + password + '&adminId=' + adminId + '&encargado=' + encargado + '&roldeCambio=' + roldeCambio)
        return $http({method:"GET", url:url+ 'insertFleet?lang=' + lang + '&idCliente=' + idCliente + '&nombre=' + nombre + '&calle=' + calle + '&colonia=' + colonia + '&ciudad=' + ciudad + '&estado=' + estado + '&pais=' + pais + '&telefono=' + telefono + '&email=' + email + '&password=' + password + '&adminId=' + adminId + '&encargado=' + encargado + '&roldeCambio=' + roldeCambio }).then(function(result){
            return result.data;
        });
    }
    function graphAnalisis(url, lang, initDate,endDate,flotas){
        return $http({method:"GET", url:url+ 'graphAnalisis?lang=' + lang + '&initDate='+initDate+ '&endDate='+endDate+ '&flotas='+flotas}).then(function(result){
            return result.data;
        });
    }
    function graphSemaforos(url,initDate,endDate,flotas){
        return $http({method:"GET", url:url+ 'graphSemaforos?initDate='+initDate+ '&endDate='+endDate+ '&flotas='+flotas}).then(function(result){
            return result.data;
        });
    }
    function getCustomerData(url, id){
        return $http({method:"GET", url:url+ 'getCustomerData/' + id}).then(function(result){
            return result.data;
        });
    }   
    function getRendByFleet(url,s){
        return $http({method:"GET", url:url+ 'getRendByFleet?idSemaforos='+s}).then(function(result){
            return result.data;
        });
    } 
    function getTiresByTruck(url, id){
        return $http({method:"GET", url:url+ 'getTiresByTruck/' + id }).then(function(result){
            return result.data;
        });
    }
     function getTireBrands(url){
        return $http({method:"GET", url:url+ 'getMarcas'}).then(function(result){
            return result.data;
        });
    } 
    function getTireSizebyBrand(url, id){
        return $http({method:"GET", url:url+ 'getMedidas?marca='+ id }).then(function(result){
            return result.data;
        });
    }  
    function getTireDesignbySize(url, id){
        return $http({method:"GET", url:url+ 'getDiseno?medida='+ id }).then(function(result){
            return result.data;
        });
    }
    function insertTire(url, lang, cliente, flota, unidad, marcaLlanta, tipoLlanta, medidaLlanta, disenoLlanta, precio, dot, tag, posicion, semaforo, desgaste, kilometraje, presion, tagInstalado, condiciones, inspTruckId){
        return $http({method:"GET", url:url+ 'submitLlantaNueva?cliente=' + cliente + '&lang=' + lang + '&flota=' + flota + '&unidad=' + unidad + '&marcaLlanta=' + marcaLlanta + '&tipoLlanta=' + tipoLlanta + '&medidaLlanta=' + medidaLlanta + '&disenoLlanta=' + disenoLlanta + '&precio=' + precio + '&dot=' + dot + '&tag=' + tag + '&posicion=' + posicion + '&semaforo=' + semaforo + '&desgaste=' + desgaste + '&kilometraje=' + kilometraje + '&presion=' + presion + '&tagInstalado=' + tagInstalado + '&condiciones=' + condiciones + '&idHistorial=' + inspTruckId }).then(function(result){
            return result.data;
        });
    }
    function custInfoData(url, id, company){
        return $http({method:"GET", url:url+ 'custInfoData?userId='+ id + '&company=' + company}).then(function(result){
            return result.data;
        });
    }
    function addTireBrand(url, lang, brand){
        return $http({method:"GET", url:url+ 'addTireBrand?lang=' + lang + '&brand=' + brand}).then(function(result){
            return result.data;
        });
    }
    function addTireSize(url, lang, brandId, size){
        return $http({method:"GET", url:url+ 'addTireSize?lang=' + lang + '&brandId=' + brandId + '&size=' + size}).then(function(result){
            return result.data;
        });
    }
    function addTireModel(url, lang, sizeId, model, depth, type, km, initRem, minRem){
        return $http({method:"GET", url:url+ 'addTireModel?lang=' + lang + '&sizeId=' + sizeId + '&model=' + model + '&depth=' + depth + '&type=' + type + '&km=' + km + '&initRem=' + initRem + '&minRem=' + minRem}).then(function(result){
            return result.data;
        });
    }
    function addTruckType(url, lang, nombre, numLlantas){
        return $http({method:"GET", url:url+ 'addTruckType?lang=' + lang + '&nombre=' + nombre + '&numLlantas=' + numLlantas}).then(function(result){
            return result.data;
        });
    }
    function addPressure(url, lang, idTruckType, tireSize, layers, psi, maxPsi, minPsi, weight){
        return $http({method:"GET", url:url+ 'addPressure?lang=' + lang + '&idTruckType=' + idTruckType + '&tireSize=' + tireSize + '&layers=' + layers + '&psi=' + psi + '&maxPsi=' + maxPsi + '&minPsi=' + minPsi + '&weight=' + weight}).then(function(result){
            return result.data;
        });
    }
    function addTruckBrand(url, lang, brand){
        return $http({method:"GET", url:url+ 'addTruckBrand?lang=' + lang + '&brand=' + brand}).then(function(result){
            return result.data;
        });
    }
    function addTruckModel(url, lang, brandId, model){
        return $http({method:"GET", url:url+ 'addTruckModel?lang=' + lang + '&brandId=' + brandId + '&model=' + model}).then(function(result){
            return result.data;
        });
    }
    function getAllCustomers(url){
        return $http({method:"GET", url:url+ 'getAllCustomers'}).then(function(result){
            return result.data;
        });
    }
    function sendTemporaryPassword(url, lang, email, userType){
        return $http({method:"GET", url:url+ 'sendTemporaryPassword?lang=' + lang + '&email=' + email + '&userType=' + userType}).then(function(result){
            return result.data;
        });
    }
    function setNewPassword(url, lang, email, userType, newPassword){
        return $http({method:"GET", url:url+ 'setNewPassword?lang=' + lang + '&email=' + email + '&userType=' + userType + '&newPassword=' + newPassword}).then(function(result){
            return result.data;
        });
    }
    function getHistoryByTag(url, tag){
        return $http({method:"GET", url:url+ 'getHistoryByTag?tag=' + tag}).then(function(result){
            return result.data;
        });
    }
    function messageToInspection(url, lang, id, message){
        return $http({method:"GET", url:url+ 'messageToInspection?lang=' + lang + '&id=' + id + '&message=' + message}).then(function(result){
            return result.data;
        });
    }
    function visitCustomerFinished(url, lang, id){
        return $http({method:"GET", url:url+ 'visitCustomerFinished?lang=' + lang + '&id=' + id}).then(function(result){
            return result.data;
        });
    }
    function insertHistorialFastCamion(url, lang, tagCamion, idUsuario, plataforma){
        return $http({method:"GET", url:url+ 'insertHistorialFastCamion?lang=' + lang + '&tagCamion=' + tagCamion + '&idUsuario=' + idUsuario + '&plataforma=' + plataforma}).then(function(result){
            return result.data;
        });
    }
    function insertHistorialFastLlanta(url, lang, idHist, tagLlanta, tagDetect, position){
        return $http({method:"GET", url:url+ 'insertHistorialFastLlanta?lang=' + lang + '&idHistFastCamion=' + idHist + '&tagLlanta=' + tagLlanta + '&tagDetectado=' + tagDetect + '&posicion=' + position}).then(function(result){
            return result.data;
        });
    }
    function insertFastCamionMessage(url, lang, idHist,comment){
        return $http({method:"GET", url:url+ 'insertFastCamionMessage?lang=' + lang + '&id=' + idHist + '&comment=' + comment}).then(function(result){
            return result.data;
        });
    }

    return { 
        login:function(url, nm, pw){
            return login(url, nm, pw);
        },
        refreshCatalogs:function(url){
            return refreshCatalogs(url);
        },
        allTrucksTiresByFleet:function(url,id){
            return allTrucksTiresByFleet(url,id);
        },
        allTrucksTiresByFleetTimeout:function(url,id){
            return allTrucksTiresByFleetTimeout(url,id);
        },
        getFlotasbyCliente:function(url,id){
            return getFlotasbyCliente(url,id);
        },
        getTrucksByFlota:function(url,id){
            return getTrucksByFlota(url,id);
        },
        getTruckModelsbyMarca:function(url,id){
            return getTruckModelsbyMarca(url,id);
        },
        getPressureTypeByTruckType:function(url,id){
            return getPressureTypeByTruckType(url,id);
        },
        insertTruck:function(url, lang, idFlota, idModelo, placas, anio, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo){
            return insertTruck(url, lang, idFlota, idModelo, placas, anio, tag, unidad, pressureType, tagInstalado, nombreOperador, tipo);
        },
        getTruckData:function(url,tag){
            return getTruckData(url,tag);
        },
        insertTruckHistorial:function(url, userId, tag, marca, modelo, unidad, kilometros, placas, tagInstalado, kmZero, tipoInspeccion){
            return insertTruckHistorial(url, userId, tag, marca, modelo, unidad, kilometros, placas, tagInstalado, kmZero, tipoInspeccion);
        },
        insertTireHistorial:function(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, remanente, psi, comments, condiciones, tagDetectado, tireType){
            return insertTireHistorial(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, remanente, psi, comments, condiciones, tagDetectado, tireType);
        },
        insertTireHistorialRend:function(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, psi, comments, condiciones, tagDetectado, pos1_rem1, pos1_rem2, pos1_rem3, pos1_rem4, pos2_rem1, pos2_rem2, pos2_rem3, pos2_rem4, pos3_rem1, pos3_rem2, pos3_rem3, pos3_rem4){
            return insertTireHistorialRend(url, userId, tagId, historyId, brand, tireSize, model, position, tagInstalado, kilometraje, truckTag, psi, comments, condiciones, tagDetectado, pos1_rem1, pos1_rem2, pos1_rem3, pos1_rem4, pos2_rem1, pos2_rem2, pos2_rem3, pos2_rem4, pos3_rem1, pos3_rem2, pos3_rem3, pos3_rem4);
        },
        getCustomerNumber:function(url,id){
            return getCustomerNumber(url,id);
        },
        reporteMensual:function(url,e){
            return reporteMensual(url,e);
        },   
        loadUnidadesStatus:function(url,i,y,m,s){
            return loadUnidadesStatus(url,i,y,m,s);
        },
        reporteMensualFechas:function(url,e,y,m){
            return reporteMensualFechas(url,e,y,m);
        },
        truckDetailsInspection:function(url,id){
            return truckDetailsInspection(url,id);
        },  
        graphPresiones:function(url, lang, initDate, endDate, flotas){
            return graphPresiones(url, lang, initDate, endDate, flotas);
        },
        graphDineroPr:function(url, lang, initDate, endDate, mesesDiv, flotas, price){
            return graphDineroPr(url, lang, initDate, endDate, mesesDiv, flotas, price);
        },
        loadCondiciones:function(url,idsSemaforos){
            return loadCondiciones(url,idsSemaforos);
        },  
        loadSemaforos:function(url,idsSemaforos){
            return loadSemaforos(url,idsSemaforos);
        },
        trucksDetailsSem:function(url,ids,color){
            return trucksDetailsSem(url,ids,color);
        },
        trucksDetailsCond:function(url,ids,cond){
            return trucksDetailsCond(url,ids,cond);
        },
        insertCustomer:function(url, lang, company, email, password, address, phone, contact, job, status, type, companyAssigned, customerAccount){
            return insertCustomer(url, lang, company, email, password, address, phone, contact, job, status, type, companyAssigned, customerAccount)
        },
        getCountriesAll:function(url){
            return getCountriesAll(url);
        },
        getStatesbyId:function(url,id){
            return getStatesbyId(url,id);
        },
        getCitiesbyId:function(url,id){
            return getCitiesbyId(url,id);
        },
        insertFleet:function(url, lang, idCliente, nombre, calle, colonia, ciudad, estado, pais, telefono, email, password, adminId, encargado, roldeCambio){
            return insertFleet(url, lang, idCliente, nombre, calle, colonia, ciudad, estado, pais, telefono, email, password, adminId, encargado, roldeCambio);
        },  
        graphAnalisis:function(url, lang, initDate, endDate, flotas){
            return graphAnalisis(url, lang, initDate, endDate, flotas);
        },
        graphSemaforos:function(url,initDate,endDate,flotas){
            return graphSemaforos(url,initDate,endDate,flotas);
        },
        getCustomerData:function(url, id){
            return getCustomerData(url, id);
        },
        getRendByFleet:function(url,s){
            return getRendByFleet(url,s);
        },
        getTiresByTruck:function(url,id){
            return getTiresByTruck(url,id);
        },
        getTireBrands:function(url){
            return getTireBrands(url);
        },    
        getTireSizebyBrand:function(url, id){
            return getTireSizebyBrand(url, id);
        },
        getTireDesignbySize:function(url, id){
            return getTireDesignbySize(url, id);
        },
        insertTire:function(url, lang, cliente, flota, unidad, marcaLlanta, tipoLlanta, medidaLlanta, disenoLlanta, precio, dot, tag, posicion, semaforo, desgaste, kilometraje, presion, tagInstalado, condiciones, inspTruckId){
            return insertTire(url, lang, cliente, flota, unidad, marcaLlanta, tipoLlanta, medidaLlanta, disenoLlanta, precio, dot, tag, posicion, semaforo, desgaste, kilometraje, presion, tagInstalado, condiciones, inspTruckId);            
        },
        custInfoData:function(url, id, company){
            return custInfoData(url, id, company);
        },
        addTireBrand:function(url, lang, brand){
            return addTireBrand(url, lang, brand);
        },
        addTireSize:function(url, lang, brandId, size){
            return addTireSize(url, lang, brandId, size);
        },  
        addTireModel:function(url, lang, sizeId, model, depth, type, km, initRem, minRem){
            return addTireModel(url, lang, sizeId, model, depth, type, km, initRem, minRem);
        },
        addTruckType:function(url, lang, nombre, numLlantas){
            return addTruckType(url, lang, nombre, numLlantas);
        },
        addPressure:function(url, lang, idTruckType, tireSize, layers, psi, maxPsi, minPsi, weight){
            return addPressure(url, lang, idTruckType, tireSize, layers, psi, maxPsi, minPsi, weight);
        },        
        addTruckBrand:function(url, lang, brand){
            return addTruckBrand(url, lang, brand);
        },
        addTruckModel:function(url, lang, brandId, model){
            return addTruckModel(url, lang, brandId, model);
        },
        getAllCustomers:function(url){
            return getAllCustomers(url);
        },
        sendTemporaryPassword:function(url, lang, email, userType){
            return sendTemporaryPassword(url, lang, email, userType);
        },
        setNewPassword:function(url, lang, email, userType, newPassword){
            return setNewPassword(url, lang, email, userType, newPassword);
        },
        getHistoryByTag:function(url, tag){
            return getHistoryByTag(url, tag);
        },
        messageToInspection:function(url, lang, id, message){
            return messageToInspection(url, lang, id, message);
        },
        visitCustomerFinished:function(url, lang, idCustomer){
            return visitCustomerFinished(url, lang, idCustomer);
        },
        insertHistorialFastCamion(url, lang, tagCamion, idUsuario, plataforma){
            return insertHistorialFastLlanta(url, lang, tagCamion, idUsuario, plataforma);
        },
        insertHistorialFastLlanta(url, lang, idHist, tagLlanta, tagDetect, position){
            return insertHistorialFastLlanta(url, lang, idHist, tagLlanta, tagDetect, position);
        },
        insertFastCamionMessage(url, lang, idHist, comment){
            return insertFastCamionMessage(url, lang, idHist, comment);
        }
    }
})

.service('$cordovaScreenshot', ['$q', function ($q){     
    return {
        capture: function (filename, extension, quality){
            extension = extension || 'jpg';
            quality = quality || '100';

            var defer = $q.defer();

            navigator.screenshot.save(function (error, res){
                if (error) {
                    console.error(error);
                    defer.reject(error);
                } else {
                    console.log('screenshot saved in: ', res.filePath);
                    defer.resolve(res.filePath);
                }
            }, extension, quality, filename);

            return defer.promise;
        }
    };
  
}])

.service('versionSvc', function() {
    var self = this;
    self.ver = '1.0.0';
    return self;
})
