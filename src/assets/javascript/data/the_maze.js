export default {
  objectives: {
    stairway: {
      type: 'objective',
      label: 'stairway',
      draggable: false,
      attributes: {
        rotation: 0,
        tiles: ['8:12', '8:13', '9:12', '9:13'],
        life: false,
        attack: 0,
        defense: 0,
        move: 0
      }
    }
  },
  map: {
    doors: [{
      tiles: ['2:0', '2:1'],
      rotation: 90
    }, {
      tiles: ['2:4', '2:5'],
      rotation: 90
    }, {
      tiles: ['2:8', '2:9'],
      rotation: 90
    }]
  },
  components: {
    barbarian: {
      type: 'hero',
      label: 'barbarian',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['0:0'],
        life: 8,
        attack: 3,
        defense: 2,
        move: 8
      }
    },
    dwarf: {
      type: 'hero',
      label: 'dwarf',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['0:25'],
        life: 8,
        attack: 3,
        defense: 2,
        move: 10
      }
    },
    elf: {
      type: 'hero',
      label: 'elf',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['18:25'],
        life: 6,
        attack: 2,
        defense: 2,
        move: 10
      }
    },
    wizard: {
      type: 'hero',
      label: 'wizard',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['18:0'],
        life: 6,
        attack: 2,
        defense: 2,
        move: 10
      }
    }
  }
}
