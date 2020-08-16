import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';


const ViewMaterialComponents = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatMenuModule,
  MatIconModule,
]

@NgModule({
  imports: [ViewMaterialComponents],
  exports: [ViewMaterialComponents]
})
export class ViewMaterialModule { }
