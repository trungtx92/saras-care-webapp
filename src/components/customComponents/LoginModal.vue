<template>
	 <b-modal :active.sync="open" :can-cancel="true" has-modal-card>
  <div id="wrapper">
  <div id="dialog">
    <!-- <button class="close" @click="close()">×</button> -->
    <h4>Please enter the 6-digit OTP code received via SMS:</h4>
    <p>Registered Phone Number: {{phone}}</p>
      <VueOTPField :amount="6" :onFill="onFill"/>
    <div >
      <button :disabled="canSubmit" @click="onOtpSubmit" class="btn bordered primary w-40">Verify</button>
        <p class="error" v-if="otpFailed">Error Occured!!!</p>
    </div>
  </div>
</div>
</b-modal>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'; 
import VueOTPField from './VueOTPField.vue';


export default {
  data () {
    return {
      canSubmit: true,
      otpValue:'',
      otpFailed: false,
      authy:''
    }
  },
   components: {
    VueOTPField
  },
  computed:{
  modalHeight(){
    return  this.otpFailed? 270: 265;
  },
  openModal:{
    get: function () {
         return this.$props.open;
    },
    // setter
    set: function (newValue) {
    
    }
  }
  },
  props:['phone','open','method'],
  methods:{
      show(){
          this.otpFailed=false;
      },
       onFill (value) {
          if(value.isFieldsComplete){
          this.otpInput = value.values;
          this.canSubmit=false;
        }
      },
      beforeOpen (event) {
      this.authy = event.params.authyID;
      },
      closeModal(event){
         this.$emit('close', false);
      },
      onOtpSubmit(){
        this.otpFailed=false;
        console.log(this.authy);
        axios.post('verifyOTP/', {
                 verifyCode: this.otpInput,
                 authy_id:this.$store.getters.getAuthyId   
              })
              .then((response) => {
                   var code = response.data;
                   if(code=='VERIFIED'){
                      this.method();
                    }else{
                      this.otpFailed=true;
                    }
                })
                .catch(error => { 
                      this.otpFailed=true;
                });
          }
    }
  }
</script>
<style lang="scss" >
.otp-input {
  width: 44px;
  height: 40px;
  padding: 8px;
  margin: 0 10px;
  font-size: 21px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  text-align: center;

  &.error {
    border: 1px solid red !important;
  }

  &:focus{
 border-color: red;
box-shadow: 0 0 5px red inset;
  }
}

#dialog > div:nth-child(5) > button{
  margin-top: 15px;
}


#dialog > div:nth-child(5) > p{
  margin-top: 7px;
  font-size: 12px;
  }

#wrapper {
  font-family: Lato;
  font-size: 1.5rem;
  text-align: center;
  box-sizing: border-box;
  color: #333;
  
  #dialog {
    border: solid 1px #ccc;
    margin: 10px auto;
    padding: 20px 30px;
    display: inline-block;
    box-shadow: 0 0 4px #ccc;
    background-color: #FAF8F8;
    overflow: hidden;
    position: relative;
    bottom: 10px;
    
    h3 {
      margin: 0 0 10px;
      padding: 0;
      line-height: 1.25;
    }
    
    span {
      font-size: 90%;
    }

    #form {
      max-width: 250px;
      margin: 25px auto 0;
    
      button {
        margin:  30px 0 50px;
        width: 100%;
        padding: 6px;
        background-color:#361fa9;
        border: none;
        text-transform: uppercase;
        display:inline-block;
      }

      .btn-primary:disabled{
        background-color:gray;
      }

       .btn-primary:hover:enabled{
         background-color: #dc4352 ;
      }
    }
    
    button {
      &.close {
        border: solid 2px;
        border-radius: 25px;
        line-height: 5px;
        font-size: 110%;
        width: 45px;
        position: absolute;
        right: 6px;
        top: 0px;
      }           
    }
    
    div {
      position: relative;
      z-index: 1;
    }
  }
}
</style>