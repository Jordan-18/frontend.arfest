<template>
    <v-spacer></v-spacer>   

    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        @input="index"
    ></v-text-field>

    <v-data-table-server
        :headers="headers"
        :items="items"
        :search="search"
        :items-per-page="itemsPerPage"
        :loading="isLoading"
        @update:options="loadItems"
    >

        <template v-slot:bottom>
            <div class="text-center pt-2">
                <v-pagination
                    v-model="currentPage"
                    :length="pageSetting.pageCount"
                    @update:model-value="currentPage = parseInt($event, 10)"
                    @click="index"
                ></v-pagination>
            </div>


            <v-text-field
                :model-value="itemsPerPage"
                class="pa-2"
                label="Items per page"
                type="number"
                min="-1"
                max="15"
                hide-details
                @update:model-value="itemsPerPage = parseInt($event, 10)"
                @input="index"
            ></v-text-field>
        </template>

        <template v-slot:item.actions="{ item }">
            <slot :data="item"></slot>

        </template>

    </v-data-table-server>
</template>

<script>
  export default {
    props:{
        title: String,
        headers: Object,
        modules: String,
        query: String,
    },
    data () {
      return {
        search: '',
        items: [],
        pageSetting: {
          pageCount: 0,
        },
        currentPage: 1,
        itemsPerPage: 10,
        isLoading: true,
        options: {
            sortBy: [], // Informasi sorting (kolom dan arah) akan disimpan di sini
        },
      }
    },
    computed: {
        sortBy() {
            if (this.options.sortBy.length === 0) {
                return '';
            }
            const sort = this.options.sortBy[0];
            return `&sortBy=${sort.value}&sortDesc=${sort.desc ? 'true' : 'false'}`;
        },
    },
    mounted() {
        this.index()
    },
    methods: {
        async index(){
            this.isLoading = true

            try {                
                var url = '/'+this.$props.modules+'?index='
                if(this.search != ''){
                    url = url+'&search='+this.search
                }

                if(this.currentPage != 1){
                    url = url+'&page='+this.currentPage
                }
                
                if(this.itemsPerPage != 10 && this.itemsPerPage > 0){
                    url = url+'&limit='+this.itemsPerPage
                }
                if(this.$props.query != "" && this.$props.query != undefined && this.$props.query != '&query=null'){
                    url = url+this.$props.query
                }

                url = `${url}${this.sortBy}`;
                    
                const response = await this.$api.get(url,{
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
    
                this.items = response.data.data.data
                this.pageSetting.pageCount = response.data.data.last_page

                if(this.search != ''){
                    if(this.pageSetting.pageCount > 1){
                        this.currentPage = this.currentPage
                    }
                    else{
                        this.currentPage = 1
                    }
                }

                this.isLoading = false

            } catch (error) {
                const err = await error
                console.log(err);
                this.isLoading = false
                let message = `
                    Error \n
                    ${err.message} \n
                `
                this.$swal.fire(message)
            }

        },
    },
  }
</script>