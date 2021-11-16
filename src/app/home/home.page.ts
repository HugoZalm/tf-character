import { Component , ViewChild , ElementRef, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as tf from '@tensorflow/tfjs';
import { tensor1d } from '@tensorflow/tfjs';
import { DrawableDirective } from '../directives/drawable.directive';
import { ChartComponent } from '../components/chart/chart.component';
import { rendererTypeName } from '@angular/compiler';


@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {

  @ViewChild(DrawableDirective) canvas;

  linearModel: tf.Sequential;
  prediction: any;
  inputTaken: any;
  model: tf.LayersModel;
  ctx: CanvasRenderingContext2D;
  pos = { x: 0, y: 0 };
  canvasElement: any;


  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public platform: Platform
  ) {}

  ionViewDidLoad(){
    this.loadModel();
  }

  async loadModel(){
    this.model = await tf.loadLayersModel('/assets/model.json');
  }

  async predict(imageData: ImageData) {

    const pred = await tf.tidy(() => {

      let img = tf.browser.fromPixels(imageData);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, 'float32');

      // Make and format the predications
      const output = this.model.predict(img) as any;

      // Save predictions on the component
      this.prediction = Array.from(output.dataSync());
    });

  }

  eraseButton(){
    this.prediction = [0,0,0,0,0,0,0,0,0,0];
    this.canvas.clear();
  }

}
