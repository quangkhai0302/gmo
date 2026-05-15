import{n as e}from"./chunk-BneVvdWh.js";import{R as t,t as n}from"./vue.esm-bundler-DwaW96k4.js";import{n as r,t as i}from"./SearchForm-zwgKiNbV.js";var a,o,s;e((()=>{n(),r(),a={title:`ScreenList/SearchForm`,component:i,tags:[`autodocs`],render:()=>({components:{SearchForm:i},setup(){let e=t(null);return{latestPayload:e,onSearch:t=>{e.value=t}}},template:`
      <div style="width: 860px; max-width: 100%;">
        <SearchForm @search="onSearch" />
        <pre
          v-if="latestPayload"
          style="margin-top: 12px; padding: 12px; border-radius: 10px; background: #111827; color: #f9fafb; font-size: 12px;"
        >{{ JSON.stringify(latestPayload, null, 2) }}</pre>
      </div>
    `})},o={},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s=[`Default`]}))();export{o as Default,s as __namedExportsOrder,a as default};