;(function () {
  document.addEventListener('UniAppJSBridgeReady', function () {
    const uw = uni.webView

    let env = ''
    uw.getEnv((res) => {
      env = Object.keys(res).filter(function (k) {
        return res[k]
      })
    })

    const events = ['DOMContentLoaded', 'load', 'unload', 'hashchange'],
      postMessage = (event, payload = {}) =>
        uw.postMessage({ data: { event, payload } })

    events.forEach((evt) => {
      window.addEventListener(evt, () => {
        alert(evt)
        postMessage(evt, { env, url: location.href, hash: location.hash })
      }, false)
    })
  })
})()
