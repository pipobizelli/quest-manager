const quest = {
  current_turn: 0,
  active_actor: '',
  objective: {},
  map: {
    doors: [{
      tiles: ['2:4', '2:5'],
      rotation: 0
    }, {
      tiles: ['3:7', '4:7'],
      rotation: 90
    }, {
      tiles: ['5:4', '5:5'],
      rotation: 90
    }],
    blocks: [{
      tiles: ['0:12', '0:13'],
      rotation: 0
    }, {
      tiles: ['9:0'],
      rotation: 0
    }]
  },
  components: {
    barbarian: {
      type: 'hero',
      label: 'barbarian',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['2:2'],
        life: 8,
        attack: 3,
        defense: 2,
        move: 10
      }
    },
    dwarf: {
      type: 'hero',
      label: 'dwarf',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['2:1'],
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
        tiles: ['1:2'],
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
        tiles: ['1:1'],
        life: 6,
        attack: 2,
        defense: 2,
        move: 10
      }
    },
    goblin: {
      type: 'monster',
      label: 'goblin',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['7:7'],
        life: 1,
        attack: 2,
        defense: 1,
        move: 10
      }
    },
    orc: {
      type: 'monster',
      label: 'orc',
      draggable: true,
      attributes: {
        rotation: 0,
        tiles: ['6:6'],
        life: 1,
        attack: 3,
        defense: 1,
        move: 10
      }
    },
    stairway: {
      type: 'interactive',
      label: 'stairway',
      draggable: false,
      attributes: {
        rotation: 0,
        tiles: ['1:1', '1:2', '2:1', '2:2'],
        life: false,
        attack: 0,
        defense: 0,
        move: 0
      }
    },
    table: {
      type: 'object',
      label: 'table',
      draggable: false,
      attributes: {
        rotation: 0,
        tiles: ['7:2', '7:3', '7:4', '8:2', '8:3', '8:4'],
        life: false,
        attack: 0,
        defense: 0,
        move: 0
      }
    }
  }
}

export default quest
