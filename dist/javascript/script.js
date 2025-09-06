//Javascript to get the "dropdown" menu to work, although I
//moved it to the sidebar. Note: (e) => is an arrow function
//and is shorthand for function(e) {...}. e can be anything.
//its just variable that is passed to the function that
//is being defined.
document.addEventListener('DOMContentLoaded', () => {
const menuBtn = document.getElementById('menu-btn');
const dropdown = document.getElementById('dropdown');

//When you click on the sidebar menu, it makes it so
//nothing below the menu will work if clicked.
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

//Wanted for the menu to disappear if you click outside of it.
//Checks to see if youare clicking in the menu or outside of it.
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
         dropdown.classList.remove('active');
    }
  });

  //Makes menu go away if you successfully click a link
  dropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
    dropdown.classList.remove('active');
    });
  });
});

//The sound when you hover over the leprechaun logo
const logo = document.getElementById('leplogo');
const sound = document.getElementById('hover-sound');

sound.volume = 0.08;

logo.addEventListener('mouseenter', () => {
  sound.currentTime = 0;
  sound.play();
});

//Help the goBack link in the contruction html go
//back to the page that called it or check your history
//and go back one page.
function goBack() {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.history.back();
  }
}

/**I know by convention, we are not supposed
 * to explain how code works, but ChatGPT was
 * used to help write this and proofread it
 * to make sure it worked correctly. I know
 * that we are allowed to use AI, but I want
 * to make sure I use it responsibly. To show
 * that I learned something and not just allowed
 * ChatGPT to do my work, I will explain what
 * I learned and how this works.
 */

// Canvas is needed for javascript to do graphics on the screen.
// This portion I did due to my research at W3Schools.
const canvas = document.getElementById("noise"); 
// We use this to access the 2D context, with this the javascript can paint pixels on the screen
const ctx = canvas.getContext("2d");

// Canvas needs a width and height, this allows canvas
// to get the screens dimensions on the fly. This
// was also done by me.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// After testing the initial noise generation
// I found that if I started the screen smaller than my
// labtops native size, then the noise wouldn't
// fill the entire screen. ChatGPT told me
// that I should have the screen "listen" for
// whenever the page is resized so that it can
// resize the canvas dimensions.
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// This is where the noise is created. Originally
// I was going to use a picture of static, mess with
// its opacity and just have it shake. But, it wasn't
// what I was looking for. after a lot of searching I found
// ImageData, which is what represents the pixels in the
// canvas and ImageData.data is the array that holds the 
// color information. I just had no idea how to appraoch
// messing with it as I learned that if we mess with
// the color data, we can get the flickering effect.
// Since I am familiar with for loops in java, I was
// able to write one that went through the array.
// ChatGPT helped me tweak my original code as I couldn't
// get the noise to look quite right.
function generateNoise() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const buffer = imageData.data;

//The array is 4 numbers in a row per pixel (rgba) a
//being alpha or the transparency. Each number goes from
//0-255 which helped me understand what my RNG needed to be.
  for (let i = 0; i < buffer.length; i += 4) {
    const shade = Math.random() * 255;  //We are finding a shade of gray here
    buffer[i] = buffer[i+1] = buffer[i+2] = shade; //we are making a pixel become a random gray shade that was generated
    buffer[i+3] = 40; //transparency
  }
  ctx.putImageData(imageData, 0, 0);
}

//Used so the noise doesn't automatically start, we want a
//chance for to happen. This is the intial interval for it
//to appear.
let noiseInterval = null;

// Originally I was going to use a pre-made static sound
// but didn't sound just right. I asked ChatGPT for a
// suggestion and I learned that javascript can in fact
// make the noise for me and follow the random intervals
// of the static. So a lot of this was created by ChatGPT
let audioCtx;
// This creates the sound engine in the browser. This was
//beyond my knowledge and needed ChatGPT forhelp.
function playNoise(duration = 0.3) { 
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //Older Safari browsers needed webkitAudioContext to work.
  }

  const bufferSize = audioCtx.sampleRate * duration;
  //here we are making object that will hold the new sound sample.
  //the 1 is for mono sound, the buffersize tells us how many samples to store
  //and the third argument is the samples per second which we get from the
  //created auioCtx object. This will hold the finished waveform to be played.
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);

  //This one was something that was new to me, this actually controls
  //the actual speaker. Data is an array that holds floating-point numbers
  //from -1 to 1. Negative numbers moves the speakers cone backwards
  //positive numbers move the cone forward. This rapid movement creates
  //the actual sound.
  const data = buffer.getChannelData(0);

  // And here is where we fill the data array with the random
  // vibrations, creating the white noise on the page. The
  // RNG makes it that the noise will sound different per
  // burst.
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  //This makes the actual player for the sound and we
  //are also loading the soundwave we made into it.
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  //This is supposed to make the noise less harsh, making
  //the frequency lower. I tried it without this filter and
  //yes, it is NEEDED. It becomes very piercing without this
  //rather than the static hiss.
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass"; //only allows low frequencies through that are below the cutoff.
  filter.frequency.value = 1500; //This is the cutoff frequency that I decided on.

  //This routes the sound to the speakers, I didn't know
  //this needed to be done, ChatGPT was a huge help with this.
  //Finally, it plays the sound.
  noiseSource.connect(filter).connect(audioCtx.destination);
  noiseSource.start();
}

// Here we are adding the glitching element to the page.
// We draw the glitch onto the page with making the canvas
// element visible and setting our created noise imageData
// on an interval that it will play at random intervals.
// ChatGPT helped with the interval math, but majority of
// the code was done by me. ChatGPT helped out to make
// the static stop by making it timeout.
function startGlitch() {
  document.body.classList.add("glitching");
  canvas.style.display = "block";
  noiseInterval = setInterval(generateNoise, 50);
  playNoise(0.4 + Math.random() * 0.4);
  setTimeout(stopGlitch, 200 + Math.random() * 500);
}

//Need this to stop the glitch, makes the 
//canvas object not display and clears the
//interval once called in startGlitch.
//This is needed to create new intervals for the
//random noise intervals.
function stopGlitch() {
  clearInterval(noiseInterval);
  canvas.style.display = "none";
  document.body.classList.remove("glitching");
}

// This is how we get the "chance" for the
// the static to hit the screen. It has a 20% chance
// of activating and if so, it will call startGlitch
// to start the effect.
setInterval(() => {
  if (Math.random() < 0.2) { // 20% chance per second
    startGlitch();
  }
}, 1000);