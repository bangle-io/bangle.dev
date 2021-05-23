(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{114:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return m}));var a=n(3),o=n(7),r=(n(0),n(155)),i={title:"@bangle.dev/emoji",sidebar_label:"@bangle.dev/emoji",packageName:"@bangle.dev/emoji",id:"emoji"},c={unversionedId:"api/emoji",id:"api/emoji",isDocsHomePage:!1,title:"@bangle.dev/emoji",description:"Installation",source:"@site/docs/api/emoji.md",slug:"/api/emoji",permalink:"/docs/api/emoji",editUrl:"https://github.com/bangle-io/bangle.dev/edit/master/_bangle-website/docs/api/emoji.md",version:"current",sidebar_label:"@bangle.dev/emoji",sidebar:"docs",previous:{title:"@bangle.dev/core",permalink:"/docs/api/core"},next:{title:"@bangle.dev/react",permalink:"/docs/api/react"}},l=[{value:"Installation",id:"installation",children:[]},{value:"emoji: Component",id:"emoji-component",children:[{value:"Markdown support",id:"markdown-support",children:[]},{value:"Emoji Data source",id:"emoji-data-source",children:[]}]}],p={rightToc:l};function m(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(r.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h3",{id:"installation"},"Installation"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{}),"# peer deps\nnpm install @bangle.dev/core @bangle.dev/markdown\nnpm install @bangle.dev/emoji\n")),Object(r.b)("h2",{id:"emoji-component"},"emoji: ",Object(r.b)("a",Object(a.a)({parentName:"h2"},{href:"/docs/api/core/#component"}),"Component")),Object(r.b)("p",null,"Allows you to show emojis \ud83d\ude0e in your editor. "),Object(r.b)("h4",{id:"spec---nodespec"},"spec({ ... }): ",Object(r.b)("a",Object(a.a)({parentName:"h4"},{href:"/docs/api/core/#spec"}),"NodeSpec")),Object(r.b)("p",null,"Named parameters:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("p",{parentName:"li"},Object(r.b)("strong",{parentName:"p"},"getEmoji:")," fn(emojiAlias: string ) -> string",Object(r.b)("br",{parentName:"p"}),"\n","A callback that gets called with ",Object(r.b)("inlineCode",{parentName:"p"},"emojiAlias")," (a plain text representation of the emoji like ",Object(r.b)("inlineCode",{parentName:"p"},"smiley"),", ",Object(r.b)("inlineCode",{parentName:"p"},"green_book"),") and should return the emoji character associated with the alias.")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("p",{parentName:"li"},Object(r.b)("strong",{parentName:"p"},"defaultEmojiAlias"),": ?string='smiley'",Object(r.b)("br",{parentName:"p"}),"\n","If alias to use when not provided."))),Object(r.b)("h4",{id:"commands-commandobject"},"commands: ",Object(r.b)("a",Object(a.a)({parentName:"h4"},{href:"/docs/api/core/#commandobject"}),"CommandObject")),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"insertEmoji"),"(emojiAlias: string): ",Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/api/core/#command"}),"Command"),Object(r.b)("br",{parentName:"li"}),"A command that inserts an emoji.")),Object(r.b)("h3",{id:"markdown-support"},"Markdown support"),Object(r.b)("p",null,"This component supports markdown by serializing emoji nodes into ",Object(r.b)("inlineCode",{parentName:"p"},":<emojiAlias>:"),"For example, ",Object(r.b)("inlineCode",{parentName:"p"},"\ud83d\ude08")," will be serialized into ",Object(r.b)("inlineCode",{parentName:"p"},":smiling_imp:"),"."),Object(r.b)("p",null,"This package uses the npm package ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/markdown-it/markdown-it-emoji"}),"markdown-it-emoji")," to provide this support. It also exports the ",Object(r.b)("inlineCode",{parentName:"p"},"lite")," version of the plugin which allows for passing your own emoji dataset."),Object(r.b)("p",null,"Sample code for setting up markdown."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import {\n  markdownParser,\n  markdownSerializer,\n  defaultMarkdownItTokenizer,\n} from '@bangle.dev/markdown';\nimport { emoji, emojiMarkdownItPlugin } from '@bangle.dev/emoji';\n\nconst myEmojiDefs = {\n  grinning: '\ud83d\ude00',\n  smiley: '\ud83d\ude03',\n  smile: '\ud83d\ude04',\n  grin: '\ud83d\ude01',\n  laughing: '\ud83d\ude06',\n  satisfied: '\ud83d\ude06',\n  sweat_smile: '\ud83d\ude05',\n  rofl: '\ud83e\udd23',\n  joy: '\ud83d\ude02',\n  slightly_smiling_face: '\ud83d\ude42',\n};\n\nconst specRegistry = [\n  // your other specs,\n  emoji.spec({\n    getEmoji: (emojiAlias) => myEmojiDefs[emojiAlias] || '\u2753',\n  }),\n];\n\nconst parser = markdownParser(\n  specRegistry,\n  defaultMarkdownItTokenizer.use(emojiMarkdownItPlugin, {\n    // https://github.com/markdown-it/markdown-it-emoji options go here\n    defs: myEmojiDefs,\n  }),\n);\n\nconst serializer = markdownSerializer(specRegistry);\n")),Object(r.b)("h3",{id:"emoji-data-source"},"Emoji Data source"),Object(r.b)("p",null,"This package does not provide emoji data, you will have to load it yourself. If you want you can use ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/bangle-io/emoji-lookup-data"}),"emoji-lookup-data")," datasource which is an optimized fork of ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/github/gemoji"}),"gemoji"),". Or, you can use ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/markdown-it/markdown-it-emoji/tree/master/lib/data"}),"markdown-it-emoji's data")," for an even smaller subset of data."),Object(r.b)("p",null,"\ud83d\udcd6 See\xa0",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://bangle.dev/docs/examples/markdown-editor"}),"Bangle Markdown example")),Object(r.b)("p",null,"\ud83d\udcd6 See ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://bangle.dev/docs/api/markdown"}),"Markdown component API")))}m.isMDXComponent=!0},155:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return j}));var a=n(0),o=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),m=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=m(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=m(n),d=a,j=s["".concat(i,".").concat(d)]||s[d]||b[d]||r;return n?o.a.createElement(j,c(c({ref:t},p),{},{components:n})):o.a.createElement(j,c({ref:t},p))}));function j(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,i=new Array(r);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<r;p++)i[p]=n[p];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);