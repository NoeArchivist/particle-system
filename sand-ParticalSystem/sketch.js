// JavaScript code
let backgroundImage;
let lines = [];
let sandColor;
let sandSize;
let particles = [];

function preload() {
  // Load the background image
  backgroundImage = loadImage('black-background.jpg'); 
}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); // Position canvas at the top left corner of the screen
  sandColor = color('#c2b280'); // Default sand color
  sandSize = 5; // Default sand size
  updateSizeDisplay();
}

function draw() {
   // Draw the background image
   image(backgroundImage, 0, 0, width, height);
  
  
  // Draw lines
  for (let i = lines.length - 1; i >= 0; i--) {
    lines[i].update();
    lines[i].display();
    lines[i].fade();
    if (lines[i].isDead()) {
      lines.splice(i, 1); // Remove dead lines
    }
  }
  
  // Draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1); // Remove dead particles
    }
  }
}

function mouseDragged() {
  let line = new DrawnLine(mouseX, mouseY, pmouseX, pmouseY, sandColor, sandSize);
  lines.push(line);
}

function mouseClicked() {
  spreadParticles(mouseX, mouseY);
}

function spreadParticles(x, y) {
  // Spread particles gradually from the clicked point over a duration of time
  let spreadDuration = 1000; // Duration in milliseconds
  let numParticles = 100; // Number of particles to spread
  let spreadSpeed = 2; // Speed of spreading particles
  
  for (let i = 0; i < numParticles; i++) {
    let spreadX = x + random(-15, 15); // Spread within a range of 10 to 15 pixels horizontally
    let spreadY = y + random(-15, 15); // Spread within a range of 10 to 15 pixels vertically
    let particle = new Particle(spreadX, spreadY, spreadDuration, spreadSpeed);
    particles.push(particle);
  }
}

function changeSandColor() {
  sandColor = color(document.getElementById("colorPicker").value);
}

function increaseSize() {
  sandSize += 1;
  updateSizeDisplay();
}

function decreaseSize() {
  if (sandSize > 1) {
    sandSize -= 1;
    updateSizeDisplay();
  }
}

function updateSizeDisplay() {
  document.getElementById("sizeDisplay").textContent = sandSize;
}

class DrawnLine {
  constructor(x1, y1, x2, y2, color, size) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.size = size;
    this.opacity = 255; // Initial opacity
    this.fadeSpeed = 0.3; // Slower fade speed
    this.animationSpeed = 0.005; // Animation speed (adjust as needed)
    this.offsetX = 0; // Initial offset
    this.offsetY = 0; // Initial offset
  }

  update() {
    // Add small, slow movement
    this.offsetX += random(-0.5, 0.5) * this.animationSpeed;
    this.offsetY += random(-0.5, 0.5) * this.animationSpeed;
    this.x1 += this.offsetX;
    this.y1 += this.offsetY;
    this.x2 += this.offsetX;
    this.y2 += this.offsetY;
  }

  display() {
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.opacity);
    strokeWeight(this.size);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  fade() {
    this.opacity -= this.fadeSpeed; // Reduce opacity gradually
  }

  isDead() {
    return this.opacity <= 0; // Line is dead when opacity reaches zero
  }
}

class Particle {
  constructor(x, y, duration, speed,color) {
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.speed = speed;
    this.startTime = millis();
    this.size = random(2, 5);
    this.alpha = 255;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.color = color;
  }

  update() {
    let elapsed = millis() - this.startTime;
    let progress = constrain(elapsed / this.duration, 0, 1);
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.alpha = map(progress, 0, 1, 255, 0);
  }

  display() {
    noStroke();
    fill(document.getElementById("colorPicker").value);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 0;
  }
}
