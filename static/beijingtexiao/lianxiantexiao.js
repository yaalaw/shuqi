
const createParticle = (x, y, hu, firework) => {
  const pos = createVector(x, y);
  let vel
  if (firework) {
    vel = createVector(0, random(-12, -8)); 
  } else {
    vel = p5.Vector.random2D();
    vel.mult(random(2, 10));
  }
  const acc = createVector(0, 0);
  let lifespan = 505;
  
  const applyForce = (force) => {
    acc.add(force);
  };
  
  const show = () => {
    if (!firework) {
      strokeWeight(2); 
      stroke(hu, 255, 255, lifespan);
    } else {
      strokeWeight(4);
      stroke(hu, 255, 255); 
    }
    point(pos.x, pos.y);
  };
  
  const update = () => {
    if (!firework) {
      vel.mult(0.9);
      lifespan -= 4;
    }
    vel.add(acc);
    pos.add(vel);
    acc.mult(0);
  };
  
  const done = () => {
    return lifespan < 0;
  }; 
  
  return {
    update,
    show,
    applyForce,
    vel,
    pos,
    done
  }
};

const createFirework = () => {
  const hu = random(255);
  const firework = createParticle(random(width), height, hu, true);
  let exploded = false;
  const particles = [];
  
  const explode = () => {
    for (let i = 0; i < 100; i++) {
      let p = createParticle(firework.pos.x, firework.pos.y, hu, false);
       particles.push(p);
    }
  };
  
  const done = () => {
    return exploded && particles.length <= 0; 
  }; 
  
  const update = () => {
    if (!exploded) {
      firework.applyForce(gravity);
      firework.update();
      if (firework.vel.y >= 0) {
          exploded = true;
          explode();
      }
    } else {
       particles.forEach((particle, i) => {
         particle.applyForce(gravity); 
         particle.update();
         if(particle.done()) {
           particles.splice(i, 1);
         }
      });
    }
  };
  
  const show = () => {
    if (!exploded) {
      firework.show();
    }
   particles.forEach(particle => {
      particle.show();
    });
  };
  
  return {
    update,
    show,
    done
  };
};

let fireworks = [];
let gravity;

function setup() {
  createCanvas(1200, 700);
  colorMode(HSB, 255, 255, 255, 255);
  gravity = createVector(0, 0.2);
  background(0, 0, 0);
}

function draw() {
  background(0, 0, 0, 25);
  if (random(1) < 0.03) {
     fireworks.push(createFirework());  
  }
  fireworks.forEach((firework, i) => {
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1)
    }
  });
}