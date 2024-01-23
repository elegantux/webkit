((w) => {

  w.webkit = {
    webkitBackendUrls: w.webkitBackendUrls,
    plugins: {
      functions: [],

      add: function(func) {
        if (typeof func === 'function') {
          this.functions.push(func);
        } else {
          console.error('[webkit.plugins.add] Argument is not a function!');
        }
      },

      // Метод 'getAll', который возвращает все добавленные функции
      getAll: function() {
        return this.functions;
      }
    },
    getCsrf() {
      var matches = document.cookie.match(new RegExp("(?:^|; )_csrf=([^;]*)"));
      if (matches && matches[1]) {
        return decodeURIComponent(matches[1]);
      }
      return '';
    }
  };

})(window);