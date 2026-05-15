import{n as e}from"./chunk-BneVvdWh.js";import{M as t,R as n,t as r}from"./vue.esm-bundler-DwaW96k4.js";import{n as i,t as a}from"./Pagination-B5pCt7bX.js";var o,s,c,l;e((()=>{r(),i(),o={title:`ScreenList/Pagination`,component:a,tags:[`autodocs`],args:{currentPage:6,totalItems:173,pageSize:10},render:e=>({components:{Pagination:a},setup(){let r=n(e.currentPage);return t(()=>e.currentPage,e=>{r.value=e}),{args:e,page:r}},template:`
      <div style="width: 920px; max-width: 100%; background: #fff; border-radius: 16px; padding: 16px;">
        <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px;">Current page: {{ page }}</p>
        <Pagination
          :currentPage="page"
          :totalItems="args.totalItems"
          :pageSize="args.pageSize"
          @change-page="page = $event"
        />
      </div>
    `})},s={},c={args:{currentPage:2,totalItems:28,pageSize:10}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    currentPage: 2,
    totalItems: 28,
    pageSize: 10
  }
}`,...c.parameters?.docs?.source}}},l=[`Default`,`FewPages`]}))();export{s as Default,c as FewPages,l as __namedExportsOrder,o as default};