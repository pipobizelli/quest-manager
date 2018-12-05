import $ from 'jquery'

export default () => {
  return {
    load (payload) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `./`,
          data: payload,
          xhrFields: {
            withCredentials: true
          },
          method: 'POST'
        }).then(function (customer) {
          resolve(customer)
        }).catch((e) => {
          reject(e)
        })
      })
    }
  }
}
