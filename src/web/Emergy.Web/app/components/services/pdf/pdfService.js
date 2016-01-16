(function () {
    'use strict';

    services.service('pdfService', pdfService);
    pdfService.$inject = ['$q'];

    function pdfService($q) {
        return {
            generate: function (report) {
                var deffered = $q.defer();
                html2canvas(document.getElementById('report-document'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        var options = {
                            content: [{
                                image: data
                            }]
                        };
                        pdfMake.createPdf(options).download('report' + report.Id);
                        deffered.resolve();
                    }
                });
                return deffered.promise;
            }
         
        }
    }
})();