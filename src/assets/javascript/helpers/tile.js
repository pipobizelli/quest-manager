export default (map) => {
  var getTilebyHandle = (handle) => {
    if (window.typeof(handle) === 'string') {
      return {
        l: parseInt(handle.split(':')[0]),
        c: parseInt(handle.split(':')[1])
      }
    }

    return handle
  }

  var getTile = (tile, index) => {
    var tileObj = getTilebyHandle(tile)

    if (index) {
      switch (index) {
        case 'top':
        case 'up':
          if (tileObj.l > 0) {
            tileObj.l = tileObj.l - 1
          }
          break
        case 'down':
        case 'bottom':
          if (tileObj.l < parseInt(map.tiles.lines) - 1) {
            tileObj.l = tileObj.l + 1
          }
          break
        case 'left':
        case 'next':
          if (tileObj.c > 0) {
            tileObj.c = tileObj.c - 1
          }
          break
        case 'right':
        case 'prev':
          if (tileObj.c < parseInt(map.tiles.columns) - 1) {
            tileObj.c = tileObj.c + 1
          }
          break
        default:
          tileObj = false
      }

      return tileObj
    }
  }

  var getNextTile = (tile) => {
    return getTile(tile, 'next')
  }

  var getPrevTile = (tile) => {
    return getTile(tile, 'prev')
  }

  var getUpTile = (tile) => {
    return getTile(tile, 'up')
  }

  var getDownTile = (tile) => {
    return getTile(tile, 'down')
  }

  var getTileConfig = (t) => {
    var tile = getTilebyHandle(t)
    var n = (map.tiles.columns * tile.l) + tile.c
    return this.map.config[n]
  }

  return {
    getTile,
    getTilebyHandle,
    getNextTile,
    getPrevTile,
    getUpTile,
    getDownTile,
    getTileConfig
  }
}
