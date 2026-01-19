import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ListItems } from './items/list-items/list-items';
import { Login } from './authentication/login/login';
import { Register } from './authentication/login/register/register';
import { ItemDetails } from './items/item-details/item-details';
import { ManageUsers } from './manage-users/manage-users';

import { AuthGuard } from './utils/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'home',
        component: Home,
        canActivate: [AuthGuard],
        data: { user: 'User' }
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'items',
        component: ListItems,
        canActivate: [AuthGuard]
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'items/new',
        component: ItemDetails,
        canActivate: [AuthGuard]
    },
    {
        path: 'items/:id',
        component: ItemDetails,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: ManageUsers,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
