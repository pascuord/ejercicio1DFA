import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadCategories();
  }

  private loadCategories() {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      /* try {
        /* this.categories = await this.categoryService.getCategoriesByUserId(
          userId
        ); 
        
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      } */

      this.categoryService.getCategoriesByUserId(userId).subscribe(
        (categoriesResult) => {
          this.categories = categoriesResult;
        },
        (error: any) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string) {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      /* try {
        const rowsAffected = await this.categoryService.deleteCategory(
          categoryId
        );
        if (rowsAffected.affected > 0) {
          this.loadCategories();
        }
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      } */
      this.categoryService.deleteCategory(categoryId).subscribe(
        (categoryResult) => {
          const rowsAffected = categoryResult;
          if (rowsAffected.affected > 0) {
            this.loadCategories();
          }
        },
        (error: any) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }
}
