;(function () {
  document.addEventListener('UniAppJSBridgeReady', function () {
    const uw = uni.webView

    let env = ''
    uw.getEnv((res) => {
      env = Object.keys(res).filter(function (k) {
        return res[k]
      })
    })

    let oldURL = location.href

    const _override = function (type) {
      var origin = history[type]
      return function () {
        var rv = origin.apply(this, arguments)
        var e = new Event(type)
        e.newURL = arguments[2]
        e.oldURL = oldURL
        oldURL = location.href
        window.dispatchEvent(e)
        return rv
      }
    }

    history.pushState = _override('pushState')
    history.replaceState = _override('replaceState')

    const events = [
        'DOMContentLoaded',
        'load',
        'unload',
        'hashchange',
        'popstate',
        'pushState',
        'replaceState',
      ],
      postMessage = (type, payload = {}) =>
        uw.postMessage({ data: { type, payload } })

    events.forEach((type) => {
      window.addEventListener(
        type,
        () => {
          if (type === 'popstate') history.go(-1)
            
          setTimeout(
            () =>
              postMessage(type, {
                env,
                url: location.href,
                hash: location.hash,
                title: document.title,
                canBack: history.length > 1
              }),
            300
          )
        },
        false
      )
    })
  })
})()
