angular.module('slider', ['ionic', 'ionic-material', 'ionMdInput', 'ngAnimate', 'pascalprecht.translate', 'ngSanitize', 'ngStorage', 'ngCordova.plugins.nfc', 'nfcFilters', 'ngRoute', 'ngCordova'])
    .controller('SliderCtrl', function($ionicPlatform, $scope, $ionicSideMenuDelegate, ionicMaterialInk, $localStorage, $ionicHistory, $state, $timeout) {


        $scope.options = {
            loop: false,
            effect: 'slide-left-right',
            speed: 500,
        }

        $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
            // data.slider is the instance of Swiper
            $scope.slider = data.slider;
            $localStorage.navBarVisible = 'none'
            $scope.data.display = $localStorage.navBarVisible;
        });

        $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
            $ionicSideMenuDelegate.canDragContent(false);
        });

        $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
            // note: the indexes are 0-based
            $scope.activeIndex = data.slider.activeIndex;
            $scope.previousIndex = data.slider.previousIndex;
        });

        $scope.$on('$ionicView.enter', function() {
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function() {
            $ionicSideMenuDelegate.canDragContent(true);
        });

        $scope.init = function() {
            $localStorage.navBarVisible = 'none'
            $scope.data.display = $localStorage.navBarVisible;
            if ($localStorage.languague === undefined) {
                $localStorage.languague = 'es'
            } else {
                $scope.languague = $localStorage.languague;
                $scope.data.languague = $localStorage.languague;
            }
            $ionicHistory.clearCache().then(function() {
                $state.go('app.slider', {
                    animation: 'slide-in-down'
                });
            });
        }

        $scope.exit = function() {
            $localStorage.navBarVisible = 'block'
            $scope.data.display = $localStorage.navBarVisible;
            $state.go('app.dashboard', {
                animation: 'slide-in-down'
            });
        }
    })