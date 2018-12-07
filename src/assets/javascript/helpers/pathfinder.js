import $ from 'jquery'
import Tile from './tile'
export default (map) => {
  var getPossibilities = (tile) => {
    var tileUp = Tile(map).getUpTile(tile)
    var tileDown = Tile(map).getDownTile(tile)
    var tileLeft = Tile(map).getPrevTile(tile)
    var tileRight = Tile(map).getNextTile(tile)
    var config = map.config[tile].config.split('')
    var arr = []

    if (config[0] === '0') {
      arr.push(`${tileUp.l}:${tileUp.c}`)
    }

    if (config[1] === '0') {
      arr.push(`${tileRight.l}:${tileRight.c}`)
    }

    if (config[2] === '0') {
      arr.push(`${tileDown.l}:${tileDown.c}`)
    }

    if (config[3] === '0') {
      arr.push(`${tileLeft.l}:${tileLeft.c}`)
    }

    return arr
  }

  var getAllPaths = (tile, arr = []) => {
    // map.config[tile].path = true
    arr.push(tile)
    $(`[data-tile='${tile}']`).addClass('tile--green')
    var pos = getPossibilities(tile)
    for (var p in pos) {
      var t = pos[p]
      // if (!map.config[pos[p]].path) {
      if (arr.indexOf(t) < 0) {
        getAllPaths(t, arr)
      }
    }
    return arr
  }

  var getPath = (start, target) => {
    var path = []
    var lines = getProgression(start.l, target.l)
    var columns = getProgression(start.c, target.c)
    var lastLine = start.l
    var lastCollumn = start.c

    for (var l in lines) {
      lastLine = lines[l]
      path.push(`${lastLine}:${lastCollumn}`)
    }

    for (var c in columns) {
      lastCollumn = columns[c]
      if (path.indexOf(`${lastLine}:${lastCollumn}`) < 0) {
        path.push(`${lastLine}:${lastCollumn}`)
      }
    }

    return path
  }

  var getProgression = (a, b) => {
    var arr = []
    if (a < b) {
      while (a <= b) {
        arr.push(a)
        a++
      }
    } else if (a >= b) {
      while (a >= b) {
        arr.push(a)
        a--
      }
    } else {
      arr.push(a)
    }

    return arr
  }

  return {
    getPath,
    getAllPaths
  }
}
