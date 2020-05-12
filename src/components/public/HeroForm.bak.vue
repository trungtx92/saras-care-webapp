<template>
  <form @submit="formSubmit" class="needs-validation" novalidate>
    <div v-show="step === 1">
        <div class="row title">
            <div class="col">
               <h4>{{ componentTitle }}</h4>
               <pre v-if="output">{{ output }}</pre>
            </div>
        </div>

        <div class="row form-radios">
            <label class="col-12 col-sm-4 form-check-label f-radio" for="inlineCheckbox1">
                <input type="radio" name="case-type" class="f-radio--input" value="witness" v-model="casetype">
                <div class="f-radio--wrap"></div>
                <span class="f-radio--text">Witness</span>
            </label>

            <label class="col-12 col-sm-4 form-check-label f-radio" for="inlineCheckbox1">
                <input type="radio" name="case-type" class="f-radio--input" value="victim" v-model="casetype">
                <div class="f-radio--wrap"></div>
                <span class="f-radio--text">Victim</span>
            </label>

            <label class="col-12 col-sm-4 form-check-label f-radio" for="inlineCheckbox1">
                <input type="radio" name="case-type" class="f-radio--input" value="medicalprof" v-model="casetype">
                <div class="f-radio--wrap"></div>
                <span class="f-radio--text">Medical Professional</span>
            </label>
        </div>
        
        <div class="row form-group">
            <div class="col-12">
                <h6 class="m15t m15b">Please fill in the form:</h6>
            </div>
            <div class="col-12">
                <input 
                    id="name" 
                    v-model="name"
                    type="name" 
                    placeholder="Enter Name *" 
                    required 
                    class="form-control" />
                    <!-- <small class="error" v-if="!$v.name.required">Field is required</small> -->
                    <small class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</small>

                    <input 
                        id="phone" 
                        v-model="phone"
                        type="phone" 
                        placeholder="Enter Phone *" 
                        required 
                        class="form-control" />

                    <small class="error" v-if="!$v.phone.intPhone">Phone must be in valid format.</small>

                    <input 
                        id="email" 
                        v-model="email"
                        type="email" 
                        placeholder="Enter Email *" 
                        required 
                        class="form-control" />

                        <small class="error" v-if="!$v.email.email">Email must be in valid format.</small>
            </div>


            <div class="col-12 m15t">
                <div class="row justify-content-between">
                    <div class="col-auto align-self-center">
                        <label>Please provide evidence</label>
                    </div>
                    <div class="col-auto">
                        <input id="files" type="file" multiple hidden required />
                        <button @click="chooseFiles()">Browse <i class="far fa-folder-open"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <hr/>

        <div class="row form-cbox">
            <div class="col">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" required>
                <label class="f-cbox--label" for="exampleCheck1">I prefer to stay anonymous</label>
                <div class="f-cbox--wrap"></div>
            </div>
        </div>

            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your details with anyone else.</small> -->
        <div class="row buttons">
            <div class="col">
                <button class="w-100" @click.prevent="next()">Next <i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>

    <div v-show="step === 2">
        <div class="row heading">
            <div class="col">
               <h4>Offense Details</h4>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-12">
                <input 
                    id="caseDate" 
                    class="form-control"
                    v-model="caseDate"

                    type="date" 
                                
                    aria-describedby="caseDateHelp" 
                    placeholder="Date of the Offense *" 
                    required />

                <input 
                    id="caseVictim" 
                    class="form-control"
                    v-model="caseVictim"
                    v-if="casetype == 'witness'"
                    type="text" 
                                
                    aria-describedby="caseOffenderHelp" 
                    placeholder="Enter Victim Name *" 
                    required />

                <input 
                    id="caseOffender" 
                    class="form-control"
                    v-model="caseOffender"

                    type="text" 
                                
                    aria-describedby="caseOffenderHelp" 
                    placeholder="Enter Offender Name *" 
                    required />

                <input 
                    id="caseLocation" 
                    class="form-control"
                    v-model="caseLocation"

                    type="text" 
                                
                    aria-describedby="caseLocationHelp" 
                    placeholder="Location of the Offense *" 
                    required />

                <input 
                    id="caseDescription" 
                    class="form-control"
                    v-model="caseDescription"

                    type="textarea" 
                                
                    aria-describedby="caseDescriptionHelp" 
                    placeholder="Description of the Offense *" 
                    required />

                <select 
                    id="caseOffenseType" 
                    v-model="selected" class="form-control m15t w-100">
                    <option selected disabled>Choose an offense type</option>
                    <option v-for="type in offensetypes" v-bind:value="type.id">
                        {{ type.description }}
                    </option>
                </select>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-12">
                <hr/>
                <p>You can create an account by registering or<br/>skip registering and submit your report now.</p>
            </div>
        </div>
        <div class="row buttons">
            <div class="col-sm-12 col-md-6">
                <button class="w-100" @click.prevent="prev()">Prev <i class="fas fa-chevron-left"></i></button>
            </div>
            <div class="col-sm-12 col-md-6">
                <button type="submit" class="col">Submit Report<i class="fas fa-chevron-right"></i></button>
            </div>                
        </div>
    </div>

    <div id="case--summary" v-show="step === 3">
        <div class="row m15b text-center">
            <div class="col">
               <h4>Here is a summary of your report</h4>
            </div>
        </div>

        <div class="row summary">
            <div class="col-12">
                <div class="row">
                    <div class="heading col-12">
                        <h5>Case #{{ caseID }} Information</h5>
                    </div>
                    <div class="result col-12">
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Name:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ name }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Phone:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ phone }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Email:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ email }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="heading col-12">
                        <h5>Evidence</h5>
                    </div>
                    <div class="result col-12">
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                IMG_00.jpg
                            </div>
                            <div class="right col-12 col-md-6">
                                View Attachment
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="heading col-12">
                        <h5>About the Offense</h5>
                    </div>
                    <div class="result col-12">
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Offense Date:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseDate }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Victim Name:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseVictim }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Offender Name:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseOffender }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Offense Location:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseLocation }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Type of Offense:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseOffenseType }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="left col-12 col-md-6">
                                Offense Description:
                            </div>
                            <div class="right col-12 col-md-6">
                                {{ caseDescription }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row buttons">
            <div class="col-sm-12 col-md-6">
                <button class="btn bordered secondary w-100" @click.prevent="prev()">Register</button>
            </div>
            <div class="col-sm-12 col-md-6">
                <button type="submit" class="w-100">Download Report<i class="fas fa-chevron-down"></i></button>
            </div>                
        </div>

    </div>

</form>
</template>

<script>
    import { required, minLength, email, phone, between, withParams } from 'vuelidate/lib/validators'
    import intPhone from "@/customValidators/intPhone"
    // const isPhone = (value) => /^1(3|4|5|7|8)\d{9}$/.test(value);
    const isPhone = (value) => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value);

export default {
    name: "Form",
    props: {
        componentTitle: String
    },
    validations: {
        name: {
            required,
            minLength: minLength(4)
        },
        phone: {
            // between: between(20, 30)
            intPhone: minLength(5)
        },
        email: {
            email
        },
    },
    mounted() {
        console.log('Form component mounted.'),
        this.getOffenseTypes()
    },
    data: function() {
        return {
            step: 1,
            url: '',
            name: '',
            phone: '',
            email: '',
            caseID: '',
            output: '',
            casetype: '',
            caseDate: '',
            caseVictim: '',
            caseOffender: '',
            caseLocation: '',
            caseDescription: '',
            caseOffenseType: '',

            baseURL: axios.defaults.baseURL,
            selected: 'Choose an offense type',
            offensetypes: [
                { text: 'a', value: 'b' }
            ]
        }
        
    },

    methods: {

        // Populate Offense Type dropdown on Step 2
        getOffenseTypes(){
            axios.get('/offense-types')
            .then((response) => {
                this.offensetypes = response.data
            })
        },

        // Form controls
        prev() { this.step--; },
        next() {
            // if (this.name && this.email) {
            //     return true;
            //     this.step++;
            // }
            // e.preventDefault();
            this.step++;
        },

        // Custom Browse function replaced by Button
        chooseFiles() {
            document.getElementById("files").click()
        },

        submit() {
            alert('Submit to blah and show blah and etc.');      
        },
        
        
        // validPhone: function (phone) {
        //       var re = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        //       return re.test(phone);
        // },

        formSubmit(e) {
            e.preventDefault();
            let currentObj = this;
    
            if (this.casetype == 'victim') {
                axios.all([
                this.post_offense()
                ])
                .then(axios.spread((response) => {
                    this.caseID = response.data.id
                    axios.all([
                        this.post_victim(this.caseID, this.name, this.phone, this.email), 
                        this.post_offender(this.caseID, this.caseOffender, '','')
                    ])
                    }))
            }
            else if (this.casetype == 'witness') {
                axios.all([
                this.post_offense()
                ])
                .then(axios.spread((response) => {
                    this.caseID = response.data.id
                    axios.all([
                        this.post_witness(this.caseID, this.name, this.phone, this.email), 
                        this.post_victim(this.caseID, this.caseVictim,'',''), 
                        this.post_offender(this.caseID, this.caseOffender, '','')
                    ])
                    }))
            }


            
            this.next() ;
        },
        post_offense() {
            this.url = this.baseURL + '/offenses';
            return axios.post(this.url, {
                offenseDate: this.caseDate,
                offenseType: this.selected,
                location: this.caseLocation,
                notes: this.caseDescription
            })
        },
        post_witness(w_cid, w_name, w_phone, w_email) {
            this.url = this.baseURL + '/offenses/' + w_cid + '/witnesses';
            return axios.post(this.url, {
                name: w_name,
                phoneNumber: w_phone,
                email: w_email
            })
        },
        post_victim(v_cid, v_name, v_phone, v_email) {
            this.url = this.baseURL + '/offenses/' + v_cid + '/victims';
            return axios.post(this.url, {
                name: v_name,
                phoneNumber: v_phone,
                email: v_email
            })
        },
        post_offender(o_cid, o_name, o_phone, o_email) {
            this.url = this.baseURL + '/offenses/' + o_cid + '/offenders';
            return axios.post(this.url, {
                name: o_name,
                phoneNumber: o_phone,
                email: o_email
            })
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/styles/theme.scss';

    .title {
        margin-bottom: 15px;
    }

    #case--summary {
        
        text-align: left;

        .summary {
            border: 1px solid rgba($secondary, .3);
            border-radius: $bradius; 
            background-color: $tertiary;
            padding: 25px;

            .row {
                .heading { 
                    margin: 25px 0 0;
                }
                .result {

                    .right { text-align: right; }
                }
            }
        }
    }
    
    .hero {
        

        form {
            border: 1px solid #ddd;
            background-color: #fff;
            padding: 30px;
            text-align: center;
            max-height: 600px;
            overflow: scroll;

            @include bp-sm {
                max-height: none;
            }


            .form-cbox {
                position: relative;
                padding-left: 0;

                input {
                    position: absolute; top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: 1; opacity: 0;
                    cursor: pointer;

                    &:checked ~ div {

                        &:after {
                            content: '';
                            position: relative; top: 8px; left: 11px; 
                            width: 6px; height: 10px;
                            border: solid $secondary;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg);
                            display: block;
                        }
                    }
                }

                .f-cbox--wrap {
                    height: 30px; width: 30px;
                    background: transparent;
                    border: 1px solid rgba($dark, .3);;
                    border-radius: .25rem;
                }

                .f-cbox--label {
                    position: absolute; top: 4px; left: 55px;
                }
            }

            .form-radios {
                .f-radio {
                    position: relative;
                    cursor: pointer;

                    .f-radio--wrap {
                        height: 70px; width: 100%;
                        background: $white;
                        border: 1px solid $primary;
                        border-radius: .25rem;

                        @include bp-sm {
                            height: 40px; margin-bottom: 15px;
                        }
                    }

                    .f-radio--text {
                        position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%,-50%);
                        color: $primary;
                    }

                    .f-radio--input {
                        position: absolute; top: 0; left: 0;
                        width: 100%; height: 100%;
                        z-index: 1; opacity: 0;
                        cursor: pointer;

                        &:checked ~ .f-radio--wrap {
                            background: $primary;
                            box-shadow: 0 0 10px 10px rgba($dark,.1);
                            transition: all .5s ease;

                            &:before {
                                content: '';
                                position: absolute; top: 5px; left: 21px; 
                                width: 15px; height: 15px;

                                border-radius: 100%;
                                background-color: $white;
                                display: block;
                            }

                            &:after {
                                content: '';
                                position: relative; top: 7px; left: 11px; 
                                width: 3px; height: 7px;
                                border: solid $primary;
                                border-width: 0 1px 1px 0;
                                transform: rotate(45deg);
                                display: block;
                            }
                        }

                        &:checked ~ .f-radio--text {
                            color: $white;
                            transition: all .5s ease;
                        }
                    }
                }
            }

            .buttons {
                margin-top: 25px;
            }
        }
    }

</style>
