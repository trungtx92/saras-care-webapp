<template>
  <div id="dashboard" class="private m80b">
    <CaseOfficerHeader
      v-if="this.$parent.loggedin.role === 'ROLE_CASE_OFFICER'"
      compTitle="Header"
    />
    <AdminHeader v-else compTitle="Header" />

    <section class="loadcontent">
      <div class="container-fluid">
        <div class="row m50t">
          <section id="case" class="has-bgwbor col-12">
            <div
              v-if="$route.name == 'admin-case-view' || $route.name == 'cofficer-case-view'"
              class="row each"
            >
              <div class="col-12">
                <div class="row justify-content-md-between">
                  <h4 class="col-6 col-md-auto">
                    View Case ID:
                    <strong>#{{ viewCase.id }}</strong>
                  </h4>
                  <div class="col-6 col-md-auto align-items-end">
                    <button class="btn bordered secondary" @click="back">Go Back</button>
                    <button class="btn solid primary m10l" @click="editCase(viewCase.id)">Edit</button>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="row">
                  <label class="col-12">Case Officer:</label>
                  <p v-if="viewCase.caseOfficer" class="col-12">{{ viewCase.caseOfficer.name }}</p>
                  <p v-else class="col-12">Not assigned</p>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="row">
                  <label class="col-12">Status:</label>
                  <div class="col-auto">
                    <span class="tag is-dark">{{ viewCase.offenseStatus.description }}</span>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="row">
                  <label class="col-12">Case Notes:</label>
                  <div class="col-auto">{{ viewCase.notes }}</div>
                </div>
              </div>
            </div>

            <form
              v-if="$route.name == 'admin-case-edit' || $route.name == 'cofficer-case-edit'"
              class="row each"
              @submit="formSubmit"
            >
              <b-notification
                class="w-100"
                v-if="issuccess == true"
                type="is-success"
                aria-close-label="Close notification"
              >Case has been updated successfully.</b-notification>

              <div class="col-12">
                <div class="row justify-content-md-between">
                  <h4 class="col-6 col-md-auto">
                    Edit Case ID:
                    <strong>#{{ viewCase.id }}</strong>
                  </h4>
                  <div class="col-6 col-md-auto align-items-end">
                    <button class="btn bordered secondary" @click="goBack">Go Back</button>
                    <button :disabled="$v.$invalid" class="btn solid primary m10l">Save</button>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6" v-if="!caseOfficerLoggedIn()">
                <div class="row">
                  <label class="col-12">Case Officer:</label>
                  <div class="col-12">
                    <select
                      id="caseOfficerSelected"
                      v-model="selectedCaseOfficer"
                      class="form-control w-100"
                    >
                      <option selected disabled="disabled">Choose a Case Officer</option>
                      <option
                        v-for="caseOfficer in caseOfficers"
                        v-bind:value="caseOfficer.id"
                      >{{ caseOfficer.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="row">
                  <label class="col-12">Status:</label>
                  <div class="col-12">
                    <select id="caseOffenseStatus" v-model="selected" class="form-control w-100">
                      <option selected disabled>Choose a status</option>
                      <option
                        v-for="status in statuses"
                        v-bind:value="status.id"
                      >{{ status.description }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12 m15t">
                <div class="row">
                  <label class="col-12">Case Notes:</label>
                  <div class="col-12">
                    <b-field>
                      <b-input v-model="caseOffenseNotes" type="textarea" placeholder="Enter Notes"></b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </form>

            <div class="row each">
              <h4 class="col-12">Offense</h4>
              <div class="col-12 col-md-6">
                <div class="row">
                  <label class="col-12">Accused(s) Name:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Offender'"
                    >{{ v.contact.name }}</span>
                  </p>
                </div>
                <div class="row case--evidence">
                  <label class="col-12">Evidence:</label>
                  <div class="col-12">
                    <button v-if="hasEvidence" @click="downloadEvidence" class="btn btn-primary">
                      Download Evidence
                      <span
                        v-if="showEvidenceLoading"
                        class="spinner-border spinner-border-sm-inline"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <p v-else>
                      No Evidence Provided
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="row">
                  <label class="col-12 col-md-4">Date:</label>
                  <p
                    class="col-12 col-md-6"
                  >{{ new Date(viewCase.offenseDate).toLocaleDateString() }}</p>
                </div>
                <div class="row">
                  <label class="col-12 col-md-4">Location:</label>
                  <p class="col-12 col-md-6">{{ viewCase.location }}</p>
                </div>
                <div class="row">
                  <label class="col-12 col-md-4">Type of Offense:</label>
                  <p class="col-12 col-md-6">{{viewCase.offenseType && viewCase.offenseType.description }}</p>
                </div>
                <div class="row">
                  <label class="col-12 col-md-4">Description:</label>
                  <p class="col-12 col-md-6">{{ viewCase.description }}</p>
                </div>
              </div>
            </div>

            <div
              class="row each"
              v-for="v in viewCase.offenseContacts"
              v-if="v.contactType.description == 'Witness'"
            >
              <h4 class="col-12">Witness</h4>
              <div class="col-12 col-md-4">
                <div class="row">
                  <label class="col-12">Name:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Witness'"
                    >{{ v.contact.name }}</span>
                  </p>
                </div>
              </div>
              <div
                class="col-12 col-md-4"
                v-for="v in viewCase.offenseContacts"
                v-if="v.contactType.description == 'Witness'"
              >
                <div class="row">
                  <label class="col-12">Phone:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Witness'"
                    >{{ v.contact.phoneNumber }}</span>
                  </p>
                </div>
              </div>
              <div
                class="col-12 col-md-4"
                v-for="v in viewCase.offenseContacts"
                v-if="v.contactType.description == 'Witness'"
              >
                <div class="row">
                  <label class="col-12">Email:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Witness'"
                    >{{ v.contact.email }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div
              class="row each"
              v-for="v in viewCase.offenseContacts"
              v-if="v.contactType.description  == 'Victim'"
            >
              <h4 class="col-12">Victim</h4>

              <div class="col-12 col-md-4">
                <div class="row">
                  <label class="col-12">Name:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Victim'"
                    >{{ v.contact.name }}</span>
                  </p>
                </div>
              </div>
              <div
                class="col-12 col-md-4"
                v-for="v in viewCase.offenseContacts"
                v-if="v.contactType.description == 'Victim'"
              >
                <div class="row">
                  <label class="col-12">Phone:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description == 'Victim'"
                    >{{ v.contact.phoneNumber }}</span>
                  </p>
                </div>
              </div>
              <div
                class="col-12 col-md-4"
                v-for="v in viewCase.offenseContacts"
                v-if="v.contactType.description == 'Victim'"
              >
                <div class="row">
                  <label class="col-12">Email:</label>
                  <p class="col-12">
                    <span
                      v-for="v in viewCase.offenseContacts"
                      v-if="v.contactType.description  == 'Victim'"
                    >{{ v.contact.email }}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AdminHeader from "@/components/private/admin/Header.vue";
import CaseOfficerHeader from "@/components/private/caseofficer/Header.vue";
import OffenseApi from "@/services/OffenseApi";
import { required } from "vuelidate/lib/validators";
import { oneDrive } from "@/constants/general.js";

export default {
  name: "Dashboard",
  props: ["id"],
  components: {
    AdminHeader,
    CaseOfficerHeader
  },
  data() {
    return {
      viewCase: "",
      editmode: this.$parent.case_editmode,
      issuccess: false,
      AuthStr: "",
      config: "",
      caseOffenseStatus: "",
      selected: "",
      statuses: [{ id: "a", description: "b" }],
      caseOfficerSelected: "",
      selectedCaseOfficer: "Choose a Case Officer",
      caseOfficers: [{ id: "a", name: "b" }],
      caseOffenseNotes: "",
      evidences: [],
      showEvidenceLoading: false,
      hasEvidence: false
    };
  },
  validations: {
    selected: {
      required: required
    }
  },
  mounted() {
    // from OffenseAPI GET
    // (1) OffenseApi.fetchSingle - selected case for viewing purposes
    // (2) OffenseApi.fetchStatuses - all offense statuses to update/edit

    if (!this.$parent.checkLoggedIn()) {
      this.$router.push("/404");
    } else {
      this.AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
      this.config = { headers: { Authorization: this.AuthStr } };

      axios
        .all([
          OffenseApi.fetchSingle(this.id, this.config),
           OffenseApi.fetchStatuses()
        ])
        .then(
          axios.spread((percase, status) => {
            this.viewCase = percase;
            this.caseOffenseNotes = percase && percase.notes;
            this.statuses = status;
            this.getCaseOfficers();
            this.getEvidence();
          })
        );
    }
  },

  methods: {
    // go back by one record, the same as history.back()
    back() {
      this.$router.go(-1);
    },
    goBack() {
      this.$router.go(-2);
    },
    // button to trigger Edit Case actions
    editCase(id) {
      this.$router.push("/admin/case/edit/" + id);
    },
    downloadEvidence() {
      console.log(this.evidences);

      var AuthStr = "Bearer " + "rC4vOjK4J35FVBby6Lnrutg22sMSF4";
      var config = { headers: { Authorization: AuthStr }, responseType:"blob" };
      let url = oneDrive[0].fileUrl;

      this.showEvidenceLoading = true;
      this.evidences
        .forEach(evidence => {
          axios
            .get(url.replace("{0}", evidence.EvidenceFileID),config)
            .then(resp => {
              var jsonFile = new Blob([resp.data], {
                type: evidence.EvidenceFileType
              });

              // Download link
              var downloadLink = document.createElement("a");

              // File name
              downloadLink.download = evidence.EvidenceFileName;

              // We have to create a link to the file
              downloadLink.href = window.URL.createObjectURL(jsonFile);

              // Make sure that the link is not displayed
              downloadLink.style.display = "none";

              // Add the link to your DOM
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }).catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.showEvidenceLoading = false;
        });
        })
    },
    getCaseOfficers() {
      axios.get("staff", this.config).then(response => {
        this.caseOfficers = response.data;
        this.tuneData();
      });
    },
    getEvidence() {
      let url = oneDrive[0].fileUrl;
      let caseEvidence = [];
      if (
        this.viewCase.EvidenceLocation &&
        this.viewCase.EvidenceLocation.length > 0
      ) {
        this.hasEvidence = true;
        for (var x in this.viewCase.EvidenceLocation) {
          if (
            this.viewCase.EvidenceLocation[x] &&
            this.viewCase.EvidenceLocation[x].EvidenceFileType
          ) {
            this.evidences.push(this.viewCase.EvidenceLocation[x]);
          }
        }
      }
    },

    tuneData() {
      let role = "ROLE_CASE_OFFICER";
      let data = [];
      for (var x in this.caseOfficers) {
        if (
          this.caseOfficers[x] &&
          this.caseOfficers[x].userAccount &&
          this.caseOfficers[x].userAccount.roles.includes(role)
        ) {
          data.push(this.caseOfficers[x]);
        }
      }
      this.caseOfficers = data;
    },
    formSubmit(e) {
      e.preventDefault();
      axios
        .patch(
          "offenses/" + this.id,
          {
            caseOfficer: this.selectedCaseOfficer,
            offenseStatus: this.selected,
            notes: this.caseOffenseNotes
          },
          this.config
        )
        .then(response => {
          this.issuccess = true;
        });
    },
    caseOfficerLoggedIn() {
      if (this.$parent.loggedin.role === "ROLE_CASE_OFFICER") {
       // this.selectedCaseOfficer = this.$parent.loggedin.id;
        return true;
      } else {
        if (this.viewCase.caseOfficer !== null) {
         // this.selectedCaseOfficer = this.viewCase.caseOfficer && this.viewCase.caseOfficer.id;
        }
        return false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/theme.scss";

.has-bgwbor {
  padding: 25px 15px;
  background-color: $white;
  border-radius: 0.25rem;
  border: 1px solid rgba($secondary, 0.3);
}

#case {
  > .row {
    border-bottom: 1px solid rgba($secondary, 0.3);
    padding: 15px;

    &:last-child {
      border-bottom: none;
    }

    h4 {
      text-transform: uppercase;
      font-size: 14px !important;
      font-weight: bold;
      color: $secondary;
      margin: 25px 0;
    }

    label {
      color: #999;
    }

    .case--evidence {
      img {
        height: 50px;
        margin-right: 5px;
      }
    }
  }
}

#boxoffour {
  .each {
    background-color: $white;
    color: $secondary;
    border: 1px solid rgba($secondary, 0.3);
    height: 120px;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 24%;
    flex: 0 0 24%;
    max-width: 24%;
    border-radius: $bradius;

    @include bp-md {
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }

    @include bp-sm {
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    }

    .left {
      font-size: 18px;
      line-height: normal;
    }
    .right {
      font-size: 35px;
      font-weight: bold;
      text-align: right;
    }
  }
}
</style>