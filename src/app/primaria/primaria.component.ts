import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-primaria',
  templateUrl: './primaria.component.html',
  styleUrls: ['./primaria.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class PrimariaComponent implements OnInit {
  @ViewChild('rosco', { static: true }) roscoContainer!: ElementRef;
  @ViewChild('question', { static: true }) questionContainer!: ElementRef;

  letters: string[] = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  questions: { [key: string]: string } = {};
  answers: { [key: string]: { A: string, B: string, correct: string } } = {};
  currentLetter: string = "";

  constructor() {
    this.letters.forEach(letter => {
      this.questions[letter] = `Con la ${letter}: Pregunta ejemplo.`;
      this.answers[letter] = { A: `Respuesta A ${letter}`, B: `Respuesta B ${letter}`, correct: 'A' };
    });
  }

  ngOnInit() {
    this.generateRosco();
  }

  generateRosco() {
    const radius = 220;
    const centerX = 175;
    const centerY = 175;
    const angleStep = (2 * Math.PI) / this.letters.length;

    this.letters.forEach((letter, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const letterElement = document.createElement("div");
      letterElement.textContent = letter;

      Object.assign(letterElement.style, {
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

      letterElement.onclick = () => this.showQuestion(letter);

      this.roscoContainer.nativeElement.appendChild(letterElement);
    });
  }

  showQuestion(letter: string) {
    this.currentLetter = letter;
    this.questionContainer.nativeElement.textContent = this.questions[letter] || "Pregunta no disponible.";

    const answerAButton = document.querySelector('.boton1') as HTMLElement;
    const answerBButton = document.querySelector('.boton2') as HTMLElement;

    if (answerAButton && answerBButton) {
      if (letter) {
        answerAButton.style.display = 'block';
        answerBButton.style.display = 'block';
        answerAButton.textContent = this.answers[letter]?.A || "Respuesta A";
        answerBButton.textContent = this.answers[letter]?.B || "Respuesta B";
      } else {
        answerAButton.style.display = 'none';
        answerBButton.style.display = 'none';
      }
    }
  }

  checkAnswer(selectedAnswer: string) {
    const correctAnswer = this.answers[this.currentLetter]?.correct;
    if (correctAnswer && selectedAnswer === correctAnswer) {
      alert("¡Correcto!");
    } else {
      alert("Incorrecto, la respuesta correcta era: " + (correctAnswer || "Desconocida"));
    }
  }
}
