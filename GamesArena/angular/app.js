const app = angular.module("app", []);

app.factory("gamesFactory", function ($http) {
  const factory = {};

  factory.getList = function () {
    return $http({
      method: "GET",
      url:
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json",
      mode: "cors",
    });
  };

  return factory;
});

app.controller("gamesController", function ($scope, gamesFactory, $timeout) {
  $scope.allGames = [];
  $scope.games = [];
  $scope.search = "";
  $scope.showAutocomplete = false;

  $scope.sortValue = "1";
  $scope.sortOptions = [
    {
      label: "Sort by score",
      value: 1,
    },
    {
      label: "Asc",
      value: 2,
    },
    {
      label: "Desc",
      value: 3,
    },
  ];

  $scope.filterValue = "1";
  $scope.filterOptions = [
    {
      label: "Filter by platform",
      value: 1,
    },
    {
      label: "All",
      value: 2,
    },
    {
      label: "PlayStation Vita",
      value: "PlayStation Vita",
    },
    {
      label: "iPad",
      value: "iPad",
    },
  ];

  $scope.getGames = function () {
    gamesFactory.getList().then(function (res) {
      res.data.shift();
      $scope.allGames = res.data;
      $scope.games = res.data;
    });
  };

  $scope.getGames();

  $scope.onChange = function () {
    $scope.onChangeFilter();
    $scope.onChangeSearch();
    $scope.onChangeSort();
  };

  $scope.onChangeSearch = function () {
    $scope.games = $scope.games.filter((g) =>
      g.title.toLowerCase().includes($scope.search.toLowerCase())
    );
  };

  $scope.onChangeSort = function () {
    switch ($scope.sortValue) {
      case "2":
        $scope.games = $scope.games.sort((a, b) => {
          return a.score - b.score;
        });
        break;
      case "3":
        $scope.games = $scope.games.sort((a, b) => b.score - a.score);
        break;
      default:
        break;
    }
  };

  $scope.onChangeFilter = function () {
    switch ($scope.filterValue) {
      case "1":
      case "2":
        $scope.games = $scope.allGames;
        break;
      default:
        $scope.games = $scope.allGames.filter(function (g) {
          return g.platform == $scope.filterValue;
        });

        break;
    }
  };

  $scope.onSelectGame = (g) => {
    $scope.search = g.title;
    $scope.games = [g];
    $scope.showAutocomplete = false;
  };

  $scope.onFocusSearch = () => ($scope.showAutocomplete = true);
  $scope.onBlurSearch = function () {
    $timeout(function () {
      $scope.showAutocomplete = false;
    }, 250);
  };
});
