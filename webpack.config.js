var path = require('path')
// var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var CompressionPlugin = require('compression-webpack-plugin')
var neat = require('bourbon-neat').includePaths

// Basic Configuration

let config = {
  entry: {
    layout: './src/assets/javascript/layout',
    checkout_layout: './src/assets/javascript/checkout',
    checkout_page: './src/assets/javascript/pages/checkout/checkout.js',
    product: './src/assets/javascript/pages/product/product.js',
    account: './src/assets/javascript/pages/account/account.js',
    activate: './src/assets/javascript/pages/activate/activate.js',
    login: './src/assets/javascript/pages/login/login.js',
    // login_modal: './src/assets/javascript/pages/login_modal/login_modal.js',
    register: './src/assets/javascript/pages/register/register.js',
    stock_problem: './src/assets/javascript/pages/stock_problem/stock_problem.js',
    checkout_success: './src/assets/javascript/pages/checkout_success/checkout_success.js',
    history: './src/assets/javascript/pages/history/history.js',
    xmas: './src/assets/javascript/pages/xmas/xmas.js',
    landing: './src/assets/javascript/pages/landing/landing.js',
    // collection2: './src/assets/javascript/pages/collection2/collection2.js',
    collection3: './src/assets/javascript/pages/collection3/collection3.js',
    search: './src/assets/javascript/pages/search/search.js',
    vue: './assets/javascript/vue',
    vendor: [
      'jquery',
      'vue',
      'vuex'
    ]
  },
  resolve: {
    alias: {
      'scss-loader': 'sass-loader',
      'vue$': 'vue/dist/vue.esm.js',
      // 'fonts': path.resolve(__dirname, 'src/assets/stylesheet/fonts'),
      'styles': path.resolve(__dirname, 'assets/stylesheet'),
      '@root': path.resolve(__dirname, 'assets/javascript'),
      '@vendor': path.resolve(__dirname, 'assets/javascript/vendor')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'source')
  },
  module: { rules: [] },
  plugins: [],
  node: { fs: 'empty' }
}

// Plugins
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
      options: {}
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
            path.resolve(__dirname, 'src/assets/stylesheet', 'fonts/font-face.scss'),
            path.resolve(__dirname, 'src/assets/stylesheet', 'base.scss')
          ]
        }
      }
    ]
    // publicPath: './theme/assets'
  })
})

config.module.rules.push({
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader',
  options: {
    limit: 10000
  }
})

module.exports = {
  config
}
