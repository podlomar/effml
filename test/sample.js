export const sampleDocumnet = {
  attributes: {
    doctype: 'html',
  },
  nodes: [
    {
      type: 'element',
      tagName: 'head',
      attributes: {
        title: 'Page\'s Title',
      },
      nodes: [
        { 
          type: 'element',
          tagName: 'meta',
          attributes: { charset: 'UTF-8' },
          nodes: [],
        },
        { 
          type: 'element',
          tagName: 'meta',
          attributes: { viewport: 'width=device-width, initial-scale=1.0' },
          nodes: [],
        },
        { 
          type: 'element',
          tagName: 'link',
          attributes: { rel: 'stylesheet', href: 'assets\\styles.css' },
          nodes: [],
        },
        { 
          type: 'element',
          tagName: 'link',
          attributes: { rel: 'icon', href: 'favicon.ico' },
          nodes: [],
        },
      ],
    },
    {
      type: 'element',
      tagName: 'body',
      attributes: {},
      nodes: [
        { 
          type: 'element',
          attributes: {},
          tagName: 'h1',
          nodes: [
            {
              type: 'text',
              value: 'Hello, World!',
            }
          ],
        },
        { 
          type: 'element', 
          attributes: {},
          tagName: 'p',
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
              attributes: {},
              tagName: 'div',
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
          tagName: 'img',
          attributes: {
            src: 'image.jpg',
            alt: 'Sample Image',
          },
          nodes: [],
        },
      ],
    },
  ],
};
