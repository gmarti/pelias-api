
module.exports = function( params ){
  var scriptsConfig = [
    {
      '_script': {
        'file': 'admin_boost',
        'type': 'number',
        'order': 'desc'
      }
    },
    {
      '_script': {
        'file': 'popularity',
        'type': 'number',
        'order': 'desc'
      }
    },
    {
      '_script': {
        'file': 'population',
        'type': 'number',
        'order': 'desc'
      }
    }
  ];

  return scriptsConfig;
};
