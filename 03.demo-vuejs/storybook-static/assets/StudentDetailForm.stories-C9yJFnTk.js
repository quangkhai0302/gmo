import{n as e}from"./chunk-BneVvdWh.js";import{R as t,t as n}from"./vue.esm-bundler-DwaW96k4.js";import{n as r,t as i}from"./StudentDetailForm-IBSBBM5M.js";var a,o,s,c;e((()=>{n(),r(),a={title:`ScreenList/StudentDetailForm`,component:i,tags:[`autodocs`],args:{mode:`add`,initialData:{studentId:null,studentCode:`STU90001`,studentName:``,birthday:``,address:``,averageScore:null}},parameters:{layout:`padded`},render:e=>({components:{StudentDetailForm:i},setup(){let n=t(null),r=t(`No action yet`),i=t(1);return{args:e,formRef:n,message:r,onSave:e=>{r.value=`Saved: ${JSON.stringify(e)}`},onBack:()=>{r.value=`Back clicked`},onGenerateCode:()=>{i.value+=1;let e=`STU${String(9e4+i.value).padStart(5,`0`)}`;n.value?.setStudentCode(e),r.value=`Generated code: ${e}`}}},template:`
      <div style="width: 920px; max-width: 100%;">
        <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">{{ message }}</p>
        <StudentDetailForm
          ref="formRef"
          :mode="args.mode"
          :initialData="args.initialData"
          @save="onSave"
          @back="onBack"
          @generate-code="onGenerateCode"
        />
      </div>
    `})},o={},s={args:{mode:`edit`,initialData:{studentId:25,studentCode:`STU00025`,studentName:`Nguyen Thi Story`,birthday:`2001-04-22`,address:`Ha Noi`,averageScore:`8.2`}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'edit',
    initialData: {
      studentId: 25,
      studentCode: 'STU00025',
      studentName: 'Nguyen Thi Story',
      birthday: '2001-04-22',
      address: 'Ha Noi',
      averageScore: '8.2'
    }
  }
}`,...s.parameters?.docs?.source}}},c=[`AddMode`,`EditMode`]}))();export{o as AddMode,s as EditMode,c as __namedExportsOrder,a as default};