import quagga from 'quagga/dist/quagga';

export default () => {

    return {
        restrict: 'E',
        scope: {
            type: '@',
            onDetected: '&',
            onProcessed: '&'
        },
        template: '<div id="interactive" class="viewport"></div>',      // Fallback until https://github.com/serratus/quaggaJS/pull/89 has been merged
        bindToController: true,
        controllerAs: 'vm',
        controller: ReaderCtrl
    }
};

ReaderCtrl.$inject = ['$scope'];

function ReaderCtrl($scope) {

    var vm = this;

    quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream"
        },
        decoder : {
            readers : [vm.type + '_reader']
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }

        quagga.start();
    });

    quagga.onProcessed(_onProcessed);
    quagga.onDetected(_onDetected);

    function _onProcessed(result) {
        if(vm.onProcessed) {
            vm.onProcessed({result: result});
        }
    }

    function _onDetected(result) {
        if(vm.onDetected) {
            vm.onDetected({result: result});
        }
    }

    $scope.$on('destroy', function() {
        quagga.offProcessed(_onProcessed);
        quagga.offDetected(_onDetected);
    });
}