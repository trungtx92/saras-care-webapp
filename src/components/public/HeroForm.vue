<template>
  <form
    id="hero"
    class="needs-validation"
    novalidate
    @submit="formSubmit"
    enctype="multipart/form-data"
  >
    <div v-show="step === 1">
      <div class="row form-group">
        <div class="col-12">
          <b-field position="is-right">
            <b-select
              placeholder="Default Language"
              icon="earth"
              @input="changed"
              v-model="changeLanguage"
            >
              <option value="en">English (en)</option>
              <option value="hi">हिंदी (हिं)</option>
            </b-select>
          </b-field>
        </div>
      </div>
      <div class="row title">
        <div class="col">
          <h4>{{ componentTitle }}</h4>
          <pre v-if="output">{{ output }}</pre>
        </div>
      </div>

      <div class="row form-radios">
        <label class="col-12 col-sm-6 form-check-label f-radio" for="inlineCheckbox1">
          <input
            type="radio"
            name="case-type"
            class="f-radio--input"
            value="witness"
            v-model="casetype"
            @click="clearCaseTypeErrorMessage"
          />
          <div class="f-radio--wrap"></div>
          <span class="f-radio--text">{{ $t('witness') }}</span>
        </label>

        <label class="col-12 col-sm-6 form-check-label f-radio" for="inlineCheckbox1">
          <input
            type="radio"
            name="case-type"
            class="f-radio--input"
            value="victim"
            v-model="casetype"
            @click="clearCaseTypeErrorMessage"
          />
          <div class="f-radio--wrap"></div>
          <span class="f-radio--text">{{ $t('victim') }}</span>
        </label>

        <p class="error" v-if="caseTypeErrorMessage">{{ caseTypeErrorMessage }}</p>
      </div>

      <div class="row form-group">
        <div class="col-12">
          <h6 class="m15t m15b">{{ $t('formFill')}} {{ ip.address }} {{ ip.country }}</h6>
        </div>
        <div class="col-12">
          <b-field>
            <b-input
              id="name"
              :disabled="this.caseAnonymous === 'yes'"
              v-model="name"
              type="name"
              v-bind:placeholder="$t('enterName')"
              minlength="3"
            ></b-input>
          </b-field>
          <div v-if="$v.name.$dirty">
            <p class="error" v-if="!$v.name.required">{{$t('enterNameError')}}</p>
          </div>

          <b-field>
            <b-field>
              <b-input
                v-bind:placeholder="$t('countryCode')"
                icon="earth"
                :disabled="true"
                v-model="country_code"
              >
              </b-input>
            </b-field>
            <div id="parent" style="width:100%">
              <div>
                <b-input
                  id="phone"
                  :disabled="this.caseAnonymous === 'yes'"
                  v-model.trim="$v.phone.$model"
                  type="phone"
                  v-bind:placeholder="$t('enterPhone')"
                  expanded
                ></b-input>
              </div>
              <div id="phone-error" v-if="$v.phone.$dirty" style="margin:13.3px">
                <p class="error" v-if="!$v.phone.checkValid">{{$t('enterPhone')}}</p>
              </div>
            </div>
          </b-field>
          <b-field>
            <b-input
              id="email"
              :disabled="this.caseAnonymous === 'yes'"
              v-model="email"
              type="email"
              v-bind:placeholder="$t('enterEmail')"
            ></b-input>
          </b-field>
          <div v-if="$v.email.$dirty">
            <p class="error" v-if="!$v.email.required">{{ $t('enterEmailError') }}</p>
          </div>
        </div>
      </div>

      <div class="row form-cbox">
        <div class="col">
          <input
            type="checkbox"
            class="form-check-input"
            id="caseAnonymous"
            v-model="caseAnonymous"
            true-value="yes"
            false-value="no"
            @change="checkAnonymous"
            required
          />
          <label class="f-cbox--label" for="caseAnonymous">{{ $t('anonymousSubmit')}}</label>
          <div class="f-cbox--wrap"></div>
        </div>
      </div>

      <hr />

      <div class="row form-group">
        <div class="col-12">
          <b-field>
            <b-select
              v-bind:placeholder="$t('chooseOffenseType')"
              expanded
              id="caseOffenseType"
              v-model="selected"
            >
            <option selected disabled>{{ $t('chooseOffenseType') }}</option>
              <option v-for="type in offensetypes" v-bind:value="type.id">{{$t(type.description)}}</option>
            </b-select>
          </b-field>
          <div v-if="$v.selected.$dirty">
            <p class="error" v-if="!$v.selected.required">{{$t('chooseOffenseType')}}</p>
          </div>

          <b-field>
            <b-input
              id="caseDescription"
              v-model="caseDescription"
              maxlength="200"
              type="textarea"
              v-bind:placeholder="$t('enteroffenseDescription')"
            ></b-input>
          </b-field>
          <div v-if="$v.caseDescription.$dirty">
            <p class="error" v-if="!$v.caseDescription.required">{{$t('enterDescriptionError')}}</p>
          </div>

          <div>
            <div class="left col-md-6">
              <h6 class="m15b">{{ $t('enteroffenseLocation')}}</h6>
            </div>
            <b-field>
              <b-select placeholder="State" v-model="state" @input="selectState">
                <option v-for="(type,index)  in statesData.states" :value="index">{{$t(type.state)}}</option>
              </b-select>

              <b-select
                placeholder="District"
                v-model="district"
                expanded
                :disabled="this.districts.length===0"
              >
                <option v-for="type in districts" :value="type">{{$t(type)}}</option>
              </b-select>
            </b-field>
          </div>
          
          <div v-if="$v.state.$dirty ||$v.district.$dirty ">
            <p class="error" v-if="!$v.state.required || !$v.district.required">{{$t('enteroffenseLocation')}}</p>
          </div>

          <b-field>
            <b-input type="number" onKeyPress="if(this.value.length>6) return false;" v-model="postcode" placeholder="Postcode"></b-input>
          </b-field>
          <div v-if="$v.postcode.$dirty">
            <p class="error" v-if="!$v.postcode.required">{{$t('enteroffensePostCode')}}</p>
          </div>
        </div>
      </div>

      <div class="row buttons">
        <div class="col">
          <button class="w-100" @click.prevent="next()">
            {{ $t('next')}}
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div 
      id='recaptcha'
      class="g-recaptcha"
      data-sitekey="6LdpAr4UAAAAAP1T6b9vUDpBkpAcYYqXN7wIOfK_"
      data-size="invisible">
</div>
    </div>

    <div v-show="step === 2">
      <div class="row heading">
        <div class="col">
          <h4>{{ $t('offenseDetails') }}</h4>
        </div>
      </div>

      <hr />
      <div class="row justify-content-center">
        <div class="col-12">
          <p>{{$t('optionalMsg')}}</p>
        </div>
      </div>

      <div class="row form-group">
        <div class="col-12">
          <!-- <b-field>
            <input
              id="caseDate"
              class="form-control"
              v-model="caseDate"
              type="date"
              aria-describedby="caseDateHelp"
              placeholder="Date of the Offense"
            />
          </b-field> -->
          <b-field>
            <b-datepicker
                v-model="caseDate"
                placeholder="Click to select date..."
                icon="calendar-today">
            </b-datepicker>
        </b-field>
          <!-- <b-field>
            <input
              id="caseTime"
              class="form-control"
              v-model="caseTime"
              type="time"
              aria-describedby="caseDateHelp"
              placeholder="Time of the Offense"
            />
          </b-field> -->
          <b-field>
              <b-clockpicker
                  v-model="caseTime"
                  rounded
                  placeholder="Click to select time..."
                  icon="clock"
                  :hour-format="hourFormat">
              </b-clockpicker>
          </b-field>

          <b-field>
            <b-input
              id="caseVictim"
              v-model="caseVictim"
              v-if="casetype == 'witness'"
              type="text"
              v-bind:placeholder="$t('enterVictimName')"
            ></b-input>
          </b-field>

          <b-field>
            <b-input
              id="caseOffender"
              v-model="caseOffender"
              type="text"
              v-bind:placeholder="$t('enterOffenderName')"
            ></b-input>
          </b-field>

          <div class="row form-group">
            <div class="col-12 m15t">
              <div class="row justify-content-between">
                <div class="col-auto align-self-center">
                  <label>{{ $t('evidenceFill')}}</label>
                </div>
                <div class="col-auto upload-box">
                  <b-field>
                <b-upload v-model="files"
                 multiple
                 type="is-info"    
                drag-drop>
                <section class="section">
                <div class="content has-text-centered">
                    <p>Drop files here or click to upload</p>
                </div>
                </section>
                </b-upload>
            </b-field>

            <div class="tags">
              <span v-for="(file, index) in files"
                  :key="index"
                  class="tag is-primary" >
                  {{file.name}}
                  <button class="delete is-small"
                  type="button"
                  @click="deleteDropFile(index)">
                  </button>
              </span>
         </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12">
          <hr />
          <p>
            {{$t('registerMessage')}}
            <br />
            {{$t('registerMsg')}}
          </p>
        </div>
      </div>
      <div class="row buttons">
        <div class="col-6 col-md-6">
          <button class="w-100" @click.prevent="prev()">
            <i class="fas fa-chevron-left m10r"></i> Prev
          </button>
        </div>
        <div class="col-6 col-md-6">
          <button type="submit" class="col">
            Submit
            <i class="fas fa-chevron-right m10l"></i>
          </button>
        </div>
      </div>
    </div>
    <div id="case--summary" v-show="step === 3">
            <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="false">
                <b-icon
                    pack="fas"
                    icon="sync-alt"
                    size="is-large"
                    custom-class="fa-spin">
                </b-icon>
            </b-loading>
       <div class="row m15b text-center">
        <div class="col">
          <h4>Here is a summary of your report</h4>
        </div>
      </div>

      <div class="row summary">
        <div class="col-12">
          <div class="row">
            <div class="heading col-12">
              <h5>Case # {{ this.caseID }} Information</h5>
            </div>
            <div class="result col-12">
              <div class="row">
                <div class="left col-12 col-md-6">Name:</div>
                <div class="right col-12 col-md-6">{{ this.name }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Phone:</div>
                <div class="right col-12 col-md-6">{{ this.phone }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Email:</div>
                <div class="right col-12 col-md-6">{{ this.email }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="heading col-12">
              <h5>Evidence</h5>
            </div>
            <div class="result col-12">
              <div class="row">
                <div class="col-12">{{ this.evidenceMessage }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="heading col-12">
              <h5>About the Offense</h5>
            </div>
            <div class="result col-12">
              <div class="row">
                <div class="left col-12 col-md-6">Offense Date:</div>
                <div class="right col-12 col-md-6">{{ this.currentDate }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Offense Time:</div>
                <div class="right col-12 col-md-6">{{ this.currentTime }}</div>
              </div>
              <div class="row" v-if="casetype == 'witness'">
                <div class="left col-12 col-md-6">Victim Name:</div>
                <div class="right col-12 col-md-6">{{ this.caseVictim }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Offender Name:</div>
                <div class="right col-12 col-md-6">{{ this.caseOffender }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Offense Location:</div>
                <div class="right col-12 col-md-6">{{ this.formatLocation() }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Type of Offense:</div>
                <div class="right col-12 col-md-6">{{ this.caseOffenseType }}</div>
              </div>
              <div class="row">
                <div class="left col-12 col-md-6">Offense Description:</div>
                <div class="right col-12 col-md-6">{{ this.caseDescription }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row buttons">
        <div class="col-sm-12">
          <button
            class="btn bordered secondary w-100"
            @click.prevent="register()"
          >{{ $t('reportAnother') }}</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { required, minLength, email, phone } from "vuelidate/lib/validators";
const isPhone = value => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value);
import myCaptcha from "../customComponents/vue-captcha.vue";
import { oneDrive } from "@/constants/general.js";
import { statesAndDistricts } from "@/constants/statesAndDistricts.js";

export default {
  name: "Form",
  props: {
    componentTitle: String,
    language: String
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    postcode:{
      required:required
    },district:{
      required:required
    },
    state:{
      required:required
    },
    email: {
      email: email,
      required: required
    },
    caseDescription: {
      required: required
    },
    selected: {
      required: required
    },
    phone: {
      required: required,
      checkValid(phone) {
        if (
          /[0-9]/.test(phone) &&
          phone.length == 10 &&
          !/[a-z]/.test(phone) &&
          !/[A-Z]/.test(phone) &&
          !/\W|_/.test(phone)
        ) {
          return true;
        }
        return false;
      }
    }
  },
  mounted() {
    console.log("Form component mounted.");
    this.getOffenseTypes();
    this.getTodayDate();
    this.statesData = statesAndDistricts;
  },
  data: function() {
    return {
      step: 1,
      today: "",
      userLanguage: "",
      ip: [
        {
          address: "",
          city: "",
          country: "",
          longitude: "",
          latitude: ""
        }
      ],
      state: null,
      district: null,
      url: "",
      name: "",
      phone: "",
      postcode:null,
      email: "",
      caseID: "",
      folderurl:"",
      fileUpload:"",
      oneToken:"",
      rootID:"",
      currentFolderID:"",
      currentFileID:"",
      currentFileName:"",
      fileType:"",
      isLoading: false,
      isFullPage: true,
      oneFiles:[],
      output: "",
      casetype: "",
      caseDate: "",
      currentDate:"",
      currentTime:"",
      date: new Date(),
      isAmPm: true,
      caseTime: "",
      caseVictim: "",
      caseOffender: "",
      caseLocation: "",
      caseAnonymous: "",
      caseDescription: "",
      caseOffenseType: "",
      files: [],
      timezoneOffset: "",
      caseTypeErrorMessage: "",
      statesData: [],
      districts: [],
      // contactType
      contactWitness: 1,
      contactVictim: 2,
      contactOffender: 3,

      victimID: "",
      offenderID: "",
      witnessID: "",

      evidenceID: "",
      evidenceMessage: "",

      baseURL: axios.defaults.baseURL,
      selected: null,
      offensetypes: [{ text: "a", value: "b" }],
      country_code: "+91"
    };
  },
  computed: {
    hourFormat() {
      return this.isAmPm ? "12" : "24";
    },
    changeLanguage() {
      return this.language;
    }
  },

  methods: {
    deleteDropFile(index) {
            this.files.splice(index, 1)
        },
    changed(val) {
      if (val != null) {
        this.$v.$reset();
        this.caseTypeErrorMessage = "";
        localStorage.setItem("language", JSON.stringify(val));
        this.$locale = val;
      }
    },touchMandatoryFields(){
        this.$v.caseDescription.$touch();
        this.$v.selected.$touch();
        this.$v.state.$touch();
        this.$v.district.$touch();
        this.$v.postcode.$touch();
    },
      formatLocation() {
    return this.state && this.statesData.states[this.state]&& this.statesData.states[this.state].state + " " + this.district + " " + this.postcode;
  },
    selectState: function() {
      this.district = "";
      this.districts =
        this.state && this.statesData.states[this.state].districts;
    },
    checkAnonymous(){
      if(this.caseAnonymous==="yes"){
        this.$v.$reset();
      }
    },
    checkValidFields(){
      return !this.$v.caseDescription.$invalid && !this.$v.selected.$invalid && 
        !this.$v.postcode.$invalid && !this.$v.state.$invalid && !this.$v.district.$invalid;
    },
  
    clearCaseTypeErrorMessage: function(evt) {
      this.caseTypeErrorMessage = "";
    },

    // Populate Offense Type dropdown on Step 2
    getOffenseTypes() {
      this.url = this.baseURL + "/offense-types";
      axios.get(this.url).then(response => {
        this.offensetypes = response.data;
      });
    },

    getTodayDate() {
      var dtToday = new Date();

      var month = dtToday.getMonth() + 1;
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if (month < 10) month = "0" + month.toString();
      if (day < 10) day = "0" + day.toString();

      var maxDate = year + "-" + month + "-" + day;
      $("#caseDate").attr("max", maxDate);
    },

    // Form controls
    prev() {
      this.step--;
      this.$parent.formstep--;
    },
    next() {
      let proceed;
      this.$v.$reset();

      if (this.caseAnonymous === "yes") {
        this.touchMandatoryFields();
      if (this.checkValidFields()) {
          proceed = true;
          grecaptcha.execute();
        }
      } else {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          proceed = true;
        }
      }

     if (this.casetype != "witness" && this.casetype != "victim") {
        this.caseTypeErrorMessage = this.$t("victimOrWitness");
        proceed = false;
      }

      if (proceed) {
        this.step++;
        this.$parent.formstep++;
      }

     document.getElementById("hero").scrollTop = 0;
    },

    // Custom Browse function replaced by Button
    // chooseFiles() {
    //   document.getElementById("files").click();
    // },

    formSubmit(e) {
      e.preventDefault();
      let currentObj = this;
      if (this.caseAnonymous == "yes") {
        this.name = "Anonymous";
        this.phoneNumber = "";
        this.email = "";
      }
      if (this.casetype == "victim") {
        this.postAsVictim();
      } else if (this.casetype == "witness") {
        this.postAsWitness();
      }
      this.next();
    },
    postAsVictim() {
      this.isLoading=true
      axios
        .all([
          this.postOffense(),
          this.postContact(this.name, this.phone, this.email),
          this.postContact(this.caseOffender, "", "")
        ])
        .then(
          axios.spread((offenseResponse, victimResponse, offenderResponse) => {
            this.caseID = offenseResponse.data.id;
            this.victimID = victimResponse.data.id;
            this.offenderID = offenderResponse.data.id;
            this.$parent.$parent.registration.reportedUserID = this.victimID;
            this.folderurl = offenseResponse.data.FolderURL;
            this.fileUpload = offenseResponse.data.UploadURL;
            this.rootID = offenseResponse.data.ParentID;
            this.oneToken = offenseResponse.data.BearerToken;
            axios
              .all([
                this.postOffenseContact(
                  this.caseID,
                  this.victimID,
                  this.contactVictim
                ),
                this.postOffenseContact(
                  this.caseID,
                  this.offenderID,
                  this.contactOffender
                )
              ])
              .then(
                axios.spread((OCVreponse, OCOreponse) => {
                  this.postMetadata();
                })
              ).then(
                axios.all([
                  this.createCaseFolder()
                ]).then(
                  axios.spread((folderresponse)=>{
                    this.currentFolderID = folderresponse.data.id;
                    this.isLoading=false;
                    axios.all([
                      this.postOffenseEvidence(this.currentFolderID)
                    ])
                  })
                )
              )
          }),
        );
    },

    postAsWitness() {
    this.isLoading=true
      axios
        .all([
          this.postOffense(),
          this.postContact(this.name, this.phone, this.email),
          this.postContact(this.caseVictim, "", ""),
          this.postContact(this.caseOffender, "", "")
        ])
        .then(
          axios.spread(
            (
              offenseResponse,
              witnessResponse,
              victimResponse,
              offenderResponse
            ) => {
              this.caseID = offenseResponse.data.id;
              this.witnessID = witnessResponse.data.id;
              this.victimID = victimResponse.data.id;
              this.offenderID = offenderResponse.data.id;
              this.$parent.$parent.registration.reportedUserID = this.witnessID;
              this.folderurl = offenseResponse.data.FolderURL;
              this.fileUpload = offenseResponse.data.UploadURL;
              this.rootID = offenseResponse.data.ParentID;
              this.oneToken = offenseResponse.data.BearerToken;
              axios
                .all([
                  this.postOffenseContact(
                    this.caseID,
                    this.witnessID,
                    this.contactWitness
                  ),
                  this.postOffenseContact(
                    this.caseID,
                    this.victimID,
                    this.contactVictim
                  ),
                  this.postOffenseContact(
                    this.caseID,
                    this.offenderID,
                    this.contactOffender
                  )
                ])
                .then(
                  axios.spread((OCWreponse, OCVreponse, OCOreponse) => {
                    this.postMetadata();
                  })
                ).then(
                  axios.all([
                    this.createCaseFolder()
                  ]).then(
                    axios.spread((folderresponse)=>{
                      this.currentFolderID = folderresponse.data.id;
                      this.isLoading=false;
                      axios.all([
                        this.postOffenseEvidence(this.currentFolderID),
                      ])
                    })
                ))
            }
          )
        );
    },

    // POST meta data only if NOT anonymous
    postMetadata() {
      if (this.caseAnonymous != "yes") {
        // GET meta data from http://ip-api.com/json
        axios
          .get(
            "http://ip-api.com/json/?fields=status,message,country,city,lat,lon,query"
          )
          .then(response => {
            this.ip.address = response.data.query;
            this.ip.city = response.data.city;
            this.ip.country = response.data.country;
            this.ip.longitude = response.data.lon;
            this.ip.latitude = response.data.lat;

            this.url = this.baseURL + "/offenses/" + this.caseID + "/metadata";
            axios.post(this.url, {
              ipAddress: this.ip.address,
              city: this.ip.city,
              country: this.ip.country,
              longitude: this.ip.longitude,
              latitude: this.ip.latitude
            });
          });
      }
    },

    createCaseFolder() {
      var createfolder = this.folderurl;
      var folddata = {
        parent_id:this.rootID,
        name:this.caseID
      }
      return axios.post(createfolder,folddata,{
        headers: {
            Authorization: "Bearer " + this.oneToken,
            "Content-Type": "application/json",
          }},
      )
    },

    postOffenseEvidence(cParent) {
        var fileurl = this.fileUpload;
        for (var i = 0; i < this.files.length; i++) {
          this.isLoading = true;
          let formData = new FormData();
          formData.append('files', this.files[i]);
          var filename = { name: this.files[i].name, parent_id: cParent};
          axios.post(fileurl, formData, {
              headers: {
                Authorization: "Bearer " + this.oneToken,
                "Content-Type": "multipart/form-data",
                "X-Kloudless-Metadata": JSON.stringify(filename)
              }
            }).then((fileresponse)=>{
                this.currentFileID = fileresponse.data.id;
                this.fileType = fileresponse.data.mime_type;
                this.currentFileName = fileresponse.data.name;
                var postFileUrl = "https://back.saras.care/save-file";
                var fileData = {
                offenseID: this.caseID,
                folderID: cParent,
                fileID: this.currentFileID,
                fileName:this.currentFileName,
                fileType:this.fileType
                }
                axios.all([
                  axios.post(postFileUrl,fileData)
                  .then(()=>{
                    this.isLoading = false;
                  })                
              ])
            }
          )
          }
          
    },

    // POST an offense
    postOffense() {
      this.caseOffenseType = this.offensetypes[this.selected -1].description;
      this.url = this.baseURL + "/offenses";
      if(this.caseDate==""){
        this.currentDate="";
        this.currentTime="";
      }else{
        var getDate = this.caseDate.getDate();
        var getMonth = this.caseDate.getMonth();
        var getYear = this.caseDate.getFullYear();
        var getHour = this.caseTime.getHours();
        var getMinutes = this.caseTime.getMinutes();
        this.currentDate = getYear+"-"+getMonth+"-"+getDate;
        this.currentTime = getHour+":"+getMinutes;
      }
      var t = this.date.getTimezoneOffset();
      this.timezoneOffset = "0";

      if (Number.isInteger(t)) {
        this.timezoneOffset = t.toString();
      }

      return axios.post(this.url, {
        offenseDate: Number.isInteger(t)? this.currentDate + " " + this.currentTime : null,
        offenseType: this.selected,
        location: this.formatLocation(),
        description: this.caseDescription,
        timezoneOffset: this.timezoneOffset
      });
    },

    // POST contact(s) attached to an offense
    postContact(c_name, c_phone, c_email) {
      this.url = this.baseURL + "/other-contacts";
      return axios.post(this.url, {
        name: c_name,
        phoneNumber: c_phone,
        email: c_email
      });
    },

    postOffenseContact(o_cid, o_contact_id, o_contact_type) {
      this.url = this.baseURL + "/offense-contacts";
      return axios.post(this.url, {
        offense: o_cid,
        contact: o_contact_id,
        contactType: o_contact_type
      });
    },

    // Button Register to direct to /login page
    register() {
      this.$router.go(0);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/styles/theme.scss";

.title {
  margin-bottom: 15px;
}

#case--summary {
  text-align: left;

  .summary {
    border: 1px solid rgba($secondary, 0.3);
    border-radius: $bradius;
    background-color: $tertiary;
    padding: 25px;

    .row {
      .heading {
        margin: 25px 0 0;
      }
      .result {
        .row {
          @include bp-sm {
            margin-bottom: 15px;
          }

          .left,
          .right {
            height: auto;
          }

          .left {
            @include bp-sm {
              font-size: 12px;
            }
          }

          .right {
            text-align: right;

            @include bp-sm {
              padding: 0 15px;
              text-align: left;
            }
          }
        }
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

    @include bp-md {
      max-height: none;
    }

    .form-cbox {
      position: relative;
      padding-left: 0;

      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        opacity: 0;
        cursor: pointer;

        &:checked ~ div {
          &:after {
            content: "";
            position: relative;
            top: 8px;
            left: 11px;
            width: 6px;
            height: 10px;
            border: solid $secondary;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            display: block;
          }
        }
      }

      .f-cbox--wrap {
        height: 30px;
        width: 30px;
        background: transparent;
        border: 1px solid rgba($dark, 0.3);
        border-radius: 0.25rem;
      }

      .f-cbox--label {
        position: absolute;
        top: 4px;
        left: 55px;
      }
    }

    .form-radios {
      .f-radio {
        position: relative;
        cursor: pointer;

        @include bp-sm {
          height: 40px;
          margin-bottom: 15px;
        }

        .f-radio--wrap {
          height: 70px;
          width: 100%;
          background: $white;
          border: 1px solid $primary;
          border-radius: 0.25rem;

          @include bp-sm {
            height: 40px;
            margin-bottom: 15px;
          }
        }

        .f-radio--text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: $primary;
        }

        .f-radio--input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0;
          cursor: pointer;

          &:checked ~ .f-radio--wrap {
            background: $primary;
            box-shadow: 0 0 10px 10px rgba($dark, 0.1);
            transition: all 0.5s ease;

            &:before {
              content: "";
              position: absolute;
              top: 5px;
              left: 21px;
              width: 15px;
              height: 15px;

              border-radius: 100%;
              background-color: $white;
              display: block;
            }

            &:after {
              content: "";
              position: relative;
              top: 7px;
              left: 11px;
              width: 3px;
              height: 7px;
              border: solid $primary;
              border-width: 0 1px 1px 0;
              transform: rotate(45deg);
              display: block;
            }
          }

          &:checked ~ .f-radio--text {
            color: $white;
            transition: all 0.5s ease;
          }
        }
      }
    }

    

    .buttons {
      margin-top: 25px;
    }
  }

  .col-auto.upload-box{
      width:100%;
    }
}

.upload {
      width: 100%;
      margin-top: 15px;
}

.upload .upload-draggable.is-info{
      width:100%;
}

</style>