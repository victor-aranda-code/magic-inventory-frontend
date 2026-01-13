import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ListItems } from './items/list-items/list-items';
import { Login } from './authentication/login/login';
import { Register } from './authentication/login/register/register';
import { ItemDetails } from './items/item-details/item-details';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'home',
        component: Home,
        data: { user: 'User' }
    },
    {
        path: 'items',
        component: ListItems
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'items/new',
        component: ItemDetails
    },  
    {
        path: 'items/:id',
        component: ItemDetails
    },
];
