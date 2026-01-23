import { Component, Input } from '@angular/core';
import { Item } from '../../../models/Item';
import { HttpService } from '../../../services/http-service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent } from "@angular/material/card";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-card-item',
  imports: [MatCard, MatIconModule],
  templateUrl: './card-item.html',
  styleUrl: './card-item.css',
})
export class CardItem {
  @Input() item: Item;
  imageUrl: SafeUrl | undefined;
  router: Router;
  sanitizer: DomSanitizer;
  constructor(private httpService: HttpService, private cdr: ChangeDetectorRef, router: Router, sanitizer: DomSanitizer) {
    this.item = new Item();
    this.router = router;
    this.sanitizer = sanitizer;
    this.imageUrl = undefined;
  }

  ngOnInit(): void {
    this.loadImage();
  }

  loadImage() {
    if (this.item.imageId != null) {
      this.httpService.getImage(this.item.imageId + "").subscribe({
        next: (blob: Blob) => {
          // 1. Create a local URL for the blob
          const objectURL = URL.createObjectURL(blob);

          // 2. Mark the URL as safe for Angular to use in [src]
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error(err)
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl('');
        }
      });
    }
  }
  onItemSelect(item: Item) {
    this.router.navigate(['/items', item.id]);
  }
  ngOnDestroy() {
    if (this.imageUrl) {
      // Extract the original string URL if needed or just handle the cleanup logic
      // Note: bypassSecurityTrustUrl returns a SafeUrl object. 
      // If you stored the raw objectURL string separately:
      // URL.revokeObjectURL(this.rawObjectURL);
    }
  }
}
