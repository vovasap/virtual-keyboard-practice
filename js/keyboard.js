const Keyboard = {
  elements: {
    main: null,
    keysContainerEng: null,
    keysContainerRu: null,
    keysCurrent: [],
    keysEng: [],
    keysRu: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div')
    this.elements.keysContainerEng = document.createElement('div')
    this.elements.keysContainerRu = document.createElement('div')
    
    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard_hidden')
    this.elements.keysContainerEng.classList.add('keyboard__keys')
    this.elements.keysContainerRu.classList.add('keyboard__keys')

    this.elements.keysContainerEng.appendChild(this._createKeys('eng'))
    this.elements.keysEng = this.elements.keysContainerEng.querySelectorAll('.keyboard__key')

    this.elements.keysContainerRu.appendChild(this._createKeys('ru'))
    this.elements.keysRu = this.elements.keysContainerRu.querySelectorAll('.keyboard__key')

    this.elements.keysCurrent = this.elements.keysEng

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainerEng)
    document.body.appendChild(this.elements.main)

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach(element => {
      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue
        })
      })
    })
  },

  _createKeys(lang) {
    const fragment = document.createDocumentFragment()
        
    const keysEng = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '!', '?',
      'language', ',', 'space', '.', 'color'
    ]

    const keysRu = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', ,'х', 'ъ',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'done', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '!', '?',
      'language', ',', 'space', '.', 'color'
    ]

    let keyLayout = lang === 'eng' ? keysEng : keysRu

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class='material-icons'>${icon_name}</i>`
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button')
      const insertLineBreak = ['backspace', 'p', 'ъ', 'enter', '?'].indexOf(key) !== -1

      // Add attributes/classes
      keyElement.setAttribute('type', 'button')
      keyElement.classList.add('keyboard__key')

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key_wide')
          keyElement.innerHTML = createIconHTML('backspace')

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
            this._triggerEvent('oninput')
          })

          break
        
        case 'caps':
          keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable')
          keyElement.innerHTML = createIconHTML('keyboard_capslock')

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock()
            keyElement.classList.toggle('keyboard__key_active', this.properties.capsLock)
          })

          break
        
        case 'enter':
          keyElement.classList.add('keyboard__key_wide', 'keyboard__key')
          keyElement.innerHTML = createIconHTML('keyboard_return')

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n'
            this._triggerEvent('oninput')
          })

          break
        
        case 'space':
          keyElement.classList.add('keyboard__key_extra-wide')
          keyElement.innerHTML = createIconHTML('space_bar')

          keyElement.addEventListener('click', () => {
            this.properties.value += ' '
            this._triggerEvent('oninput')
          })

          break
        
        case 'done':
          keyElement.classList.add('keyboard__key_wide', 'keyboard__key_dark')
          keyElement.innerHTML = createIconHTML('check_circle')

          keyElement.addEventListener('click', () => {
            this.close()
            this._triggerEvent('onclose')
          })

          break
        
        case 'language':
          keyElement.classList.add('keyboard__key_wide')
          keyElement.innerHTML = createIconHTML('language')

          keyElement.addEventListener('click', () => {
            if (this.properties.capsLock === true) {
              this._toggleCapsLock()
              document.querySelector('.keyboard__key_activatable').classList.toggle('keyboard__key_active', false)
            }
            this._triggerLanguage()
          })

          break
        
        case 'color':
          keyElement.classList.add('keyboard__key_wide')
          keyElement.innerHTML = createIconHTML('color_lens')

          keyElement.addEventListener('click', () => {
            this._changeBackgroundColor()
          })

          break

        default:
          keyElement.textContent = key.toLowerCase()

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
            this._triggerEvent('oninput')
          })

          break
      }

      fragment.appendChild(keyElement)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'))
      }
    })

    return fragment
  },
  
  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value)
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock

    for (const key of this.elements.keysCurrent) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
      }
    }
  },

  _triggerLanguage() {
    if (this.elements.main.lastChild == this.elements.keysContainerEng) {
      this.elements.main.removeChild(this.elements.main.lastChild)
      this.elements.main.appendChild(this.elements.keysContainerRu)
      this.elements.keysCurrent = this.elements.keysRu
    } else {
      this.elements.main.removeChild(this.elements.main.lastChild)
      this.elements.main.appendChild(this.elements.keysContainerEng)
      this.elements.keysCurrent = this.elements.keysEng
    }
  },

  _changeBackgroundColor() {
    let element = getComputedStyle(this.elements.main)
    let currentColor = element.backgroundColor
    let currentHexColor = () => {
      let rgbColor = currentColor.slice(currentColor.indexOf('(') + 1, currentColor.indexOf(')'))
                .split(', ')
      let hexColor = '#'
      let colorsComponents = 0

      for(let rgbColorComponent of rgbColor) {
        if (colorsComponents++ < 3) {
          let hexColorComponent = Number(rgbColorComponent).toString(16)
          hexColor += hexColorComponent.length < 2 ? '0' + hexColorComponent : hexColorComponent
        }
      }
      
      return hexColor
    }
    
    let colors = ['#004134', '#363b3f', '#c62827', '#43a047', '#1564c0', '#8055ec']
    let color = () => {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i] === currentHexColor(currentColor)) {
          if (colors.length - 1 === i) {
            i = -1
          }
          return this.elements.main.style.backgroundColor = colors[++i]
        }
      }
    }
    return color()
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || ''
    this.eventHandlers.oninput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.remove('keyboard_hidden')
  },

  close() {
    this.properties.value = ''
    this.eventHandlers.oninput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.add('keyboard_hidden')
  }
}

window.addEventListener('DOMContentLoaded', function() {
  Keyboard.init()
})