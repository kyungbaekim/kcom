// config/auth.js
// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth' : {
    'clientID'      : '830939537053112', // your App ID
    'clientSecret'  : '21c3bf69aae29a7b0f8733bd08596d19', // your App Secret
    'callbackURL'   : 'http://localhost:8000/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'   : 'fYkuMofd3qyExakGaQkiTcQOe',
    'consumerSecret': 'LasSn0Iy8l6gWFjGbOA1vf4lcnDwywNIylfSt9xepYD3V4mxm6',
    'callbackURL'   : 'http://localhost:8000/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '386621777502-43rm4pc57s574os8rtejne3s13l9cug6.apps.googleusercontent.com',
    'clientSecret'  : 'BJYQumw0ZjusMY2duoq0Cax9',
    'callbackURL'   : 'http://localhost:8000/auth/google/callback'
  }
};
