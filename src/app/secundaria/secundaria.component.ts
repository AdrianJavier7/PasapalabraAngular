import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-secundaria',
  templateUrl: './secundaria.component.html',
  styleUrls: ['./secundaria.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SecundariaComponent implements OnInit {
  @ViewChild('rosco', { static: true }) roscoContainer!: ElementRef;
  @ViewChild('question', { static: true }) questionContainer!: ElementRef;
  @ViewChild('answer', { static: true }) answerInput!: ElementRef;

  letters: string[] = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  questions: { [key: string]: string } = {};
  answers: { [key: string]: string } = {};
  currentLetter: string = "";

  constructor() {
    this.letters.forEach(letter => {
      this.questions[letter] = `Con la ${letter}: Pregunta ejemplo.`;
      this.answers[letter] = `Respuesta ${letter}`;
    });
  }

  ngOnInit() {
    this.generateRosco();
  }

  generateRosco() {
    const radius = 140;
    const centerX = 175;
    const centerY = 175;
    const angleStep = (2 * Math.PI) / this.letters.length;

    this.letters.forEach((letter, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const letterElement = document.createElement("div");
      letterElement.classList.add("letter");
      letterElement.textContent = letter;
      letterElement.style.left = `${x}px`;
      letterElement.style.top = `${y}px`;
      letterElement.onclick = () => this.showQuestion(letter);

      this.roscoContainer.nativeElement.appendChild(letterElement);
    });
  }

  showQuestion(letter: string) {
    this.currentLetter = letter;
    this.questionContainer.nativeElement.textContent = this.questions[letter] || "Pregunta no disponible.";
  }

  checkAnswer() {
    const answer = this.answerInput.nativeElement.value.trim();
    if (this.answers[this.currentLetter] && answer.toLowerCase() === this.answers[this.currentLetter].toLowerCase()) {
      alert("¡Correcto!");
    } else {
      alert("Incorrecto, la respuesta era: " + (this.answers[this.currentLetter] || "Desconocida"));
    }
  }
}
