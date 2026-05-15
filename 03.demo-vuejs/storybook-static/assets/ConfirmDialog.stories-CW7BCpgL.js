import{n as e}from"./chunk-BneVvdWh.js";import{M as t,R as n,t as r}from"./vue.esm-bundler-DwaW96k4.js";import{n as i,t as a}from"./ConfirmDialog-BaVPkUEr.js";var o,s,c;e((()=>{r(),i(),o={title:`ScreenList/ConfirmDialog`,component:a,tags:[`autodocs`],args:{visible:!0,studentName:`Nguyen Van A`},render:e=>({components:{ConfirmDialog:a},setup(){let r=n(e.visible),i=n(`Waiting for action`);return t(()=>e.visible,e=>{r.value=e}),{args:e,visible:r,message:i,onConfirm:()=>{r.value=!1,i.value=`Confirmed delete: ${e.studentName}`},onCancel:()=>{r.value=!1,i.value=`Canceled`},reopen:()=>{r.value=!0}}},template:`
      <div style="min-height: 220px; width: 500px; max-width: 100%;">
        <button
          style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer;"
          @click="reopen"
        >
          Open dialog
        </button>
        <p style="margin: 10px 0 0; color: #6b7280; font-size: 13px;">{{ message }}</p>
        <ConfirmDialog
          :visible="visible"
          :studentName="args.studentName"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </div>
    `})},s={},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c=[`Visible`]}))();export{s as Visible,c as __namedExportsOrder,o as default};