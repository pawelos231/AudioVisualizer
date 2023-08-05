class SoundVisualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  file: HTMLInputElement;
  audio: HTMLAudioElement;
  STOP: HTMLElement;
  constructor() {
    this.canvas = document.getElementById("canvas1")! as HTMLCanvasElement;
    this.file = document.getElementById("fileupload")! as HTMLInputElement;
    this.audio = document.getElementById("audio")! as HTMLAudioElement;
    this.STOP = document.getElementById("STOP")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initSTOPListener();
    this.addListenerOnInput();
  }

  private drawVisualizer = (
    bufferLength: number,
    x: number,
    barWidth: number,
    barHeight: number,
    dataArray: Uint8Array
  ) => {
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 1.2;
      const red = (i * barHeight) / 20;
      const blue = barHeight / 2;
      const green = i * 4;
      this.ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
      this.ctx.fillRect(
        this.canvas.width / 2 + x,
        this.canvas.height - barHeight,
        barWidth,
        barHeight
      );
      x += barWidth;
    }
    x = 0;
    for (let i = bufferLength / 2; i >= 0; i--) {
      barHeight = dataArray[i] * 1.2;
      const red = (i * barHeight) / 20;
      const blue = barHeight / 2;
      const green = i * 2;
      this.ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
      this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  };

  private addListenerOnInput() {
    const filesInput = this.file;
    let audioSource;
    let analyser: any;

    this.file.addEventListener("change", () => {
      const files = filesInput.files;
      console.log(URL.createObjectURL(files![0]));
      this.audio.src = URL.createObjectURL(files![0]);
      this.audio.load();
      this.audio.play();

      const audioCtx = new AudioContext();
      audioSource = audioCtx.createMediaElementSource(this.audio);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const barWidth = this.canvas.width / bufferLength;
      let barHeight: number;
      let x;

      const animate = () => {
        x = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        analyser.getByteFrequencyData(dataArray);
        this.drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  private initSTOPListener() {
    this.STOP.addEventListener("click", () => {
      this.audio.src = "";
    });
  }
}

const soundVis = new SoundVisualizer();
