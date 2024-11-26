## Conceptos

¡Claro! Vamos a profundizar en conceptos clave de Vue.js, utilizando ejemplos del código que compartiste para explicar **data**, **props**, **directivas como `:disabled`**, el ciclo de vida (`mounted()`), y la lógica general para estructurar un proyecto así.

---

### **1. `data()` en Vue**
#### ¿Qué es?
El método `data()` devuelve un objeto que define las variables reactivas del componente. Estas variables son observadas por Vue, lo que significa que cualquier cambio en ellas actualiza automáticamente la interfaz.

#### Ejemplo del código:
En **App.vue**:
```javascript
data() {
  return {
    isPlaying: false, // Si el juego está en curso
    delay: null,      // Tiempo aleatorio para mostrar el bloque
    score: null,      // Tiempo de reacción del usuario
    showResults: false // Si los resultados deben mostrarse
  };
}
```

#### Explicación:
- **`isPlaying`:** Controla si el componente del bloque debe mostrarse. Reactivo: si cambia a `true`, el bloque aparece.
- **`score`:** Almacena el tiempo de reacción calculado. Se actualiza después de cada partida.
- **Reactividad:** Cuando `isPlaying` o `showResults` cambian, Vue actualiza automáticamente qué componentes (`Block`, `Results`) se muestran.

#### Cómo usar `data()` en un nuevo proyecto:
Define en `data()` todas las variables que quieres gestionar o mostrar en tu componente. Ejemplo:
```javascript
data() {
  return {
    message: 'Hola Mundo', 
    count: 0
  };
}
```
```html
<p>{{ message }}</p>
<button @click="count++">Clicks: {{ count }}</button>
```

---

### **2. `props` en Vue**
#### ¿Qué son?
Son datos que el componente padre envía al hijo. Los props se definen en el hijo como propiedades y se pasan desde el padre al usarse el componente.

#### Ejemplo del código:
En **Block.vue**:
```javascript
props: ['delay'] // El tiempo que pasa antes de que aparezca el bloque
```
En **App.vue**:
```html
<Block v-if="isPlaying" :delay="delay" @end="endGame" />
```

#### Explicación:
1. El componente padre (`App.vue`) define y calcula `delay` en el método `start()` y lo pasa a `Block`:
   ```javascript
   this.delay = 2000 + Math.random() * 5000;
   ```
2. El componente hijo (`Block.vue`) usa esta prop para retrasar la aparición del bloque:
   ```javascript
   mounted() {
     setTimeout(() => {
       this.showBlock = true;
     }, this.delay);
   }
   ```

#### Cómo usar `props` en un nuevo proyecto:
En el hijo:
```javascript
props: ['message'];
```
En el padre:
```html
<ChildComponent :message="'Hola desde el padre'" />
```
El componente hijo recibe la prop `message` con valor `'Hola desde el padre'`.

---

### **3. Directivas dinámicas: `:disabled`**
#### ¿Qué es?
El prefijo `:` indica un atributo dinámico en Vue, permitiendo cambiar su valor basado en una variable.

#### Ejemplo del código:
```html
<button @click="start" :disabled="isPlaying">Play</button>
```

#### Explicación:
- `:disabled="isPlaying"` desactiva el botón cuando `isPlaying` es `true`. Esto evita que el usuario inicie el juego mientras uno ya está en curso.

#### Cómo usar `:disabled` en un nuevo proyecto:
```html
<button :disabled="isDisabled">Click me</button>
```
Si `isDisabled` en `data()` es `true`, el botón estará desactivado.

---

### **4. Ciclo de vida: `mounted()`**
#### ¿Qué es?
`mounted()` es un **hook** del ciclo de vida que se ejecuta después de que el componente ha sido agregado al DOM.

#### Ejemplo del código:
En **Block.vue**:
```javascript
mounted() {
  setTimeout(() => {
    this.showBlock = true; // Muestra el bloque después del retraso
    this.startTimer();     // Inicia el cronómetro
  }, this.delay);
}
```

#### Explicación:
- Este hook se usa para iniciar acciones que dependen de que el componente esté en el DOM, como configurar temporizadores o cargar datos.

#### Cómo usar `mounted()` en un nuevo proyecto:
```javascript
mounted() {
  console.log('Componente montado en el DOM');
  // Puedes iniciar una API aquí, por ejemplo.
}
```

---

### **5. Lógica para crear un proyecto así en Vue**
#### Paso a paso:
1. **Divide tu proyecto en componentes:**
   - Identifica partes reutilizables (bloques, resultados, botones).
   - Por ejemplo:
     - `Block`: Maneja el cronómetro y los clics.
     - `Results`: Muestra el puntaje.

2. **Usa `props` para comunicación descendente:**
   - El padre envía datos como `delay` o `score` a los hijos.

3. **Usa eventos para comunicación ascendente:**
   - Los hijos notifican al padre de eventos como clics usando `$emit`.

4. **Usa `data()` para variables reactivas:**
   - Almacena estados como `isPlaying` o `score`.

5. **Diseña el flujo del juego:**
   - **Inicio:** Inicia el cronómetro (`start()` en el padre).
   - **Cronómetro:** Mide el tiempo (`startTimer()` en el hijo).
   - **Resultados:** Muestra el puntaje (`endGame()` en el padre).

6. **Aprovecha el ciclo de vida (`mounted`):**
   - Usa `mounted()` para configurar temporizadores o inicializar datos.

---

### **Ejemplo Simple: Contador Reactivo**
Para practicar Vue:
```vue
<template>
  <div>
    <h1>Contador: {{ count }}</h1>
    <button @click="incrementar">Incrementar</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    incrementar() {
      this.count++;
    },
  },
};
</script>
```

## Proyecto

¡Claro! Vamos a analizar y desglosar este pequeño juego hecho en Vue.js para que puedas entender cómo se construye y aprender los conceptos básicos de este framework. El proyecto utiliza **componentes**, **props**, **eventos**, y **estilos dinámicos**.

---

### **Estructura del Proyecto**
El proyecto consta de tres archivos principales:
1. **App.vue**: Es el componente raíz que gestiona la lógica general del juego.
2. **Block.vue**: Es un componente que aparece después de un retraso y mide el tiempo de reacción del usuario al hacer clic.
3. **Results.vue**: Es un componente que muestra el resultado del juego y clasifica al usuario según su tiempo de reacción.

### **Paso a Paso**

---

#### 1. **App.vue**
Este archivo controla el flujo principal del juego: comenzar, medir el tiempo de reacción, y mostrar los resultados.

##### **`template`**
- Contiene un botón para iniciar el juego (`Play`).
- Usa directivas de Vue como:
  - `v-if`: Renderiza dinámicamente los componentes `Block` y `Results` según el estado del juego.
  - `@click`: Escucha eventos para ejecutar métodos (como `start`).

##### **`script`**
- **`data()`**: Define los estados principales:
  - `isPlaying`: Indica si el juego está en curso.
  - `delay`: Tiempo de espera antes de mostrar el bloque.
  - `score`: Guarda el tiempo de reacción del usuario.
  - `showResults`: Indica si se deben mostrar los resultados.
- **`methods`**:
  - **`start()`**:
    - Calcula un retraso aleatorio entre 2 y 7 segundos.
    - Activa el estado `isPlaying` para mostrar el bloque.
    - Oculta los resultados anteriores.
  - **`endGame(reactionTime)`**:
    - Recibe el tiempo de reacción desde el componente `Block`.
    - Guarda el tiempo como `score`.
    - Finaliza el juego y muestra los resultados.

##### **`style`**
- Estiliza el botón de inicio con estados como `:disabled` para deshabilitarlo durante el juego.

---

#### 2. **Block.vue**
Este componente representa el bloque que el usuario debe hacer clic para detener el cronómetro.

##### **`template`**
- Renderiza un bloque con el texto "click me" cuando se cumple el retraso (`v-if="showBlock"`).
- Usa la directiva `@click` para detener el cronómetro.

##### **`script`**
- **Props**:
  - `delay`: Recibe el tiempo de espera calculado en el componente padre (`App.vue`).
- **`data()`**:
  - `showBlock`: Controla si el bloque debe mostrarse.
  - `timer`: Maneja el temporizador que mide el tiempo de reacción.
  - `reactionTime`: Guarda el tiempo transcurrido.
- **Ciclo de Vida: `mounted`**:
  - Ejecuta un `setTimeout` que:
    - Muestra el bloque después del retraso recibido.
    - Inicia un cronómetro con `setInterval`.
- **Métodos**:
  - **`startTimer()`**:
    - Incrementa `reactionTime` cada 10 ms.
  - **`stopTimer()`**:
    - Detiene el cronómetro con `clearInterval`.
    - Emite un evento `end` hacia el componente padre, enviando el tiempo de reacción.

##### **`style`**
- Diseña el bloque con estilos visuales como color de fondo, borde redondeado, y centrado.

---

#### 3. **Results.vue**
Este componente muestra el tiempo de reacción del usuario y su rango basado en su velocidad.

##### **`template`**
- Usa `{{ score }}` para mostrar el tiempo de reacción.
- Muestra un mensaje con el rango calculado en función del tiempo.

##### **`script`**
- **Props**:
  - `score`: Recibe el tiempo de reacción del componente padre (`App.vue`).
- **`data()`**:
  - `rank`: Guarda el rango del usuario según su desempeño.
- **Ciclo de Vida: `mounted`**:
  - Calcula el rango al montarse el componente:
    - Menos de 250 ms: "Ninja Fingers".
    - Menos de 400 ms: "Rapid Reflexes".
    - Más de 400 ms: "Snail pace...".

##### **`style`**
- Estiliza el rango con un color y tamaño específico.

---

### **Cómo Funciona Todo Junto**
1. El usuario hace clic en el botón `Play` en **App.vue**:
   - Calcula un retraso aleatorio y activa el componente **Block.vue**.
2. Después del retraso, el bloque aparece:
   - Comienza a medir el tiempo de reacción.
3. El usuario hace clic en el bloque:
   - Detiene el cronómetro y envía el tiempo al componente padre (**App.vue**).
4. **App.vue**:
   - Guarda el tiempo como `score`.
   - Activa el componente **Results.vue** para mostrar los resultados.
5. **Results.vue**:
   - Calcula el rango según el tiempo y lo muestra al usuario.

---

### **Conceptos Clave de Vue.js que Aprendes**
1. **Componentes**:
   - División del juego en partes funcionales reutilizables (App, Block, Results).
2. **Props**:
   - Comunicación del padre al hijo, como el retraso y el puntaje.
3. **Eventos**:
   - Comunicación del hijo al padre usando `$emit`.
4. **Ciclo de Vida**:
   - Uso de hooks como `mounted` para iniciar procesos dependientes del DOM.
5. **Directivas**:
   - `v-if`, `@click`, y atributos dinámicos (`:disabled`).
6. **Reactividad**:
   - Cómo los cambios en `data()` actualizan la interfaz en tiempo real.

