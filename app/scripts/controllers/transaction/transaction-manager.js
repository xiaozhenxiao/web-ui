angular
    .module('pulse')
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    })
    .controller('transactionManagerCtl', transactionManagerCtl);
function transactionManagerCtl($scope, API, $location) {
    $scope.transactionDetail = {};
    $scope.transactionDetail.item = "";
    $scope.sortColumn = "serviceTime";
    $scope.sortSeq = "asc";
    $scope.pages = [];
    $scope.totalPageNumber = 0;
    $scope.curPageNo = 1;
    $scope.filter_user_name = "";
    $scope.filter_phone = "";
    $scope.filter_pay_type = "";
    $scope.filter_market_type = "";
    $scope.filter_begin_time = "";
    $scope.filter_end_time = "";
    $scope.ignore_list = [];
    var titles = [];
    titles.push("trade_volume_title");
    titles.push("trade_money_title");
    titles.push("trade_volume_day_title");
    titles.push("trade_money_day_title");
    titles.push("chain_title");
    titles.push("yoy_title");
    showTitle(titles);
    hopscotch.endTour();
    var beginTime = $("#inputBeginTime");
    var endTime = $("#inputEndTime");
    ////当前时间-24h
    //var nowBegin = $.myTime.UnixToDate($.myTime.UnixTime(-24));
    ////当前时间
    //var nowEnd = $.myTime.UnixToDate($.myTime.UnixTime());
    //beginTime.val(nowBegin);
    //endTime.val(nowEnd);
    beginTime.datetimepicker({
        format: 'Y-m-d H:00:00',
        lang: 'ch'
    });
    endTime.datetimepicker({
        format: 'Y-m-d H:00:00',
        lang: 'ch'
    });
    var defaultParam = "param_page_no=1&";
    select(defaultParam, $scope, API);
    $scope.detail = function(transactionDetail) {
        $scope.transactionDetail = transactionDetail;
        showDialog($scope);
    };
    $scope.close = function() {
        hideDialog($scope);
    };
    $scope.sortPages = function(type) {
        $scope.sortColumn = type;
        $scope.reverse = $scope.predicate == type && !$scope.reverse;
        $scope.predicate = type;
        var style;
        if (!$scope.reverse) {
            $scope.sortSeq = "desc";
            style = 'fa fa-sort-amount-desc';
        } else {
            $scope.sortSeq = "asc";
            style = 'fa fa-sort-amount-asc';
        }
        filterSelect($scope, API, $scope.curPageNo);
        $scope.transaction_style_transaction_id = "";
        $scope.transaction_style_user_id = "";
        $scope.transaction_style_user_name = "";
        $scope.transaction_style_phone = "";
        $scope.transaction_style_transaction_time = "";
        $scope.transaction_style_transaction_money = "";
        switch (type) {
            case 'serviceId':
                $scope.transaction_style_transaction_id = style;
                break;
            case 'userId':
                $scope.transaction_style_user_id = style;
                break;
            case 'userName':
                $scope.transaction_style_user_name = style;
                break;
            case 'phone':
                $scope.transaction_style_phone = style;
                break;
            case 'serviceTime':
                $scope.transaction_style_transaction_time = style;
                break;
            case 'price':
                $scope.transaction_style_transaction_money = style;
                break;
        }

    };
    $scope.transactionFilter = function(pageNo) {
        filterSelect($scope, API, pageNo);
    };
    $scope.reset = function() {
        $scope.filter_user_name = "";
        $scope.filter_phone = "";
        $scope.filter_pay_type = "";
        $scope.filter_market_type = "";
        $("#inputBeginTime").val("");
        $("#inputEndTime").val("");
    };
    $scope.sortPages("serviceTime");
}
function filterSelect($scope, API, pageNo) {
    if (!pageNo) {
        pageNo = $scope.curPageNo;
    } else {
        $scope.curPageNo = pageNo;
    }
    var filterBeginTime = $("#inputBeginTime").val();
    var filterEndTime = $("#inputEndTime").val();
    var queryParams = "param_page_no=" + pageNo + "&";
    if ($scope.filter_user_name) {
        queryParams += "param_user_name=" + $scope.filter_user_name + "&";
    }
    if ($scope.filter_phone) {
        queryParams += "param_phone=" + $scope.filter_phone + "&";
    }
    if ($scope.filter_pay_type) {
        queryParams += "param_payment=" + $scope.filter_pay_type + "&";
    }
    if ($scope.filter_market_type) {
        queryParams += "param_market=" + $scope.filter_market_type + "&";
    }
    if (filterBeginTime) {
        queryParams += "param_begin_time=" + filterBeginTime.replace(" ", "%20") + "&";
    }
    if (filterEndTime) {
        queryParams += "param_end_time=" + filterEndTime.replace(" ", "%20") + "&";
    }
    if ($scope.sortColumn) {
        queryParams += "param_sort_column=" + $scope.sortColumn + "&";
    }
    if ($scope.sortSeq) {
        queryParams += "param_sort_seq=" + $scope.sortSeq + "&";
    }
    select(queryParams, $scope, API);

};
function select(params, $scope, API) {
    showLoadingDialog($scope);
    API.transactionManager(params, function(data) {
        console.log(data);
        $scope.transactionManagerList = data;
        hideLoadingDialog($scope);
    }, function(){
        alert("get data error");
    });
    API.transactionManagerStatistics(params, function(data) {
        $scope.pages = [];
        console.log(data);
        $scope.transactionManagerStatistics = data;
        $scope.totalPageNumber = data.count%10==0?data.count/10:parseInt(data.count/10+1);
        for (var i=(($scope.curPageNo<5)?0:($scope.totalPageNumber-$scope.curPageNo)>5?$scope.curPageNo-5:$scope.totalPageNumber-9);
             i<($scope.curPageNo<5?($scope.totalPageNumber>9? 9:$scope.totalPageNumber)
                 :($scope.curPageNo+4>$scope.totalPageNumber?$scope.totalPageNumber
                 :($scope.curPageNo+4)));i++) {
            $scope.pages.push(i+1);
        }
    }, function() {
        alert("get data error");
    });
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
function showLoadingDialog($scope) {
    $scope.model_background_style_loading = {'z-index': 1051,display:'block',opacity:0.05};
    $scope.model_background_in_loading = true;
    $scope.loading_style = {'z-index': 1052,display:'block',position: 'absolute',top: '37%',left: '50%'};
}
function hideLoadingDialog($scope) {
    $scope.model_background_style_loading = {'z-index': 1051,display:'none'};
    $scope.model_background_in_loading = false;
    $scope.loading_style = {'z-index': 1052,display:'none',position: 'absolute',top: '50%',left: '50%'};
}
function showTitle(titleIds) {
    $(document).click(function(e) {
        var clickDom = $(e.target);
        for (var i=0;i<titleIds.length;i++) {
            if($(".popover") && !(clickDom.hasClass("popover") || clickDom.hasClass("popover-title") || clickDom.hasClass("popover-content"))) {
                $(".popover").removeClass("in");
                $("#" + titleIds[i]).removeAttr("aria-describedby");
                $(".popover").remove();
            }
        }
        clickDom.popover("show");
    });
}