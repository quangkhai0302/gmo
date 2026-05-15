import{n as e}from"./chunk-BneVvdWh.js";import{M as t,R as n,l as r,t as i}from"./vue.esm-bundler-DwaW96k4.js";import{n as a,t as o}from"./StudentTable-D8kU-BgQ.js";function s(e,t){return t===`id`?e.id:t===`score`?e.score??-1:t===`birthday`?e.birthday??``:t===`code`?e.code:e.name}var c,l,u,d;e((()=>{i(),a(),c={title:`ScreenList/StudentTable`,component:o,tags:[`autodocs`],args:{students:[{id:1,code:`STU001`,name:`Nguyen Van A`,birthday:`2002-03-21`,address:`Ha Noi`,score:8.7},{id:2,code:`STU002`,name:`Tran Thi B`,birthday:`2001-11-05`,address:`Da Nang`,score:7.4},{id:3,code:`STU003`,name:`Le Quang C`,birthday:`2003-08-17`,address:null,score:5.8},{id:4,code:`STU004`,name:`Pham Minh D`,birthday:null,address:`Ho Chi Minh`,score:4.9},{id:5,code:`STU005`,name:`Vo Thu E`,birthday:`2002-01-30`,address:`Can Tho`,score:null}],sort:{field:null,order:null},startIndex:0},parameters:{layout:`padded`},render:e=>({components:{StudentTable:o},setup(){let i=n({...e.sort}),a=n(`No action yet`);return t(()=>e.sort,e=>{i.value={...e}},{deep:!0}),{args:e,currentSort:i,sortedStudents:r(()=>{let t=[...e.students],{field:n,order:r}=i.value;return!n||!r||t.sort((e,t)=>{let i=s(e,n),a=s(t,n),o=i>a?1:i<a?-1:0;return r===`asc`?o:-o}),t}),latestAction:a,onSort:e=>{let t=i.value;if(t.field!==e){i.value={field:e,order:`asc`};return}if(t.order===`asc`){i.value={field:e,order:`desc`};return}if(t.order===`desc`){i.value={field:null,order:null};return}i.value={field:e,order:`asc`}},onRequestEdit:e=>{a.value=`Edit student id: ${e}`},onRequestDelete:e=>{a.value=`Delete student: ${e.name} (${e.code})`}}},template:`
      <div style="width: 1080px; max-width: 100%;">
        <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">{{ latestAction }}</p>
        <StudentTable
          :students="sortedStudents"
          :sort="currentSort"
          :startIndex="args.startIndex"
          @sort="onSort"
          @request-edit="onRequestEdit"
          @request-delete="onRequestDelete"
        />
      </div>
    `})},l={},u={args:{students:[]}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    students: []
  }
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Empty`]}))();export{l as Default,u as Empty,d as __namedExportsOrder,c as default};