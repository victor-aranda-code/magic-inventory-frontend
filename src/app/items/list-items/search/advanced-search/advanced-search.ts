import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../../services/http-service';
import { Item } from '../../../../models/Item';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-advanced-search',
  imports: [MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './advanced-search.html',
  styleUrl: './advanced-search.css',
})
export class AdvancedSearch {
  advancedSearchTerm: string = '';
  imageFile: any = null;
  imageUrl: SafeUrl | null = null;
  httpService: HttpService;
  sanitizer: DomSanitizer;
  cdr: ChangeDetectorRef;
  snackBar: MatSnackBar;

  isSearching: boolean = false;
  @Output() onSearchResult = new EventEmitter<Item[]>();

  constructor(httpService: HttpService, sanitizer: DomSanitizer, cdr: ChangeDetectorRef, snackBar: MatSnackBar) {
    this.httpService = httpService;
    this.sanitizer = sanitizer;
    this.cdr = cdr;
    this.snackBar = snackBar;
  }

  advancedSearch() {
    let image = this.imageFile == null ? '' : this.imageFile;
    this.isSearching = true;
    this.cdr.detectChanges();

    this.httpService.advancedSearch(image, this.advancedSearchTerm).subscribe({
      next: (response) => {
        // Map response to Item objects and emit to parent
        const mappedItems = response.map((item: any) => Item.fromJSON(item));
        this.onSearchResult.emit(mappedItems);
        this.isSearching = false;
        if (mappedItems.length === 0) {
          this.snackBar.open('No items found matching your search.', 'Close', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Search error:', error);
        // Tip: You might want to show a MatSnackBar error here
        this.isSearching = false;
        this.snackBar.open('An error occurred during search. Please try again.', 'Close', { duration: 5000 });
        this.cdr.detectChanges();
      }
    });
  }

  onImageChanged(event: any) {
    const file = event.target.files[0];
    this.imageFile = file;
    if (file) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    this.cdr.detectChanges();
  }

  deleteImage() {
    this.imageFile = null;
    this.imageUrl = null;
    this.cdr.detectChanges();
  }
}
