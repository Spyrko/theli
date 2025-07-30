import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-unauthorized',
  imports: [
    MatGridList,
    MatGridTile
  ],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized {

}
