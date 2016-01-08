(function () {
    'use strict';

    function cameraService($cordovaCamera) {

        /*
         
         var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
         
         */

        var takePhotoFromCamera = function () {
            return $cordovaCamera.getPicture(/*options*/);
        };
        var factory = {
            takePhotoFromCamera: takePhotoFromCamera
        };
        return factory;
    };

    services.factory('cameraService', cameraService);

    cameraService.$inject = ['$cordovaCamera'];
})();