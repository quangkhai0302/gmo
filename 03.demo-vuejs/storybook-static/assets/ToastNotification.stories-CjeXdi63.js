import{n as e}from"./chunk-BneVvdWh.js";import{C as t,R as n,t as r}from"./vue.esm-bundler-DwaW96k4.js";import{n as i,t as a}from"./ToastNotification-nEFJ6W0e.js";var o,s,c;e((()=>{r(),i(),o={title:`ScreenList/ToastNotification`,component:a,tags:[`autodocs`],render:()=>({components:{ToastNotification:a},setup(){let e=n(null),r=()=>{e.value?.show(`Student profile updated successfully.`,`success`)};return t(()=>{r()}),{toastRef:e,showSuccess:r,showError:()=>{e.value?.show(`Unable to save student. Please try again.`,`error`)}}},template:`
      <div style="width: 560px; max-width: 100%; min-height: 200px;">
        <div style="display: flex; gap: 8px;">
          <button
            style="padding: 8px 12px; border: 1px solid #10b981; border-radius: 8px; color: #065f46; background: #ecfdf5; cursor: pointer;"
            @click="showSuccess"
          >
            Show success
          </button>
          <button
            style="padding: 8px 12px; border: 1px solid #ef4444; border-radius: 8px; color: #991b1b; background: #fef2f2; cursor: pointer;"
            @click="showError"
          >
            Show error
          </button>
        </div>
        <ToastNotification ref="toastRef" />
      </div>
    `})},s={},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c=[`Playground`]}))();export{s as Playground,c as __namedExportsOrder,o as default};