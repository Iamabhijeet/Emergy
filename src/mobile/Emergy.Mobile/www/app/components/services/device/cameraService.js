(function () {
    'use strict';

    function cameraService($cordovaCamera) { 
         /*var photoOptions = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation: true
         };

        var videoOptions = {
            destinationType: 1,
            sourceType: 0,
            mediaType: 1
        };*/

        var takePhotoFromCamera = function () {
            return $cordovaCamera.getPicture(/*photoOptions*/);
        };

        var selectVideo = function () {
            return $cordovaCamera.getPicture(/*videoOptions*/);
        };

        var factory = {
            takePhotoFromCamera: takePhotoFromCamera, 
            selectVideo: selectVideo
        };
        return factory;
    };

    services.factory('cameraService', cameraService);

    cameraService.$inject = ['$cordovaCamera'];
})();