var app = angular.module('app', ['$strap.directives']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/', {templateUrl: './content/md/what-is-smartparam.md'});

    $httpProvider.defaults.transformResponse.push(markdownResponseTransformer);
}]);

var markdownResponseTransformer = function(data, headersGetter) {
    var contentType = headersGetter()['content-type'];
    if(contentType.indexOf('text/plain') >= 0 || contentType.indexOf('text/x-markdown') >= 0) {
        return marked(data);
    }
    return data;
};

app.directive('markdownstrap', function() {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {

            scope.$on('$viewContentLoaded', function() {
                element.find('table').addClass('table table-bordered table-condensed');
            });


        }
    };
});