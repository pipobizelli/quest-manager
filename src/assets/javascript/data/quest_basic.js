const quest = {
  current_turn: 0,
  active_actor: '',
  objective: {
    chest: {
      type: 'objective',
      label: 'chest',
      draggable: false,
      attributes: {
        open: false,
        rotation: 180,
        tiles: ['5:11'],
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
        tiles: ['0:14'],
        life: 8,
        attack: 3,
        defense: 2,
        move: 8
      }
    },
    elf: {
      type: 'hero',
      label: 'elf',
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

export default quest
