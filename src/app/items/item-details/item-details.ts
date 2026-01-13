import { Component, Input, inject  } from '@angular/core';
import { Item } from '../../classes/Item';
import { User } from '../../classes/User';
import { MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpService } from '../../services/http-service';
import { OnInit } from '@angular/core';
import { MatCell, MatTable } from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-item-details',
  imports: [MatAnchor, MatIcon, MatTableModule, MatCell],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css',
})
export class ItemDetails {
  @Input() item!: Item;
  user: User;
  newItem : boolean = false;
  editMode : boolean = false;
  private httpService = inject(HttpService);
  private sanitizer = inject(DomSanitizer);
  imageUrl : SafeUrl | undefined;
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
   }
       ngOnInit() {
        if (this.item?.imageId) {
            this.loadImage();
        }
    }
    loadImage() {
      this.httpService.getImage(this.item.imageId).subscribe({
          next: (blob : Blob) => {
              // Create a local URL for the binary blob
              const objectURL = URL.createObjectURL(blob);
              // Sanitize the URL so Angular doesn't block it for security
              this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: (err) => console.error('Could not load image', err)
      });
    }
  getItemOwner(item : Item) {
    return item.userId;
  }
    deleteOtherProperty(_t23: any) {
  throw new Error('Method not implemented.');
  }
  autocompleteDetails() {
  throw new Error('Method not implemented.');
  }
  deleteItem() {
  throw new Error('Method not implemented.');
  }
  editItem() {
  throw new Error('Method not implemented.');
  }
  cancel() {
  throw new Error('Method not implemented.');
  }
  save() {
  throw new Error('Method not implemented.');
  }
  getAdditionalDataList()  {
  return Array.from(this.item.additionalData.entries());
}
}
