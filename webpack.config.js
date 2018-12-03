var path = require('path')
// var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// var CompressionPlugin = require('compression-webpack-plugin')
var smp = new SpeedMeasurePlugin()
var neat = require('bourbon-neat').includePaths

// Basic Configuration
let config = {
  entry: {
    main: './src/assets/javascript/main.js',
    vue: './src/assets/javascript/vue',
    vendor: [
      'jquery',
      'vue',
      'vuex'
    ]
  },
  watch: true,
  resolve: {
    alias: {
      'scss-loader': 'sass-loader',
      'vue$': 'vue/dist/vue.esm.js',
      'styles': path.resolve(__dirname, 'src/assets/stylesheet'),
      '@root': path.resolve(__dirname, 'src/assets/javascript')
      // '@vendor': path.resolve(__dirname, 'src/assets/javascript/vendor')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: { rules: [] },
  plugins: [],
  node: { fs: 'empty' }
}

// Plugins
config.plugins.push(
  new CopyWebpackPlugin([
    { from: './src/layout', to: '../', debug: 'info' }
  ])
)

config.plugins.push(
  new ExtractTextPlugin({
    filename: '[name].css',
    disable: false,
    allChunks: true
  })
)

// config.plugins.push(
//   new UglifyJSPlugin()
// )

// config.plugins.push(
//   new CompressionPlugin({
//     filename: '[path].gz[query]',
//     algorithm: 'gzip',
//     test: /\.(js|scss)$/,
//     threshold: 10240,
//     minRatio: 0.8
//   })
// )

// Webpack Modules

config.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        publicPath: '//localhost/quest-manager/dist/assets/'
      }
    }
  ]
})

config.module.rules.push({
  test: /\.scss/,
  loader: 'import-glob-loader',
  enforce: 'pre'
})

config.module.rules.push({
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      'presets': [
        ['env', {
          'targets': {
            'browsers': ['last 2 versions', 'safari >= 7']
          }
        }]
      ]
    }
  }
})

// config.module.rules.push({
//   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
//   loader: 'url-loader',
//   options: {
//     limit: 10000,
//     name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
//   }
// })

config.module.rules.push({
  test: /\.vue$/,
  use: [
    'vue-loader'
  ]
})

config.module.rules.push({
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            path.resolve(neat[0])
          ]
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, 'src/assets/stylesheet', 'base.scss')
          ]
        }
      }
    ]
  })
})

config.module.rules.push({
  test: /\.(woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader',
  options: {
    limit: 10000
  }
})

module.exports = smp.wrap(config)
