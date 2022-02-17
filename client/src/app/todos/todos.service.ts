import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToDo, ToDoStatus } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
// The URL for the users part of the server API.
readonly userUrl: string = environment.apiUrl + 'todos';

// The private `HttpClient` is *injected* into the service
// by the Angular framework. This allows the system to create
// only one `HttpClient` and share that across all services
// that need it, and it allows us to inject a mock version
// of `HttpClient` in the unit tests so they don't have to
// make "real" HTTP calls to a server that might not exist or
// might not be currently running.
constructor(private httpClient: HttpClient) {
}

/**
 * Get all the users from the server, filtered by the information
 * in the `filters` map.
 *
 * It would be more consistent with `UserListComponent` if this
 * only supported filtering on age and role, and left company to
 * just be in `filterUsers()` below. We've included it here, though,
 * to provide some additional examples.
 *
 * @param filters a map that allows us to specify a target role, age,
 *  or company to filter by, or any combination of those
 * @returns an `Observable` of an array of `Users`. Wrapping the array
 *  in an `Observable` means that other bits of of code can `subscribe` to
 *  the result (the `Observable`) and get the results that come back
 *  from the server after a possibly substantial delay (because we're
 *  contacting a remote server over the Internet).
 */
getUsers(filters?: { status?: ToDoStatus; owner?: string; body?: string; category?: string }): Observable<ToDo[]> {
  // `HttpParams` is essentially just a map used to hold key-value
  // pairs that are then encoded as "?key1=value1&key2=value2&…" in
  // the URL when we make the call to `.get()` below.
  let httpParams: HttpParams = new HttpParams();
  if (filters) {
    if (filters.status) {
      httpParams = httpParams.set('status', filters.status);
    }
    if (filters.owner) {
      httpParams = httpParams.set('owner', filters.owner);
    }
    if (filters.body) {
      httpParams = httpParams.set('body', filters.body);
    }
    if (filters.category) {
      httpParams = httpParams.set('category', filters.category)
    }
  }
  // Send the HTTP GET request with the given URL and parameters.
  // That will return the desired `Observable<User[]>`.
  return this.httpClient.get<ToDo[]>(this.userUrl, {
    params: httpParams,
  });
}

/**
 * Get the `ToDo` with the specified ID.
 *
 * @param id the ID of the desired user
 * @returns an `Observable` containing the resulting user.
 */
getUserById(id: string): Observable<ToDo> {
  return this.httpClient.get<ToDo>(this.userUrl + '/' + id);
}

/**
 * A service method that filters an array of `User` using
 * the specified filters.
 *
 * Note that the filters here support partial matches. Since the
 * matching is done locally we can afford to repeatedly look for
 * partial matches instead of waiting until we have a full string
 * to match against.
 *
 * @param users the array of `Users` that we're filtering
 * @param filters the map of key-value pairs used for the filtering
 * @returns an array of `Users` matching the given filters
 */
filterUsers(users: User[], filters: { name?: string; company?: string }): User[] {
  let filteredUsers = users;

  if (filters.name) {
    filters.name = filters.name.toLowerCase();
    filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().indexOf(filters.name) !== -1);
  }

  if (filters.company) {
    filters.company = filters.company.toLowerCase();
    filteredUsers = filteredUsers.filter(user => user.company.toLowerCase().indexOf(filters.company) !== -1);
  }

  return filteredUsers;
}
