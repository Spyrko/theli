import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";

@Component({
  selector: 'app-not-found',
  imports: [
    MatGridList,
    MatGridTile
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {

}
