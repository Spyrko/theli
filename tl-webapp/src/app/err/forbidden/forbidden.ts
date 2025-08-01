import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-forbidden',
  imports: [
    MatGridList,
    MatGridTile
  ],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css'
})
export class Forbidden {

}
