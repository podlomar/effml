export const sampleDocumnet = {
  attrs: {
    doctype: 'html',
  },
  nodes: [
    {
      type: 'element',
      name: 'head',
      attrs: {
        title: 'Page\'s Title',
      },
      nodes: [
        { 
          type: 'element',
          name: 'meta',
          attrs: { charset: 'UTF-8' },
          nodes: [],
        },
        { 
          type: 'element',
          name: 'meta',
          attrs: { viewport: 'width=device-width, initial-scale=1.0' },
          nodes: [],
        },
        { 
          type: 'element',
          name: 'link',
          attrs: { rel: 'stylesheet', href: 'assets\\styles.css' },
          nodes: [],
        },
        { 
          type: 'element',
          name: 'link',
          attrs: { rel: 'icon', href: 'favicon.ico' },
          nodes: [],
        },
      ],
    },
    {
      type: 'element',
      name: 'body',
      attrs: {},
      nodes: [
        { 
          type: 'element',
          attrs: {},
          name: 'h1',
          nodes: [
            {
              type: 'text',
              value: 'Hello, World!',
            }
          ],
        },
        { 
          type: 'element', 
          attrs: {},
          name: 'p',
          nodes: [
            {
              type: 'text',
              value: 'This is an example\nEffML document.',
            },
            {
              type: 'text',
              value: 'It\'s awesome!',
            },
            { 
              type: 'element',
              attrs: {},
              name: 'div',
              nodes: [
                {
                  type: 'text',
                  value: 'Some\ttext\rinside\fa\bdiv.',
                }
              ],
            },
          ],
        },
        {
          type: 'element',
          name: 'img',
          attrs: {
            src: 'image.jpg',
            alt: 'Sample Image',
          },
          nodes: [],
        },
      ],
    },
  ],
};
