<template>
  <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
    <div class="container-fluid" id="kt_content_container">
        <div class="row flex-lg-row-reverse align-items-center g-5 g-xl-8">
            <div class="col-xl-12">
                <div class="card card-xl-stretch mb-xl-8">
                    <div class="card-header border-0 pt-5">
                        <div class="card-toolbar">
                          <v-btn 
                            class="light" 
                            variant="tonal" 
                            color="light"  
                            @click="toogleForm"
                          >
                              <i class="bi bi-arrow-bar-left" style="color: black;"></i>
                          </v-btn>
                          <h3 class="card-title align-items-start flex-column">
                              <span class="card-label fw-bold fs-3 mb-1">Event</span>
                              <span class="text-muted fw-semibold fs-7">Event &raquo; detail</span>
                          </h3>
                        </div>
                        <template v-if="Joined">
                          <div class="badge badge-sm badge-success" style="margin-top:-19px; border-radius:0px 0px 50px 50px;">Joined</div>
                        </template>
                    </div>
                    <div class="card-body py-3">

                    </div>
                </div>
            </div>

            <div class="col-xl-4">
              <div class="card card-xl-stretch mb-xl-8">
                  <div class="card-header border-0 pt-5">
                      <div class="card-toolbar">
                        <span class="card-label fw-bold fs-3 mb-1">Event Poster</span>
                      </div>
                  </div>
                  <div class="card-body py-3" style="text-align: center;">
                      <img v-if="isImage" :src="fileData" alt="Uploaded Image" style="max-height: 600px; max-width: 100%;">
                      <embed v-else-if="isPDF" :src="fileData" type="application/pdf" style="max-height: 600px; height: 500px; max-width: 100%;">
                      <p v-else>No file selected</p>
                  </div>
              </div>
            </div>

            <div class="col-xl-8">
              <div class="card card-xl-stretch mb-xl-8">
                  <div class="card-header border-0 pt-5">
                      <div class="card-toolbar">
                        <span class="card-label fw-bold fs-3 mb-1">Event Detail</span>
                      </div>
                  </div>
                  <div class="card-body py-3">
                    <Form
                        formId="eventForm"
                        @submit.prevent="joinEvent"
                    >

                        <div class="row">
                            <div class="col-md-12">
                                <Label class="mt-3" title="Event Name" />
                                <Text
                                    class="mt-3"
                                    placeholder="Event Name"
                                    v-model="event.event_name"
                                    :value="event.event_name"
                                    min="2023-06-30"
                                    disabled="true"
                                />
                            </div>

                            <div class="col-md-12">
                                <Label class="mt-3" title="Description" />
                                <textarea 
                                    cols="30" 
                                    rows="10"
                                    class="form-control"
                                    disabled="true"
                                >{{ event.event_description }}</textarea>
                            </div>

                        </div>

                        <v-row justify='end' class="mt-5 mb-5">
                            <v-btn 
                                type="submit" 
                                justify='end' 
                                class="mt-5" 
                                fab dark small 
                                variant="tonal" 
                                color="info"
                                :disabled="Joined"
                                :loading="isLoading"
                            >
                                <template v-if="isLoading">
                                    <v-progress-circular
                                        justify='end' 
                                        indeterminate 
                                        :width="4"
                                        :size="18"
                                        color="info"
                                        style="margin-right:9px;"
                                    >
                                    </v-progress-circular>
                                </template>
                                Joins
                                <template v-if="!isLoading">
                                    <i class="bi bi-person-add"></i>
                                </template>
                            </v-btn>
                        </v-row>
                    </Form>
                  </div>
              </div>
            </div>
        </div>
    </div>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
        isLoading: false,
        event: [],
        fileData:null,
        Joined: false,
      }
    },
    mounted(){
      this.index()
    },
    computed: {
        isImage() {
            return this.fileData && this.getFileType(this.fileData) === 'image' || this.getFileExtension(this.fileData) == 'image';
        },
        isPDF() {
            return this.fileData && this.getFileType(this.fileData) === 'pdf' || this.getFileExtension(this.fileData) == 'pdf';
        }
    },
    methods: {
      async index(){
        this.get()
      },
      async get(){
        this.toogleLoading()
        try {
          await this.$api.get('/relationevent/'+this.$route.params.id, {
            headers: { "Content-Type": "application/json" }
          }).then((response) => {
            this.event = response.data.data[0]
            this.fileData = response.data.data[0].event_img
            const user_filter = (response.data.data[0].relation_events).filter(item => item.relation_event_user == this.$dataAuth.user_id)
            
            if(user_filter.length > 0){
              this.Joined = true
            }

            this.toogleLoading()
          })
        } catch (error) {
          this.toogleLoading()
          const err = await error;
          const message = `
            Error \n
            ${err.message} \n
          `;
          this.$swal.fire(message); 
        }
      },
      async joinEvent(){
        const data = {
          relation_event_event : this.event['event_id'], 
          relation_event_user : this.$dataAuth.user_id
        }

        try {
          this.toogleLoading()
          const response = await this.$api.post('/relationevent', data, {
            headers: {  
              headers: { "Content-Type": "application/json" }
            }
          })
          this.toogleLoading()
          // this.toogleForm()
          this.$swal.fire(response.data.meta.message)
        } catch (error) {
          this.toogleLoading()
          const err = await error
          let message = `
              Error \n
              ${err.message} \n
          `
          this.$swal.fire(message)
        }
      },
      async toogleForm(){
        this.$router.push('/events')
      },
      async toogleLoading(){
          if(this.isLoading){
              this.isLoading = false
          }else{
              this.isLoading = true
          }
      },
      getFileType(base64Data) {
          const header = base64Data.substring(0, 30);
          if (header.includes('data:image')) {
              return 'image';
          } else if (header.includes('data:application/pdf')) {
              return 'pdf';
          } else {
              return 'unknown';
          }
      },
      getFileExtension(url) {
          if(url == null){
              return null;
          }
          var pathname = new URL(url).pathname;
          var extension = pathname.substring(pathname.lastIndexOf(".") + 1);
          var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

          if(imageExtensions.includes(extension.toLowerCase())){
              return 'image';
          }else if(extension == 'pdf'){
              return 'pdf';
          }else{
              return 'unknown';
          }
      },
    }
  };
</script>
  