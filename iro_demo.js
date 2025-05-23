
var colorPicker = new iro.ColorPicker("#demoWheel", {
  width: 290,
  height: 360,
  handleRadius: 8,
  activeHandleRadius: 10,
  handleUrl: null,
  // handleUrl: "#test",
  handleOrigin: {y: 0, x: 0},
  colors: [
    '#f00',
  ],
  borderWidth: 2,
  borderColor: "#000",
  padding: 8,
  wheelLightness: true,
  wheelAngle: 270,
  wheelDirection: 'anticlockwise',
  layoutDirection: 'vertical',
  // transparency: true,
  layout: [
    {
      component: iro.ui.TriangleWheel,
      options: {
        ringWidth: 24
      }
    },
    {
      component: iro.ui.HueRing,
      options: {
        ringWidth: 12
      }
    },
    {
      component: iro.ui.Triangle,
      options: {
      }
    },
    {
      component: iro.ui.Wheel,
      options: {
        wheelDirection: 'clockwise',
        wheelAngle: 60,
      }
    },
    {
      component: iro.ui.Wheel,
      options: {
        wheelDirection: 'anticlockwise',
        wheelAngle: 0,
      }
    },
    {
      component: iro.ui.Wheel,
      options: {
        wheelDirection: 'anticlockwise',
        wheelAngle: 60,
      }
    },
    {
      component: iro.ui.Box,
      options: {}
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'alpha'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'saturation'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'value'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'kelvin',
        sliderShape: 'circle'
      }
    },

    {
      component: iro.ui.Box,
      options: {
        boxHeight: 60
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'red'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'green'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'blue'
      }
    },
    {
      component: iro.ui.Box
    },
    // {
    //   component: iro.ui.Slider,
    //   options: {
    //     sliderType: 'value'
    //   }
    // },
    // {
    //   component: iro.ui.Slider,
    //   options: {
    //     sliderType: 'value',
    //     activeIndex: 2,
    //   }
    // },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'alpha',
        layoutDirection: 'horizontal'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue',
        layoutDirection: 'horizontal'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'saturation',
        layoutDirection: 'horizontal'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'value',
        layoutDirection: 'horizontal'
      }
    },
  ]
  // layout: [
  //   {
  //     component: iro.ui.Wheel,
  //     options: {
  //     }
  //   },
  //   {
  //     component: iro.ui.Box,
  //     options: {}
  //   },
  //   {
  //     component: iro.ui.Slider,
  //     options: {
  //       sliderType: 'alpha'
  //     }
  //   },
  //   {
  //     component: iro.ui.Slider,
  //     options: {
  //       sliderType: 'hue'
  //     }
  //   },
  //   {
  //     component: iro.ui.Slider,
  //     options: {
  //       sliderType: 'saturation'
  //     }
  //   },
  //   {
  //     component: iro.ui.Slider,
  //     options: {
  //       sliderType: 'value'
  //     }
  //   },
  //   {
  //     component: iro.ui.Slider,
  //     options: {
  //       sliderType: 'kelvin',
  //       sliderShape: 'circle'
  //     }
  //   },
  // ]
});

// colorPicker.on('mount', function() {
//   console.log('mount')
// });

// colorPicker.on('color:change', function() {
//   console.log('color:change');
// })
//
// colorPicker.on('input:change', function(color) {
//   console.log(color.hexString)
//   console.log('input:change');
// })
//
// colorPicker.on('input:start', function(color) {
//   console.log(color.hexString)
//   console.log('input:start');
// })
//
// colorPicker.on('input:move', function(color) {
//   console.log(color.hexString)
//   console.log('input:move');
// })
//
// colorPicker.on('input:end', function(color) {
//   console.log(color.hexString)
//   console.log('input:end');
// })

// colorPicker.on(['color:init', 'color:change'], function() {
//   console.log('color:change or color:init');
// })
