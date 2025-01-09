# Fetching Data

A menudo los datos están guardados en otro lugar, por ejemplo, una base de datos. Y normalmente tenemos que sacar esos datos de una API.

Ahora vamos a ver cómo sacar datos externos en un componente vue.
Vamos a usar esta vez una librería que simula una API para no mezclaar muchos conceptos juntos. Se llama JSON Server y le podemos hacer peticones.
Nos permite usar un archivo json como una base de datos.

Al utilizar JSON Server, puedes interactuar con los datos de tu archivo JSON a través de endpoints API, facilitando operaciones como crear, leer, actualizar y eliminar registros. 

(Un endpoint es una URL específica que permite a una aplicación acceder a datos o servicios en otra aplicación a través de una API. Es decir, es un punto de acceso dentro de una app que nos permiite interactruar con dicha app. Es una puerta de entrada.)

Para empezar lo primero que bamos a hacer es crear una carpeta llamada data, y dentro de esta, un archivo llamado `db.json`
El contenido es similar a un objeto de javascript de claves y valores, pero este tene que estar entre comillas dobles.

Otra cosa es que si tenemos dentro strings, estas deben estar también entre comillas dobles.

<!--db.json-->
```js
{
    "jobs": [
        { title: "UX Designer", id: 1, details: "lorem" },
        { title: "Web Developer", id: 2, details: "lorem" },
        { title: "VUE Developer", id: 3, details: "lorem" },
    ]
}
```

Lo siguiente que tenemos que hacer es isntalar el paquete de server json localmente. Para ello escribimos en la terminal `npm install json-server`. Este paquete se encontrará ahora en las dependencias de la app.

Para supervisar o watch este fichero, basta con escribir en la termnal:

`json-server --watch data/db.json`

Va a utilizar un puerto distinto y el endpoint es jobs.

`http://localhost:3000/jobs`

Si abrimos esto en el navegador, nos va a mostrar el json con los datos.

### Fetching Data

Lo primero que vamos a hacer es borrar los datos que teníamos en el array de Jobs.vue ya que queremos que estos provengan del Json, y poder recorrerlos y sacar sus datos.

```html
<template>
    <h1>Jobs</h1>
    <div v-for="job in jobs" :key="job.id">
        <router-link :to="{ name: 'JobDetails'}, params: { id: job.id }">
            <h2>{{ job.title }}</h2>
        </router-link>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                jobs: []
                }
            },
            //mounted (recordad los lifecycle hooks, este se dispara cuando el componente se monta en el DOM) es un luhar muy habitual para sacar los datos de la api
            mounted() {
                //tenemos que pasarle un endpoint el método fetch, y le pasamos la ruta que nos da el watch con el endpoint
                //esto es asíncrono, y devuelve una promesa
                fetch('http://localhost:3000/jobs')
                //vamos a un método then que dispara una función callback
                //esto devolverá un objeto con datos json incluidos
                //necesitamos agarrar la respuesta y usar el método JSON en esta
                //esto también es asíncrono y devuelve una promesa
                .then(resp => response.json())
                //nos da acceso a un distinto argumento, y esto es los datos
                //lo que queremos hacer es rellenar el array de jobs con los datos, por lo que escribimos que el array de jobs es igual a los datos que obtenemos, que es un array de objetos javascript
                .then(data => this.jobs = data)
                //en caso de que haya un error, queremos que nos muestre un mensaje con el error
                .catch(err => console.log(err.message))

            }
        }
</script>
```

Y todo deberá funcionar igual que cuando teníamos los datos en el componente.

Ahora también queremos sacar los datos en JobDetals.vue,  ya que actualmente solo estábamos sacando el id.
As´que tenemos que hacer otra solcitud fetch en el componente JobDetails.vue para sacar los datos del job que queremos ver.

Vamos a copiar y pegar la solciitud que hcimos antes dentro del script, con la diferencia de que ahora no queremos todos los trabajos, sino un único job. Y como tenemos la id ya que la pasamos como una prop, podemos hacerlo:

```html
<template>
    <h1>Job Detail Page</h1>
    <p>The job id is {{  $route.params.id }}</p>
</template>

<script>
    
    export default {
        props: ['id'],
          mounted() {
                fetch('http://localhost:3000/jobs/' + this.id)
                .then(resp => response.json())
                .then(data => this.jobs = data)
                .catch(err => console.log(err.message))
                }
    }
</script>
```

Ahora queremos guardar esos datos en los datos del componente.
Así que vamos a crear esa función. Y dentro de esta, una propiedad llamada job que en princpio será null. Pero una vez tengamos los datos obtendos por el fetch, se cambiará por los datos.
Y en la plantilla podemos sacar los datos directamente:

```js
<template>
    <h1>{{ job.title }}</h1>
    <p>The job id is {{  id }}</p>`
    <p>{{  job.details }}</p>

</template>

<script>
    export default {
        props: ['id'],
        data() {
            job: null
          mounted() {
                fetch('http://localhost:3000/jobs/' + this.id)
                .then(resp => response.json())
                .then(data => this.job = data)
                .catch(err => console.log(err.message))
                }
            }
    }
</script>
```

Pero esto nos dará un error ya que tarda un segundo en cargar los datos del fetch, y entonces, jobs será null, y no puede sacar el título de null, por ejemplo. Así que tenemos que hacer algo para que solo se muestre esta información una vez hayamos hecho el fetch.

### Conditionally Showing Data

Vamos a utilizar v-if para solucionar este problema.
Vamos a igualar if a job, que para empezar, va a ser false ya que es igual a null. Pero luego tengamos los datos del fetch, va a cambiar a true, y mostrará todo el contenido.
Si quermos podemos usar también un v-else que hará que muestre un mensaje miientras se cargan los datos.

```js
<template>
    <div v-if="job">
        <h1>{{ job.title }}</h1>
        <p>The job id is {{  id }}</p>`
        <p>{{  job.details }}</p>
    <div>
    <div v-else>
        <p>Loading...</p>
    </div>
        
</template>
```

Vamos a hacer algo similar para Jobs.vue, que no es necesario ya que no va a dar error, pero si queremos usar un mensaje mientras se carga, podemos hacerlo.
En este caso escribimos en el if jobs.length, ya que al comienzo es un array vacío, que no tiene longitud.

```html
<template>
    <h1>Jobs</h1>
    <div v-if="jobs.length">
        <div v-for="job in jobs" :key="job.id">
            <router-link :to="{ name: 'JobDetails'}, params: { id: job.id }">
                <h2>{{ job.title }}</h2>
            </router-link>
        </div>
    </div>
    <div v-else>
        <p>Loading Jobs...</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                jobs: []
                }
            },
            mounted() {
                fetch('http://localhost:3000/jobs')
                .then(resp => response.json())
                .then(data => this.jobs = data)
                .catch(err => console.log(err.message))

            }
        }
</script>
```