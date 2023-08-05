class SoundVisualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  file: HTMLInputElement;
  audio: HTMLAudioElement;
  constructor() {
    this.canvas = document.getElementById("canvas1")! as HTMLCanvasElement;
    this.file = document.getElementById("fileupload")! as HTMLInputElement;
    this.audio = document.getElementById("audio1")! as HTMLAudioElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initClickOnContainer();
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
      barHeight = dataArray[i];
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(
        x,
        this.canvas.height - barHeight,
        barWidth * 2,
        barHeight
      );
      x += barWidth * 2;
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
      let barHeight;
      let x;
    });
  }

  private initClickOnContainer() {
    const container = document.getElementById("container")!;
    let audioSource;
    let analyser: any;

    container.addEventListener("click", () => {
      this.audio.src = "";
      const audioCtx = new AudioContext();
      this.audio.play();
      audioSource = audioCtx.createMediaElementSource(this.audio);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray: Uint8Array = new Uint8Array(bufferLength);

      const barWidth = this.canvas.width / bufferLength;
      let barHeight: any;
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
}

const soundVis = new SoundVisualizer();
