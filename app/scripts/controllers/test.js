angular
    .module('pulse')
    .controller('testCtl', testCtl);
function testCtl($scope, API, $location) {
    API.test(function(data) {
        $scope.userList = data;
    }, function(){
        alert("get data error");
    });
    $scope.detail = function(userName, userSex, userAge) {
        $scope.userDetail = {};
        $scope.userDetail.name = userName;
        $scope.userDetail.sex = userSex;
        $scope.userDetail.age = userAge;
        showDialog($scope);
    };
    $scope.close = function() {
        hideDialog($scope);
    };
}
function showDialog($scope) {
    $scope.model_background_style = {'z-index': 1040,display:'block'};
    $scope.model_background_in = true;
    $scope.model_style_edit = {display:'block'};
    $scope.model_in_edit = true;
}
function hideDialog($scope) {
    $scope.model_background_style = {'z-index': 1040,display:'none'};
    $scope.model_background_in = false;
    $scope.model_style_edit = {display:'none'};
    $scope.model_in_edit = false;
}