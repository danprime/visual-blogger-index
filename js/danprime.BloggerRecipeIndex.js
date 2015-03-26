//Version 0.1
//AngularJS Directive Recipe Index for Blogger
//
//Description: Creates a custom element <recipeindex></recipeindex> which
//will be populated by an unstylized nested list of posts grouped by labels.
//Usage:
// 1) Include the AngularJS (1.3) src Library in the header of the page.
// 2)
// 3) Insert the CUSTOM html tag:
//
//          <recipeindex blogid="YOUR_BLOG_ID"
//                       labels="['label1', 'label2']"
//                       include-images="true|false" //TODO
//                       apikey="OPTIONAL_API_KEY"> //TODO
//          </recipeindex>
//
//Author: Daniel Tse - danprime@gmail.com
//Date: Sept 27, 2014


angular.module('danprime.BloggerRecipeIndex', [])
//todo abstract http calls into service.

.directive('recipeindex', ['$http', function($http) {

      function link(scope, element, attrs) {

        var BASEURL = "https://www.googleapis.com/blogger/v3/blogs/"+scope.blogid;
        var APIKEY = 'AIzaSyB-Tfq4W-2mmGlOGau_E8fGoJu01yC3K1A';
        var labelArray = [];

        //private function declarations / implementation
        function splitLabels() {
          if (scope.labels != null) {
            labelArray = scope.labels.split(',');
            return true;
          }

          return false;

        }

        function getPostsForLabel(labelString) {
          return $http.get(BASEURL+'/posts?maxResults=150&fetchImages='+scope.includeImages+'&labels='+labelString+'&key='+APIKEY).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              //console.log("returned for" + labelString + "is: " + data.items);
              //scope.tags[labelString] = data.items;

              parsePostList(labelString, data.items);

            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("Error " + status);
            });
        }

        function parsePostList(labelString, postItems) {
          var tag = new Object();
          tag.name = labelString;
          tag.recipes = [];

          if (postItems != null) {

            for (var i = postItems.length - 1; i >= 0; i--) {
                  tag.recipes.push(parsePost(postItems[i]));
                };

          }

          scope.tags.push(tag);
        }

        function parsePost(post) {
          var newPost = [];
          newPost.link = post.url;
          newPost.title = post.title;

          if (post.images != null) {
            newPost.thumbnailsrc = post.images[0].url;
          }

          return newPost;
        }

        //Listeners
        scope.$on('event', function(result) {

        });

        //Cleanup Event
        element.on('$destroy', function() {
          //Clean up any memory (like timers)

        });

        // //Initialization Code
        scope.labels.forEach(getPostsForLabel);

      }

      return {
        restrict: 'E',  //Restricts to only element as a target
        replace: true,  //Replaces the custom tag with the template
        transclude: true,
        template: '<ul class="dmkt_bri_recipeindex">'+
                    '<li ng-repeat="tag in tags"><h2>{{tag.name}}</h2>'+
                      '<ul>'+
                        '<li ng-repeat="recipepost in tag.recipes">'+
                            '<div class="dmkt_bri_recipecard"><a href="{{recipepost.link}}" class="dmkt_bri_recipelink"><img ng-src="{{recipepost.thumbnailsrc}}" title="{{recipepost.title}}" class="dmkt_bri_recipethumbnail"/><strong class="dmkt_bri_recipeheading">{{recipepost.title}}</strong></a></div>'+
                        '</li>'+
                      '</ul>'+
                    '</li>'+
                  '</ul>',
        scope: {
          //Define scope variables within directive
          //variable1: '&', //means attribute name is the same as the value you want to bind to inside the directive's scope
          blogid: '@blogid', //Must be called scope.blogid
          includeImages: '=', //Must be called scope.includeImages
          labels: '='
        },
        controller: function($scope, $sce, $http) {
            //Variable Declaration & Initialization

            $scope.tags = [];

          }, //controller
        link:link //link
    };
  }])