import{n as e}from"./chunk-BneVvdWh.js";import{M as t,R as n,t as r}from"./vue.esm-bundler-DwaW96k4.js";import{n as i,t as a}from"./AuthForm-D2ZKckSv.js";var o,s,c,l,u;e((()=>{r(),i(),o={title:`Auth/AuthForm`,component:a,tags:[`autodocs`],args:{title:`Login`,subtitle:`Sign in to continue`,fields:[{key:`username`,type:`text`,placeholder:`Username`},{key:`password`,type:`password`,placeholder:`Password`}],modelValue:{username:``,password:``},firstSubmitLabel:`Login`,secondSubmitLabel:`Create account`,containerClass:`login-form`,firstButtonClass:`btn-login`,secondButtonClass:``,actionsInline:!1,buttonOrderReversed:!1},argTypes:{firstSubmitButton:{action:`firstSubmitButton`},secondSubmitButton:{action:`secondSubmitButton`}},render:e=>({components:{AuthForm:a},setup(){let r=n({...e.modelValue});return t(()=>e.modelValue,e=>{r.value={...e}},{deep:!0}),{args:e,model:r}},template:`
      <AuthForm
        v-bind="args"
        :modelValue="model"
        @update:modelValue="model = $event"
      />
    `})},s={},c={args:{title:`Register`,subtitle:`Create your account`,fields:[{key:`username`,type:`text`,placeholder:`Username`},{key:`email`,type:`email`,placeholder:`Email`},{key:`password`,type:`password`,placeholder:`Password`},{key:`confirmPassword`,type:`password`,placeholder:`Confirm password`}],modelValue:{username:``,email:``,password:``,confirmPassword:``},firstSubmitLabel:`Register`,secondSubmitLabel:`Back to login`,containerClass:`register-form`,firstButtonClass:`btn-register`}},l={args:{errorSummary:`Please review the highlighted fields.`,fieldErrors:{username:`Username is required.`,password:`Password must be at least 8 characters.`},modelValue:{username:``,password:`123`}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Register',
    subtitle: 'Create your account',
    fields: [{
      key: 'username',
      type: 'text',
      placeholder: 'Username'
    }, {
      key: 'email',
      type: 'email',
      placeholder: 'Email'
    }, {
      key: 'password',
      type: 'password',
      placeholder: 'Password'
    }, {
      key: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm password'
    }],
    modelValue: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    firstSubmitLabel: 'Register',
    secondSubmitLabel: 'Back to login',
    containerClass: 'register-form',
    firstButtonClass: 'btn-register'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    errorSummary: 'Please review the highlighted fields.',
    fieldErrors: {
      username: 'Username is required.',
      password: 'Password must be at least 8 characters.'
    },
    modelValue: {
      username: '',
      password: '123'
    }
  }
}`,...l.parameters?.docs?.source}}},u=[`Login`,`Register`,`WithErrors`]}))();export{s as Login,c as Register,l as WithErrors,u as __namedExportsOrder,o as default};