<script setup>
    import Datatable from '@/components/Material/Datatable.vue'
</script>
<template>
    <!-- Table -->
    <div class="content d-flex flex-column flex-column-fluid" id="kt_content" v-if="!toogle">
        <div class="container-fluid" id="kt_content_container">
            <div class="row g-5 g-xl-8">
                <div class="col-xl-12">

                    <div class="card card-xl-stretch mb-xl-8">
                        <div class="card-header border-0 pt-5">
                            <h3 class="card-title align-items-start flex-column">
                                <span class="card-label fw-bold fs-3 mb-1">Event</span>
                                <span class="text-muted fw-semibold fs-7">Event &raquo;</span>
                            </h3>
                            <div class="card-toolbar">

                                <template v-if="accessStore.create == 1">
                                    <v-btn class="success" variant="tonal" color="success" 
                                        @click="() => {
                                            breadcrump = 'Create'
                                            onSubmit = create
                                            onSubmitColor = 'green'
                                            textSubmit = 'Submit'
                                            fileData = null
    
                                            toogleForm()
                                        }" 
                                        v-on:click="event = {
                                            event_date_actual: null,
                                        }"
                                    >
                                        <i class="bi bi-plus-circle"></i>
                                        Create
                                    </v-btn>
                                </template>

                                <v-select
                                    label="Status"
                                    variant="outlined"
                                    clearable
                                    multiple
                                    chips
                                    :items="['Pending', 'Approved','Rejected']"
                                    v-model="eventStatus"
                                    @blur="() => {
                                        const pagination = this.$refs.table_event.$el.parentElement.querySelector('.v-pagination__list');
                                        pagination.click()
                                        
                                    }"
                                >
                                </v-select>
                            </div>
                        </div>
                        <div class="card-body py-3">

                            <Datatable
                                title = 'event'
                                modules = 'event'
                                :query="'&query='+eventStatus"
                                :headers = headers
                                ref="table_event"
                            >
                                <template #default="{data}">
                                    <div class="row">

                                        <template v-if="accessStore.delete == 1">
                                            <v-btn class="" size="small" icon="mdi-vuetify" fab dark small variant="tonal" color="danger" v-on:click="destroy(data.raw)">
                                                <i class="bi bi-trash-fill"></i>
                                            </v-btn>
                                        </template>

                                        <template v-if="accessStore.update == 1">
                                            <v-btn class="" size="small" icon="mdi-vuetify" fab dark small variant="tonal" color="warning" 
                                                @click="() => {
                                                    breadcrump = 'Update'
                                                    onSubmit = update
                                                    onSubmitColor = 'secondary'
                                                    textSubmit = 'Update'
        
                                                    toogleForm()
                                                }" 
                                                v-on:click="show(data.raw)"
                                            >
                                                <i class="bi bi-pencil-square"></i>
                                            </v-btn>
                                        </template>

                                        <template v-if="accessStore.read == 1">
                                            <v-btn 
                                                variant="tonal"
                                                :color="getColorStatus(data.raw.event_status)"
                                                :data-bs-toggle="data.raw.event_status == `Pending`? `modal` : ''"
                                                :data-bs-target="data.raw.event_status == `Pending`? `#ApprovalModal` : ''"
                                            >
                                                <i 
                                                    class="bi bi-check-all"
                                                    width="100"
                                                    height="100"
                                                ></i>
                                                {{ data.raw.event_status }}
                                            </v-btn>
                                        </template>


                                    </div>
                                </template>

                            </Datatable>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Form -->
    <div class="content d-flex flex-column flex-column-fluid" id="kt_content" v-if="toogle">
        <div class="container-fluid" id="kt_content_container">
            <div class="row g-5 g-xl-8">
                <div class="col-xl-8">

                    <div class="card card-xl-stretch mb-xl-8">
                        <div class="card-header border-0 pt-5">
                            <div class="card-toolbar">
                                <v-btn class="light " variant="tonal" color="light"  @click="toogleForm">
                                    <i class="bi bi-arrow-bar-left" style="color: black;"></i>
                                </v-btn>
                                <h3 class="card-title align-items-start flex-column">
                                    <span class="card-label fw-bold fs-3 mb-1">event</span>
                                    <span class="text-muted fw-semibold fs-7">event &raquo; {{ breadcrump }}</span>
                                </h3>
                            </div>
                        </div>
                        <div class="card-body py-3">

                            <Form
                                formId="eventForm"
                                @submit.prevent="onSubmit"
                            >

                                <div class="row">
                                    <Hidden 
                                        id="event_id"
                                        v-model="event.event_id"
                                        :value="event.event_id"
                                    />
                                    <div class="col-md-6">
                                        <Label class="mt-3" title="Event Poster" />
                                        <div class="d-flex align-items-center">
                                            <Text
                                                id="event_img"
                                                class="mt-3"
                                                type="file"
                                                accept=".jpg, .jpeg, .png, .pdf"
                                                placeholder="Event Poster"
                                                v-model="event.event_img"
                                                :value="event.event_img"
                                                @change="handleFileUpload"
                                            />
                                            <template v-if="isLoading">
                                                <v-progress-circular
                                                    justify='end' 
                                                    indeterminate 
                                                    :width="8"
                                                    :size="40"
                                                    color="green"
                                                    style="margin-top:4%;margin-left: 9px;"
                                                >
                                                </v-progress-circular>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <Label class="mt-3" title="Event Date" />
                                        <VueDatePicker 
                                            style="padding-top: 4%;"
                                            v-model="event.event_date_actual"
                                            name="event_date_actual"
                                            id="event_date_actual"
                                            format="Y-MM-dd"
                                            :min-date="minDate"
                                            multi-calendars
                                            required
                                        >
                                        </VueDatePicker>
                                    </div>
                                    <div class="col-md-12">
                                        <Label class="mt-3" title="Event Name" />
                                        <Text
                                            id="event_name"
                                            class="mt-3"
                                            placeholder="Event Name"
                                            v-model="event.event_name"
                                            :value="event.event_name"
                                            min="2023-06-30"
                                            required
                                        />
                                    </div>

                                    <div class="col-md-12">
                                        <Label class="mt-3" title="Description" />
                                        <textarea 
                                            name="event_description" 
                                            id="event_description" 
                                            cols="30" 
                                            rows="10"
                                            class="form-control"
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
                                        :color="onSubmitColor"
                                        :disabled="isLoading"
                                    >
                                        <template v-if="isLoading">
                                            <v-progress-circular
                                                justify='end' 
                                                indeterminate 
                                                :width="4"
                                                :size="18"
                                                :color="onSubmitColor"
                                                style="margin-right:9px;"
                                            >
                                            </v-progress-circular>
                                        </template>
                                        {{ textSubmit }}
                                        <template v-if="!isLoading">
                                            <i class="bi bi-arrow-bar-right"></i>
                                        </template>
                                    </v-btn>
                                </v-row>
                            </Form>

                        </div>
                    </div>

                </div>

                <div class="col-xl-4">
                    <div class="card card-xl-stretch mb-xl-8">
                        <div class="card-header border-0 pt-5">
                            <div class="card-toolbar"></div>
                        </div>
                        <div class="card-body py-3">
                            <img v-if="isImage" :src="fileData" alt="Uploaded Image" style="max-height: 600px; max-width: 100%;">
                            <embed v-else-if="isPDF" :src="fileData" type="application/pdf" style="max-height: 600px; height: 500px; max-width: 100%;">
                            <p v-else>No file selected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Form Approval -->
    <Modal 
        title="Form Approval Event" 
        id="ApprovalModal"
        :backdrop=true
    >

    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                isLoading: false,
                accessStore: this.$store.modules.Access.getters.getData,
                headers: [
                    { key: "event_name", title: "Event Name" , sortable: true},
                    { key: "event_date_actual", title: "Event Date" , sortable: true},
                    { key: "event_created_by.username", title: "Created By" , sortable: true},
                    { key: "event_updated_by.username", title: "Updated By" , sortable: true},
                    { key: "actions", title: "Actions", sortable: true },
                ],
                toogle: false,
                event: null,
                events: [],
                eventSelect : [],

                breadcrump: '',
                onSubmit: null,
                onSubmitColor: '',
                textSubmit:'',
                fileData: null,
                minDate: new Date(),
                eventStatus: null,
            };
        },
        computed: {
            isImage() {
                return this.fileData && this.getFileType(this.fileData) === 'image' || this.getFileExtension(this.fileData) == 'image';
            },
            isPDF() {
                return this.fileData && this.getFileType(this.fileData) === 'pdf' || this.getFileExtension(this.fileData) == 'pdf';
            }
        },
        mounted() {
            this.index()
        },
        methods: {
            async create(){
                try {
                    this.toogleLoading()
                    let form = this.$helper.onSubmit('eventForm')
                    let appendForm = {
                        event_status : 'Pending',
                        event_created_by : this.$dataAuth.user_id
                    }

                    let data = {
                        ...form,
                        ...appendForm
                    }

                    await this.$api.post('/event', data ,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }).then((response) => {
                        this.toogleLoading()
                        this.toogleForm()
                        this.$swal.fire(response.data.meta.message)
                    })
                    
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
            async show(data){
                this.event = {
                    event_id         : data.event_id,
                    event_name       : data.event_name,
                    event_description: data.event_description,
                    event_date_actual: data.event_date_actual,
                }

                this.fileData = data.event_img;
            },
            async update() {
                try {
                    this.toogleLoading();
                    const form = this.$helper.onSubmit('eventForm');
                    const appendForm = {
                        event_status: 'Pending',
                        event_updated_by: this.$dataAuth.user_id
                    };
                    const data = {
                        ...form,
                        ...appendForm
                    };

                    const dataImg = {
                        event_img: data.event_img
                    };

                    delete data.event_img;

                    const updateEvent = async () => {
                        await this.$api.put('/event/' + data.event_id, data, {
                            headers: {
                            "Content-Type": "application/json"
                            }
                        }).then((response) => {
                            this.toogleForm();
                            this.toogleLoading();
                            this.$swal.fire(response.data.meta.message);
                        });

                    };

                    if (dataImg.event_img.name != '' && dataImg.event_img.size > 0) {
                        await this.$api.post('/updateimg/' + data.event_id, dataImg, {
                            headers: {
                            "Content-Type": "multipart/form-data"
                            }
                        }).then(async (res) => {
                            await updateEvent()
                        });
                    } else {
                        await updateEvent();
                    }
                } catch (error) {
                    this.toogleLoading();
                    const err = await error;
                    const message = `
                    Error \n
                    ${err.message} \n
                    `;
                    this.$swal.fire(message);
                }
            },
            async destroy(data){
                try {
                    this.$swal.fire({
                        title: 'Delete Data',
                        text: "Are you sure ?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes !'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await this.$api.delete('/event/'+data.event_id,{
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })
                            this.$swal.fire(response.data.meta.message)
                        }
                    })
                } catch (error) {
                    const err = await error
                    let message = `
                        Error \n
                        ${err.message} \n
                    `
                    this.$swal.fire(message)
                }
            },
            async index(){
                const responseevent = await this.$api.get('/event?limit=0', {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                this.events = responseevent.data.data.data;

                this.selectevent()
            },
            async selectevent(){
                this.eventSelect = this.events.map((v,i) => {
                    let result = {
                        text: v.event_name,
                        value: v.event_id
                    };

                    return result;
                })
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
            async handleFileUpload(event) {
                this.toogleLoading()
                try {
                    const file = event.target.files[0];
    
                    if (file) {
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            this.fileData = event.target.result;
                        };
    
                        reader.readAsDataURL(file);
                    } else {
                        this.fileData = null;
                    }
                    await this.toogleLoading()
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
            getColorStatus(status){
                if(status == 'Pending'){
                    return 'warning'
                }else if(status == 'Approved'){
                    return 'success'
                }else{
                    return 'danger'
                }
            },
        },
    }
</script>