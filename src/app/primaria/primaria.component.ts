import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-primaria',
  templateUrl: './primaria.component.html',
  styleUrls: ['./primaria.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class PrimariaComponent implements OnInit {
  @ViewChild('rosco', { static: true }) roscoContainer!: ElementRef;
  @ViewChild('question', { static: true }) questionContainer!: ElementRef;
  @ViewChild('empieza', { static: true }) empieza!: ElementRef;
  @ViewChild('temporizador', { static: true }) temporizador!: ElementRef;

  letras: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  preguntas: { [key: string]: string } = {};
  respuestas: { [key: string]: string } = {};
  respuestasIncorrectas: { [key: string]: string } = {};
  letraActual: string = "";
  letrasRespondidas: Set<string> = new Set();
  correctAnswers: number = 0;
  isModalOpen: boolean = false;
  currentOptions: string[] = [];  // Definir currentOptions aquí
  mostrarBotones: boolean = false;
  tiempoRestante: number = 300; // 5 minutes in seconds
  intervalId: any;

  constructor(private toastController: ToastController, private cdr: ChangeDetectorRef) {
    this.preguntas = {
      "A": "Lo que se consideraban San Ignacio y sus compañeros al servir a Cristo.",
      "B": "Punto de partida para su viaje de estudios y maduración espiritual.",
      "C": "Orden religiosa fundada por San Ignacio de Loyola.",
      "D": "Acción clave en la espiritualidad ignaciana para tomar decisiones según la voluntad de Dios.",
      "E": "Nombre de la obra espiritual escrita por San Ignacio para la meditación y oración.",
      "F": "Virtud teologal fundamental en la vida y enseñanzas de San Ignacio.",
      "G": "Don divino que San Ignacio veía como esencial en la relación con Dios.",
      "H": "Lo que sufrió San Ignacio en la batalla de Pamplona, iniciando su proceso de conversión.",
      "I": "Nombre del fundador de la Compañía de Jesús.",
      "J": "Nombre de aquel a quien San Ignacio dedicó su vida y su orden religiosa.",
      "K": "Ciudad de Japón donde los jesuitas, siguiendo la misión iniciada por San Ignacio, evangelizaron en el siglo XVI.",
      "L": "Lugar de nacimiento de San Ignacio en España.",
      "M": "Colina en París donde Ignacio y sus compañeros hicieron sus primeros votos.",
      "N": "Apellido de Jerónimo, uno de los grandes difusores de la espiritualidad ignaciana.",
      "O": "Práctica fundamental en la vida de San Ignacio y base de sus Ejercicios Espirituales.",
      "P": "Ciudad donde Ignacio fue herido en batalla en 1521.",
      "Q": "Apellido de Antonio, jesuita misionero que difundió la espiritualidad ignaciana en América.",
      "R": "Ciudad donde San Ignacio estableció la sede de la Compañía de Jesús.",
      "S": "Título otorgado a San Ignacio y a otros compañeros jesuitas tras su canonización.",
      "T": "Lugar al que Ignacio quiso peregrinar tras su conversión, pero no pudo quedarse.",
      "U": "Lugar donde Ignacio estudió en París antes de fundar la Compañía de Jesús.",
      "V": "Promesas que Ignacio y sus compañeros hicieron en Montmartre en 1534.",
      "W": "Estado de EE.UU. donde los jesuitas llevaron su misión en el siglo XVII.",
      "X": "Palabra en latín que significa paz, un valor central en la vida cristiana e ignaciana.",
      "Y": "Apellido de un importante jesuita misionero en América.",
      "Z": "Ciudad española donde Ignacio pasó en su camino antes de sus estudios en París."
    };

    this.respuestas = {
      "A": "Apóstol",
      "B": "Barcelona",
      "C": "Compañía",
      "D": "Discernir",
      "E": "Ejercicios",
      "F": "Fe",
      "G": "Gracia",
      "H": "Herida",
      "I": "Ignacio",
      "J": "Jesús",
      "K": "Kioto",
      "L": "Loyola",
      "M": "Montmartre",
      "N": "Nadal",
      "O": "Oración",
      "P": "Pamplona",
      "Q": "Quirós",
      "R": "Roma",
      "S": "Santos",
      "T": "Tierra Santa",
      "U": "Universidad",
      "V": "Votos",
      "W": "Wisconsin",
      "X": "Pax",
      "Y": "Oyarzábal",
      "Z": "Zaragoza"
    };


    this.respuestasIncorrectas = {
      "A": "Anacoreta",
      "B": "Beaterio",
      "C": "Clero",
      "D": "Dogma",
      "E": "Encíclica",
      "F": "Fraternidad",
      "G": "Gloria",
      "H": "Humildad",
      "I": "Isidoro",
      "J": "Jeremías",
      "K": "Kilimanjaro",
      "L": "Letrán",
      "M": "Montecasino",
      "N": "Nogales",
      "O": "Ofertorio",
      "P": "París",
      "Q": "Quevedo",
      "R": "Rávena",
      "S": "Sínodo",
      "T": "Tabernáculo",
      "U": "Utopía",
      "V": "Virtudes",
      "W": "Washington",
      "X": "Examen",
      "Y": "Yuste",
      "Z": "Zamora"
    }
  }

  ngOnInit() {
    this.generarRosco();
    this.iniciarTemporizador();
    this.mostrarPregunta(this.letras[0]);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  iniciarTemporizador() {
    this.intervalId = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
        this.actualizarTemporizador();
      } else {
        clearInterval(this.intervalId);
        this.marcarNoRespondidasComoIncorrectas();
        this.mostrarModalPuntuacion();
      }
    }, 1000);
  }

  mostrarModalPuntuacion() {
    this.isModalOpen = true;
    const puntuacion = this.correctAnswers;
    const total = this.letras.length;
    this.toastController.create({
      message: `Puntuación final: ${puntuacion} de ${total}`,
      duration: 5000,
      color: 'primary',
      position: 'bottom',
    }).then(toast => toast.present());
  }

  actualizarTemporizador() {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    this.temporizador.nativeElement.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  marcarNoRespondidasComoIncorrectas() {
    this.letras.forEach(letra => {
      if (!this.letrasRespondidas.has(letra)) {
        this.cambiarColorLetra(false, letra);
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.mostrarBotones = false;
    this.cdr.detectChanges();
  }

  generarRosco() {
    const radio = 220;
    const centroX = 175;
    const centroY = 175;
    const pasoDeAngulo = (2 * Math.PI) / this.letras.length;

    this.letras.forEach((letra, index) => {
      const angulo = index * pasoDeAngulo - Math.PI / 2;
      const x = centroX + radio * Math.cos(angulo);
      const y = centroY + radio * Math.sin(angulo);

      const elementoLetra = document.createElement("div");
      elementoLetra.textContent = letra;

      // Aplicar los estilos directamente
      Object.assign(elementoLetra.style, {
        position: "absolute",
        width: "42px",
        height: "42px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#007aff",
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "bold",
        borderRadius: "50%",
        cursor: "pointer",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      });

      // Deshabilitar clic en letras ya respondidas
      if (this.letrasRespondidas.has(letra)) {
        elementoLetra.style.pointerEvents = 'none';
      }

      // Agregar evento de clic
      elementoLetra.onclick = () => {
        if (!this.letrasRespondidas.has(letra)) {
          this.mostrarPregunta(letra);
        }
      };

      // Agregar la letra al rosco
      this.roscoContainer.nativeElement.appendChild(elementoLetra);
    });
  }

  mostrarPregunta(letra: string) {
    // Quitar el color amarillo de la letra previamente seleccionada
    const elementosLetras = this.roscoContainer.nativeElement.children;
    Array.from(elementosLetras).forEach((elemento: any) => {
      if (elemento.style.backgroundColor === "white") {
        elemento.style.backgroundColor = "#007aff";
        elemento.style.color = "white";
        elemento.style.border = "none";
      }
    });

    // Marcar la nueva letra seleccionada en amarillo
    Array.from(elementosLetras).forEach((elemento: any) => {
      if (elemento.textContent === letra) {
        elemento.style.backgroundColor = "white";
        elemento.style.border = "2px solid #007aff";
        elemento.style.borderColor = "#007aff";
        elemento.style.color = "#007aff";
      }
    });

    // Guardar la letra seleccionada
    this.letraActual = letra;
    this.questionContainer.nativeElement.textContent = this.preguntas[letra] || "Pregunta no disponible.";

    // Generar opciones de respuesta
    const correctAnswer = this.respuestas[letra];
    const incorrectAnswer = this.respuestasIncorrectas?.[letra] || "Opción incorrecta"; // Evita errores si no existe

    this.currentOptions = this.shuffleArray([correctAnswer, incorrectAnswer]); // Mezclar opciones

    this.mostrarBotones = true;
  }

  shuffleArray(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  async checkAnswer(option: string) {
    const correctAnswer = this.respuestas[this.letraActual];

    if (option.toLowerCase() === correctAnswer.toLowerCase()) {
      this.correctAnswers++;
      await this.mostrarToast("¡Correcto!", 'success');
      this.cambiarColorLetra(true);
    } else {
      await this.mostrarToast("Incorrecto, la respuesta era: " + correctAnswer, 'danger');
      this.cambiarColorLetra(false);
    }

    // Marcar la letra como respondida
    this.letrasRespondidas.add(this.letraActual);
    this.actualizarRosco();

    // Verificar si el juego ha terminado
    if (this.letrasRespondidas.size === this.letras.length) {
      this.mostrarBotones = false;
      this.cdr.detectChanges();
      // Mostrar el modal de puntuación
      this.mostrarModalPuntuacion();
      this.questionContainer.nativeElement.textContent = "¡Juego terminado!";
    } else {
      // Mostrar la siguiente pregunta
      this.siguienteLetra();
      // Mostrar los botones después de una respuesta
    }

    this.mostrarBotones = true;

  }


  cambiarColorLetra(esCorrecto: boolean, letra: string = this.letraActual) {
    const elementosLetras = this.roscoContainer.nativeElement.children;
    Array.from(elementosLetras).forEach((elemento: any) => {
      if (elemento.textContent === letra) {
        elemento.style.backgroundColor = esCorrecto ? "green" : "red";
        elemento.style.color = "white";
        elemento.style.border = "none";
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }

  actualizarRosco() {
    const elementosLetras = this.roscoContainer.nativeElement.children;
    Array.from(elementosLetras).forEach((elemento: any) => {
      if (this.letrasRespondidas.has(elemento.textContent)) {
        elemento.style.pointerEvents = 'none';
      }
    });
  }

  siguienteLetra() {
    // Obtener el índice de la letra actual
    const indexActual = this.letras.indexOf(this.letraActual);
    const totalLetras = this.letras.length;

    // Buscar la siguiente letra no respondida en sentido horario
    for (let i = 1; i < totalLetras; i++) {
      const siguienteIndex = (indexActual + i) % totalLetras; // Círculo en el rosco
      const siguienteLetra = this.letras[siguienteIndex];

      if (!this.letrasRespondidas.has(siguienteLetra)) {
        this.mostrarPregunta(siguienteLetra);
        return;
      }
    }
  }

}
