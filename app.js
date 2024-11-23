console.log("Hello vue")
//create a vue app
const app = Vue.createApp({
    //data, functions, template
    //template: '<h1>im the template</h1>'
    data(){
        return{
            url: 'https://vuejs.org/guide/quick-start',
            showBooks: true,
            books: [
                {title: 'name of the wind', author: 'patrick rothfuss', img: 'assets/1.webp', isFav: true},
                {title: 'the way of kings', author: 'brandon sanderson', img: 'assets/2.jpg', isFav: false},
                {title: 'the final empire', author: 'brandon sanderson', img: 'assets/3.jpg', isFav: true},
            ]
        }
    },
    methods: {
        toggleShowBooks(){
            this.showBooks = !this.showBooks
        },
        //pasarle argumentos propios
        handleEvent(e, data){
            console.log(e, e.type);
            if (data) {
                console.log(data)
            }
            
        },
        handleMousemove(e){
            this.x = e.offsetX
            this.y = e.offsetY
        },
//CHALLENGE - añadir a favoritos
// poner un evento click para cada etiqueta li de libros
// si el libro es favorito, cambia la propiedad isFav de ese libro
        toggleFav(book){
            book.isFav = !book.isFav
        }
        
    },
    //COMPUTER PROPERTIES-->
    //UNA MANERA DE DEFINIR UNA PROPIEDAD DE DATO EN UN COMPONENTE QUE DEPENDE DE OTRO DATO DE ESE COMPONENTE
    computed: {
        filteredBooks(){
            //el filter hace que si se mantenga en el array si es true, si no, lo saca
            return this.books.filter((book) => book.isFav)
        }
    }

})

//decirle que queremos que controle cierta parte de la app, con esto le dices dónde cargar la app desde el dom, al elemento con id app. Solo controla lo que hay dentro de ese elemento.
//tenemod que pasarle un objeto al método vue app 
app.mount('#app')

