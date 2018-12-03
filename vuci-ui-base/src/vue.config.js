const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const address = require('address')

module.exports = {
  indexPath: 'vuci.html',
  productionSourceMap: false,
  devServer: {
      port: 19980,
    proxy: {
      '/ubus': {
        target: 'http:/localhost:19981'
      },
    }
  },
  configureWebpack: config => {
    if (process.env.ANALYZ) {
      let analyz = new BundleAnalyzerPlugin({
        analyzerHost: address.ip()
      });
      config.plugins.push(analyz)
    }
  }
}
