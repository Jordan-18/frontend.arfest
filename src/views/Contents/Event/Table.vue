<template>
      <!-- Table -->
      <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
          <div class="container-fluid" id="kt_content_container">
              <div class="row g-5 g-xl-8">
                  <div class="col-xl-12">
                      <div class="card card-xl-stretch mb-xl-8"></div>
                  </div>
                  
                  <div class="row" :loading="isLoading">
                      <div class="col-md-3" v-for="(v, i) in events" :key="i">
                        <div class="card mt-3">
                            <div class="image-container">
                              <img :src="v.event_img" alt="Your Image">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">
                                  {{v.event_name}}
                                </h5>
                                <h6 class="card-subtitle mb-2 text-muted">
                                  Event date : 
                                    {{ 
                                      new Date((v.event_date_actual))
                                        .toLocaleDateString('en-US', { 
                                          day: '2-digit', 
                                          month: 'long', 
                                          year: 'numeric' 
                                        }) 
                                    }}
                                </h6>
                                <strong>Deskripsi :</strong>
                                <p>{{ (v.event_description).slice(0, 150) + '....' }}</p>
                                <br>
                                <div class="row">
                                    <v-btn 
                                        justify='end' 
                                        color="blue"
                                        fab dark small
                                        variant="tonal"
                                        @click="show(v)"
                                    >Detail &raquo;</v-btn>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div class="container">
                      <v-progress-circular 
                          v-if="isLoading"
                          justify='end' 
                          indeterminate 
                          color="warning"
                      ></v-progress-circular>
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
        accessStore: this.$store.modules.Access.getters.getData,
        toogle: false,
        events: [],
        indexPage: 1,
        search: '',

        breadcrump: '',
      }
    },
    mounted(){
      this.index()
    },
    methods:{
      async index(){
        this.get()
      },
      async get(){
        this.toogleLoading()
            var url = '/event?index='

            if(this.search != ''){
                url = url+'&search='+this.search
            }

            if(this.indexPage != 1){
                url = url+'&page='+this.indexPage
            }
            
            url = url+'&query=Approved'

            await this.$api.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                this.events = response.data.data.data

                console.log(this.events);
                this.toogleLoading()
            })
      },
      async show(data){
        this.$router.push('/events/'+data.event_id)
      },
      async toogleForm(){
        if(this.toogle){
            this.toogle = false
        }else{
            this.toogle = true
        }
      },
      async toogleLoading(){
          if(this.isLoading){
              this.isLoading = false
          }else{
              this.isLoading = true
          }
      },
    }
  };
</script>

<style>
  .image-container {
    max-height: 7cm;
    overflow: hidden;
  }

  .image-container img {
    object-fit: cover;
    max-width: 100%;
  }
</style>
  