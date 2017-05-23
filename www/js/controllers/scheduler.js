angular.module('scheduler', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova', 'ui.rCalendar'])
    .controller('SchedulerCtrl', function($ionicPlatform, $scope, $cordovaLocalNotification, $timeout) {

        $scope.add = function() {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes() + 1);
            $cordovaLocalNotification.add({
                id: "1234",
                date: alarmTime,
                message: "Notificaciones de Pruebas ;)",
                title: "Mi Llanta Auditor",
                autoCancel: true,
                sound: 'file://ogg/Chime.ogg',
                icon: 'file://img/icon_truck_blank.png'
            }).then(function() {
                navigator.vibrate(1000);
            });
        };

        $ionicPlatform.onHardwareBackButton(function() {
            e.stopPropagation();
            alert('you sure you want to exit?');
        });        

        $scope.isScheduled = function() {
            $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                alert("Notification 1234 Scheduled: " + isScheduled);
            });
        }
        $scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
        };

        $scope.loadEvents = function () {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function (event) {
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
        };

        $scope.today = function () {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function () {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function (selectedTime, events, disabled) {
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0) + ', disabled: ' + disabled);
        };


    })
