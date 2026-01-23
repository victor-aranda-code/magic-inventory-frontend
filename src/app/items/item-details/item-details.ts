import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { Item } from '../../models/Item';
import { User } from '../../models/User';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { HttpService } from '../../services/http-service';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth-service';
import { Role } from '../../models/Role';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Header } from "../../header/header";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [MatButtonModule, MatIcon, MatTableModule, CommonModule, FormsModule, MatInputModule, Header],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css',
})
export class ItemDetails {

  @Input('id') itemId?: string;
  @Input() item?: Item;
  user: User;
  owner?: User;
  newItem: boolean = false;
  editMode: boolean = false;
  protected readonly Role = Role;
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  imageUrl?: SafeUrl;
  image: File | undefined;
  router: Router;
  protected additionalDataList: { key: string, value: string }[] = [];
  protected displayedColumns: string[] = ['key', 'value', 'actions'];
  protected displayedColumnsReadOnly: string[] = ['key', 'value'];
  imageFile: string;
  newImageFile: string;
  sanitizer: DomSanitizer;

  constructor(router: Router, sanitizer: DomSanitizer) {
    this.newItem = false;
    this.editMode = false;
    this.router = router;
    this.sanitizer = sanitizer;
    this.imageFile = "";
    this.newImageFile = "";
    this.imageUrl = undefined;

    this.user = new User(
      localStorage.getItem('username') || '',
      (localStorage.getItem('role') as Role) || Role.USER
    );
  }

  ngOnInit() {
    if (this.itemId && this.itemId !== "") {//Already existing item
      this.loadItem(this.itemId);
      this.newItem = false;
      this.editMode = false;
    } else if (!this.item) {//New item
      this.item = Item.builder().build();
      if (this.router.url.includes('new')) {
        this.newItem = true;
      }
      this.afterItemLoaded();
    } else {//Other cases
      this.editMode = false;
      this.newItem = false;
      this.afterItemLoaded();
    }
  }
  loadItem(itemId: string) {
    this.httpService.findItemById(itemId).subscribe({
        next: (item) => {
          this.item = Item.fromJSON(item);
          this.afterItemLoaded();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error loading item", err);
          this.cdr.detectChanges();
        }
      });
  }

  afterItemLoaded() {
    if (this.item) {
      if (this.user.role === Role.ADMIN && this.item.userId) {
        this.getItemOwner(this.item);
      }
      if (this.item.imageId) {
        this.loadImage();
      } else {
        this.imageUrl = undefined;
      }
      if (this.item?.additionalData instanceof Map && this.item.additionalData.size > 0) {
        this.additionalDataList = Array.from(this.item.additionalData.entries()).map(([key, value]) => ({ key, value }));
      } else if (this.item?.additionalData && !(this.item.additionalData instanceof Map)) {
        this.additionalDataList = Object.entries(this.item.additionalData).map(([key, value]) => ({ key, value: String(value) }));
      } else {
        this.additionalDataList = [];
      }
    }
  }
  loadImage() {
    if (this.item?.imageId) {
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
  getItemOwner(item: Item) {
    if (!item.userId) {
      return;
    }
    this.authService.getUserById(item.userId).subscribe(owner => {
      this.owner = User.fromJSON(owner);
      this.cdr.detectChanges();
    });
  }
  deleteOtherProperty(index: number) {
    this.additionalDataList.splice(index, 1);
    this.additionalDataList = [...this.additionalDataList];
  }
  autocompleteDetails() {
    throw new Error('Method not implemented.');
  }
  deleteItem() {
    if (this.item?.id) {
      this.httpService.deleteItem(this.item.id).subscribe(() => {
        this.router.navigate(['/items']);
      });
    }
  }
  editItem() {
    if (this.item) {
      this.editMode = true;
    }
  }
  cancel() {
    if (this.newItem) {
      this.router.navigate(['/items']);
    }
    if (this.editMode) {
      this.editMode = false;
      this.newImageFile = "";
      this.loadItem(this.itemId!);
    }

  }
  save() {
    if (!this.item) {
      return;
    }
    if (!this.editMode && !this.newItem) {
      return;
    }
    //Copy edited item
    let itemToUpdate = Item.builder()
      .withId(this.item.id)
      .withName(this.item.name)
      .withCategory(this.item.category)
      .withDescription(this.item.description)
      .withCreated(this.item.created)
      .withLocation(this.item.location)
      .withUserId(this.item.userId)
      .withImageId(this.item.imageId)
      .build();
    itemToUpdate.additionalData = new Map<string, string>();
    //TODO: validate non duplicity of keys
    this.additionalDataList.forEach((item) => {
      if (item.key && item.value) {
        itemToUpdate.additionalData.set(item.key, item.value);
      }
    });
    //Create item
    if (this.newItem) {
      this.httpService.addItem(itemToUpdate).subscribe((item) => {
        this.item = Item.fromJSON(item);
        this.router.navigate(['/items/' + this.item.id]);
      });
    }
    //Update item
    else {
      if (this.editMode) {
        this.httpService.updateItem(itemToUpdate).subscribe((item) => {
          this.item = Item.fromJSON(item);
          this.router.navigate(['/items/' + this.item.id]);
          this.editMode = false;
          this.newItem = false;
          this.cdr.detectChanges();
        });
      }
    }
    
    if (!this.item || !this.item.id) {
      return;
    }
    //Update image
    if ((this.editMode || this.newItem) && this.imageUrl !== "") {
      this.httpService.addImage(this.item.id, this.newImageFile).subscribe((updatedItem) => {
        if (this.item) {
          this.item.imageId = updatedItem.imageId;
          this.loadImage();
          this.cdr.detectChanges();
        }
      });
    //Image deleted
    } else if (this.editMode && (this.item.imageId != null && this.imageUrl === "")) {
      this.httpService.deleteImage(this.item.imageId).subscribe(() => {
        if (this.item) {
          this.item.imageId = "";
          this.loadImage();
          this.cdr.detectChanges();
        }
      });
    }
  }

  onImageChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.newImageFile = file;
      // 1. Create a local URL for the blob
      const objectURL = URL.createObjectURL(file);
      // 2. Mark the URL as safe for Angular to use in [src]
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.cdr.detectChanges();
    }
  }
  addOtherProperty() {
    this.additionalDataList = [...this.additionalDataList, { key: '', value: '' }];
  }

  deleteImage() {
    this.newImageFile = "";
    this.imageUrl = undefined;
    this.cdr.detectChanges();
  }
}
