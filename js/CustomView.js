var { requireNativeComponent, PropTypes, View } = require('react-native');

var iface = {
  propTypes: {
    ...View.propTypes,
    source: PropTypes.string,
  },
};

module.exports = requireNativeComponent('CustomView', iface);