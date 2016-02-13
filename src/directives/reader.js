import quagga from 'quagga/dist/quagga';

require('./reader.css');
const tmpl = require('./reader.html');

export default () => {

    return {
        restrict: 'E',
        scope: {
            type: '@',
            onDetected: '&',
            onProcessed: '&',
            showRectangles: '@'

        },
        templateUrl: tmpl,
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

        if(vm.showRectangles) {
            var drawingCtx = quagga.canvas.ctx.overlay,
                drawingCanvas = quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                    });
                }

                if (result.box) {
                    quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                }

                if (result.codeResult && result.codeResult.code) {
                    quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                }
            }
        }

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