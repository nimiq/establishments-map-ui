import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'
import { presetRemToPx } from '@unocss/preset-rem-to-px'
import { Provider } from 'types'
import transformerDirectives from '@unocss/transformer-directives'


const reRadix = /^r-(\w+)-(open|closed):/
const reRadixHocus = /^r-(\w+)-hocus:/
const variantsRE = /^(scrollbar(-track|-thumb)?):.+$/

export default defineConfig({
  presets: [
    presetUno({ attributifyPseudo: true }),
    presetNimiq({
      utilities: true,
      typography: true,
      reset: 'tailwind',
      icons: false
    }),
    presetIcons({
      collections: {
        providers: {
          'default-atm': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 34"><g opacity=".5"><path stroke="#fff" stroke-linecap="round" stroke-width="2.754" d="M1.57 2h22.857"/><path fill="#fff" fill-rule="evenodd" d="M5.681 6.572A2.967 2.967 0 0 0 2.715 9.54v21.495a2.967 2.967 0 0 0 2.966 2.967h8.879V6.572H5.68Zm11.633 0v27.429h3.006a2.967 2.967 0 0 0 2.966-2.967V9.54a2.967 2.967 0 0 0-2.966-2.967h-3.006Z" clip-rule="evenodd"/></g></svg>',
          edenia: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 32"><path fill="#fff" d="M31 .998H8.113L8.117 32l22.876-.033v-5.559H14.181V19.13l14.953-.031-.003-5.396H14.18V6.558L31 6.56V.998ZM0 14.105h4.577v4.577H0z" opacity=".5"/></svg>',
          kurant: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path fill="#fff" d="M19.435.261C12.152 1.836 6.251 6.255 2.8 12.654c-3.662 6.802-3.738 15.12-.192 22.228 2.318 4.63 6.631 8.781 11.405 10.991 1.839.846 4.446 1.632 6.285 1.941 1.82.288 6.21.23 8.068-.095 9.66-1.691 17.363-9.26 19.434-19.097.155-.767.25-1.48.173-1.575-.056-.095-.998-.174-2.087-.174h-1.994l-.21.808c-.498 2.017-1.248 4.19-1.764 5.246-3.64 7.245-11.805 11.74-19.646 10.875-2.185-.25-4.849-.922-4.849-1.231 0-.095.173-1.96.384-4.132.211-2.19.422-4.514.498-5.167l.095-1.19 2.588-2.402c1.398-1.326 2.626-2.422 2.72-2.422.076 0 2.129 2.153 4.522 4.805 2.415 2.632 4.428 4.804 4.485 4.804.154 0 3.24-2.766 3.47-3.132.191-.287-.25-.827-3.181-3.939a570.719 570.719 0 0 0-4.544-4.785l-1.15-1.21.747-.788c2.07-2.134 11.481-10.837 11.768-10.894.23-.037.535.288 1.017 1.058 1.36 2.228 1.744 3.17 2.875 6.973l.248.865 1.899.057c1.055.019 1.974-.02 2.069-.117.249-.25-.67-3.977-1.515-6.07C43.83 8.313 38.023 3.01 31.124.86c-1.59-.499-3.967-.922-4.121-.748-.211.211-.576 3.766-.403 3.94.056.075.765.268 1.552.422 1.477.288 3.432.96 4.85 1.673 1.303.653 3.01 1.787 3.01 2.017 0 .211-16.56 16.215-16.771 16.215-.076 0-.076-.46-.02-1.02.057-.536.347-3.516.615-6.57.267-3.075.727-8.031 1.035-11.049.287-3.017.498-5.533.441-5.628-.113-.176-.495-.157-1.877.15Zm-4.138 10.991c-.286 2.939-.746 7.762-1.017 10.72-1.206 12.872-1.725 18.156-1.839 18.156-.056 0-.787-.634-1.628-1.42-5.366-4.937-7.494-11.181-6.247-18.29 1.055-5.937 4.081-10.278 9.6-13.699.69-.423 1.342-.767 1.437-.767.135-.022.019 1.84-.306 5.3Z" opacity=".5"/></svg>',
          bluecode: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#1961AC" d="m6.558 7.289 7.765 4.483 4.634-2.673a1.039 1.039 0 0 0 0-1.8L6.557.139A1.037 1.037 0 0 0 5 1.039V8.19a1.038 1.038 0 0 1 1.557-.9l.001-.001Zm12.399 7.156-4.634-2.67-7.766 4.48a1.038 1.038 0 0 1-1.557-.9v7.152a1.04 1.04 0 0 0 1.557.9l12.4-7.16a1.038 1.038 0 0 0 0-1.8v-.002Z"/><path fill="#004899" d="m6.558 16.255 7.765-4.483-7.766-4.483a1.036 1.036 0 0 0-1.557.9v7.167a1.038 1.038 0 0 0 1.557.9l.001-.001Z"/></svg>',
          cpl: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 23"><path fill="#5C6CFF" d="m19.884 7.687-1.528-5.579C18.036.951 16.83.271 15.648.571l-5.68 1.496a3.441 3.441 0 0 0-2.082 1.565L1.012 15.307a2.151 2.151 0 0 0 .806 2.966l7.832 4.436c1.055.598 2.416.245 3.013-.79l6.874-11.674a3.31 3.31 0 0 0 .347-2.558Zm-5.458 5.429-1.763 3.007a.74.74 0 0 1-.611.354H8.51a.709.709 0 0 1-.611-.354l-1.778-3.007a.689.689 0 0 1 0-.694L7.9 9.415a.74.74 0 0 1 .61-.354h3.542a.71.71 0 0 1 .61.354l1.764 3.007a.689.689 0 0 1 0 .694Zm1.403-7.92a1.346 1.346 0 0 1-1.639-.924c-.194-.694.236-1.416.945-1.606a1.346 1.346 0 0 1 1.638.925c.195.694-.236 1.415-.944 1.606Z"/></svg>',
          naka: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="none"><path fill="#293FFF" d="M183.304 66.667H72.001v266.666h55.651V76.111l89.044 257.222h111.303V66.667h-55.652v257.221z"/></svg>',
        },
        nimiq: async () => {
          return await fetch('https://raw.githubusercontent.com/onmax/nimiq-ui/main/packages/nimiq-icons/dist/icons.json').then(res => res.json() as any)
        },
        ring: {
          atm: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 118 118"><circle cx="59" cy="59" r="32" stroke="#fff" opacity=".2"/><path stroke="url(#a)" d="M43.992 2.99C13.06 11.28-5.298 43.074 2.99 74.008c8.289 30.933 40.084 49.29 71.018 41.002 30.933-8.289 49.29-40.084 41.002-71.018C106.721 13.06 74.926-5.298 43.992 2.99Z" opacity=".2"/><defs><linearGradient id="a" x1="29.896" x2="70.898" y1="99.159" y2="28.141" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>',
          provider: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 186 186"><circle cx="93" cy="93" r="21" stroke="#fff" opacity=".8"/><circle cx="93" cy="93" r="25" stroke="#fff" opacity=".5"/><circle cx="93" cy="93" r="92" stroke="url(#a)" opacity=".3"/><circle cx="93" cy="93" r="52" stroke="url(#b)" opacity=".3"/><defs><linearGradient id="a" x1="43.406" x2="135.406" y1="154.094" y2="62.094" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="64.969" x2="116.969" y1="127.531" y2="75.531" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>'
        }
      }
    }),
    presetRemToPx({ baseFontSize: 4 }),
    presetAttributify(),

    {
      name: 'radix-variants',
      variants: [
        (matcher) => {
          if (!matcher.startsWith('r-')) return matcher
          const match = matcher.match(reRadix)
          if (!match) return
          const [_, ref, state] = match
          return {
            matcher: matcher.replace(reRadix, ''),
            selector: s => `[${ref}][data-state="${state}"] ${s}`,
          }
        },
        (matcher) => {
          if (!matcher.match(reRadixHocus)) return matcher
          const match = matcher.match(reRadixHocus)
          if (!match) return
          const [_, ref] = match
          return {
            matcher: matcher.replace(reRadixHocus, ''),
            selector: s => `[${ref}]:hover ${s}, [${ref}]:focus-visible ${s}`,
          }
        },
      ],
    },


  ],
  theme: {
    breakpoints: {
      desktop: '768px',
    }
  },
  // TODO Move to nimiq-css?
  variants: [
    (matcher) => {
      if (!matcher.startsWith('hocus'))
        return matcher

      return {
        matcher: matcher.replace(matcher.startsWith('hocus:') ? 'hocus:' : 'hocus', ''),
        selector: s => `${s}:hover, ${s}:focus-visible`,
      }
    },
    (matcher) => {
      if (!matcher.startsWith('group-hocus'))
        return matcher
      return {
        matcher: matcher.replace(matcher.startsWith('group-hocus:') ? 'group-hocus:' : 'group-hocus', ''),
        selector: s => `:is(.group,[group]):is(:hover,:focus-visible) ${s}`,
      }
    },

    // https://github.com/unpreset/unocss-preset-scrollbar/blob/main/src/index.ts#L143C7-L155C9
    (matcher) => {
      if (!variantsRE.test(matcher))
        return
      const variant = matcher.replace(variantsRE, '$1')
      return {
        matcher: matcher.slice(variant.length + 1),
        selector: (s) => `${s}::-webkit-${variant}`,
      }
    },
  ],
  transformers: [
    transformerDirectives(),
  ]
})
