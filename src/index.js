import angular from 'angular';

angular
    .module('angular-quagga-js', [])
    .directive('dmQuaggaReader', require('./directives/reader'))
    .run(Run);

function Run() {
}